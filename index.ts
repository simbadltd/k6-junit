const rootTestSuiteName = 'Root';
const thresholdTestSuiteName = 'Thresholds';
const thresholdFailureMessage = 'threshold exceeded';

export interface K6jUnitConfiguration {
    includeThresholds?: boolean;
    testCasePassCondition: (passed: number, failed: number) => boolean;
}

const defaultConfiguration: K6jUnitConfiguration = {
    includeThresholds: true,
    testCasePassCondition: (passed, failed) => passed > 0 && failed === 0
};

const ident = function (x: number) {
    return '  '.repeat(x);
};

const get = function (data: any, path: string[]) {
    let i = 0;
    const len = path.length;
    for (i = 0; typeof data === 'object' && i < len; ++i) {
        data = data[path[i]];
    }
    return data;
};

const emptyArray = function (a: any) {
    return !Array.isArray(a) || get(a, ['length']) === 0;
};

const replacements: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
};

const sanitizeName = function (s: string): string {
    return s.replace(/[&<>'"]/g, function (char: string) {
        return replacements[char];
    });
};

class TestCase {
    configuration: K6jUnitConfiguration;
    className: string;
    failMessage: string;
    name = '';
    passed = false;

    constructor(className: string, configuration: K6jUnitConfiguration, name = '') {
        this.configuration = configuration;
        this.className = sanitizeName(className);
        this.failMessage = '';

        if (name !== '') {
            this.name = sanitizeName(name);
        }
    }

    fromCheck(check: any) {
        this.name = `Check => ${sanitizeName(get(check, ['name']))}`;
        const passed = get(check, ['passes']);
        const failed = get(check, ['fails']);
        this.passed = this.configuration.testCasePassCondition(passed, failed);

        if (!this.passed) {
            const passPercent = (passed / (passed + failed)) * 100;
            this.failMessage = `Passed: ${passed} Failed: ${failed} (${passPercent.toFixed(2)}%)`;
        }
    }

    toXml(tab: number) {
        return this.passed
            ? `${ident(tab)}<testcase name="${this.name}" classname="${this.className}" />`
            : `${ident(tab)}<testcase name="${this.name}" classname="${this.className}" >\n` +
                  `${ident(tab + 1)}<failure message="${this.failMessage}">${this.failMessage}</failure>\n` +
                  `${ident(tab)}</testcase>`;
    }
}

class TestSuite {
    name = '';
    failures = 0;
    configuration: K6jUnitConfiguration;
    id = '';
    cases: any;
    constructor(id: string, name: string, configuration: K6jUnitConfiguration) {
        this.id = id;
        this.name = sanitizeName(name);
        this.cases = [];
        this.failures = 0;
        this.configuration = configuration;
    }

    parseChecks(checks: any) {
        if (emptyArray(checks)) {
            return;
        }

        for (let index = 0; index < checks.length; ++index) {
            const check = checks[index];
            const c = new TestCase(this.name, this.configuration);
            c.fromCheck(check);
            this.cases.push(c);

            if (!c.passed) {
                this.failures++;
            }
        }
    }

    toXml(tab: number): string {
        const casesXml = [];
        for (let index = 0; index < this.cases.length; ++index) {
            const c = this.cases[index];
            casesXml.push(c.toXml(tab + 1));
        }
        return (
            `${ident(tab)}<testsuite id="${this.id}" name="${this.name}" tests="${this.cases.length}" failures="${
                this.failures
            }">\n` +
            casesXml.join('\n') +
            `\n${ident(tab)}</testsuite>`
        );
    }
}

class Report {
    nextSuiteId: number;
    configuration: K6jUnitConfiguration;
    suites: any;

    constructor(data: any, cfg: K6jUnitConfiguration) {
        this.nextSuiteId = 0;
        this.suites = [];
        this.configuration = cfg;

        if (data == null) {
            return;
        }

        const rootGroup = get(data, ['root_group']);

        this.addSuite(rootGroup, rootTestSuiteName);
        const groups = get(rootGroup, ['groups']);

        if (!emptyArray(groups)) {
            for (let index = 0; index < groups.length; ++index) {
                const group = groups[index];
                this.addSuite(group, `Test suite ${this.nextSuiteId + 1}`);
            }
        }

        if (cfg.includeThresholds) {
            this.parseMetrics(data);
        }
    }

    parseMetrics(data: any) {
        const metrics = get(data, ['metrics']);
        const thresholdCases = [];
        let failures = 0;
        for (const metricName in metrics) {
            if (!Object.prototype.hasOwnProperty.call(metrics, metricName)) {
                continue;
            }

            const metric = metrics[metricName];
            const thresholds = get(metric, ['thresholds']);
            if (!thresholds) {
                continue;
            }

            for (const thresholdName in thresholds) {
                if (!Object.prototype.hasOwnProperty.call(thresholds, thresholdName)) {
                    continue;
                }

                const isOk = get(thresholds[thresholdName], ['ok']);
                const tc = new TestCase(
                    thresholdTestSuiteName,
                    this.configuration,
                    `Threshold => ${metricName}: ${thresholdName}`
                );

                tc.passed = isOk;
                thresholdCases.push(tc);

                if (!isOk) {
                    tc.failMessage = thresholdFailureMessage;
                    failures++;
                }
            }
        }

        if (!emptyArray(thresholdCases)) {
            const metricTestSuite = new TestSuite(
                this.nextSuiteId.toString(),
                thresholdTestSuiteName,
                this.configuration
            );
            metricTestSuite.cases = thresholdCases;
            metricTestSuite.failures = failures;
            this.nextSuiteId++;

            this.suites.push(metricTestSuite);
        }
    }

    addSuite(group: any, defaultName: string) {
        const checks = get(group, ['checks']);
        const name = get(group, ['name']) || defaultName;

        if (emptyArray(checks)) {
            return;
        }

        const suite = new TestSuite(this.nextSuiteId.toString(), name, this.configuration);
        suite.parseChecks(checks);

        this.suites.push(suite);
        this.nextSuiteId++;
    }

    toXml(): string {
        const tab = 1;
        const suitesXml = [];
        let failures = 0;
        let testsCount = 0;
        for (let index = 0; index < this.suites.length; ++index) {
            const suite = this.suites[index];
            suitesXml.push(suite.toXml(tab));
            failures += suite.failures;
            testsCount += suite.cases.length;
        }
        return (
            '<?xml version="1.0"?>\n' +
            `<testsuites tests="${testsCount}" failures="${failures}">\n` +
            suitesXml.join('\n') +
            '\n</testsuites>'
        );
    }
}

export function jUnit(data: any, cfg?: K6jUnitConfiguration): any {
    console.log(`raw k6 data: ${JSON.stringify(data)}`);

    const configuration =
        cfg == null
            ? defaultConfiguration
            : {
                  includeThresholds:
                      cfg.includeThresholds == null ? defaultConfiguration.includeThresholds : cfg.includeThresholds,
                  testCasePassCondition:
                      cfg.testCasePassCondition == null
                          ? defaultConfiguration.testCasePassCondition
                          : cfg.testCasePassCondition
              };

    return new Report(data, configuration).toXml();
}
