const ROOT_TEST_SUITE_NAME = "Root";
const THRESHOLDS_TEST_SUITE_NAME = "Thresholds";
const THRESHOLD_FAILURE_MESSAGE = "threshold exceeded";

const defaultConfiguration = {
    includeThresholds: true,
    testCasePassCondition: (passed, failed) => passed > 0 && failed === 0
}

const ident = function (x) {
    return "  ".repeat(x);
}

const get = function (data, path) {
    let i, len = path.length;
    for (i = 0; typeof data === 'object' && i < len; ++i) {
        data = data[path[i]];
    }
    return data;
};

const emptyArray = function (a) {
    return !Array.isArray(a) || get(a, ["length"]) === 0;
}

const replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
}

const sanitizeName = function (s) {
    return s.replace(/[&<>'"]/g, function (char) {
        return replacements[char]
    })
}

class TestCase {
    constructor(className, configuration, name = null) {
        this.configuration = configuration;
        this.className = sanitizeName(className);
        this.failMessage = "";

        if (!!name) {
            this.name = sanitizeName(name);
        }
    }

    fromCheck(check) {
        this.name = sanitizeName(get(check, ["name"]));
        const passed = get(check, ["passes"]);
        const failed = get(check, ["fails"])
        this.passed = this.configuration.testCasePassCondition(passed, failed);

        if (!this.passed) {
            const passPercent = passed / (passed + failed) * 100;
            this.failMessage = `${passed} / ${failed} (${passPercent.toFixed(2)}%) checks passed`;
        }
    }

    toXml(tab) {
        return this.passed ?
            `${ident(tab)}<testcase name="${this.name}" classname="${this.className}" />` :
            `${ident(tab)}<testcase name="${this.name}" classname="${this.className}" >\n` +
            `${ident(tab + 1)}<failure message="${this.failMessage}">${this.failMessage}</failure>\n` +
            `${ident(tab)}</testcase>`;
    }
}

class TestSuite {
    constructor(id, name, configuration, innerGroups) {
        this.id = id;
        this.name = sanitizeName(name);
        this.cases = [];
        this.failures = 0;
        this.configuration = configuration;
        this.innerGroups = innerGroups;
    }

    parseChecks(checks) {
        if (checks != null){

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

        if (emptyArray(this.innerGroups)) {
            return;
        }

        //parse inner group checks and add to this suite
        for (let index = 0; index < this.innerGroups.length; ++index) {
            const innerGroup = this.innerGroups[index];
            const innerGroupChecks = get(innerGroup, ["checks"]);
            const innerGroupGroups = get(innerGroup, ["groups"]);

            if (!emptyArray(innerGroupChecks) ) {
                let innerSuiteName = sanitizeName(innerGroup.name);
                if(this.name)
                    innerSuiteName = sanitizeName(`${this.name}: ${innerGroup.name}`);
                
                //create sub suite and add its (and its suites') checks and failures, but don't render it
                const innerSuite = new TestSuite(index, innerSuiteName, this.configuration, innerGroupGroups);
                innerSuite.parseChecks(innerGroupChecks)
                this.cases = [...this.cases, ...innerSuite.cases];
                this.failures = innerSuite.failures;
            }
        }
    }

    toXml(tab) {
        let casesXml = [];
        for (let index = 0; index < this.cases.length; ++index) {
            const c = this.cases[index];
            casesXml.push(c.toXml(tab + 1));
        }
        
        return `${ident(tab)}<testsuite id="${this.id}" name="${this.name}" tests="${this.cases.length}" failures="${this.failures}">\n` +
            casesXml.join("\n") +
            `\n${ident(tab)}</testsuite>`;
    }
}

class Report {
    constructor(data, cfg) {
        this.nextSuiteId = 0;
        this.suites = [];
        this.configuration = cfg;

        if (data == null)
            return;

        const rootGroup = get(data, ["root_group"]);

        const rootChecks = get(rootGroup, ["checks"]);
        if(!emptyArray(rootChecks)){                            //only add root test suite if there are no nested ones
            this.addSuite(rootGroup, ROOT_TEST_SUITE_NAME);
        }

        const groups = get(rootGroup, ["groups"]);

        if (!emptyArray(groups)) {
            for (let index = 0; index < groups.length; ++index) {
                const group = groups[index];
                this.addSuite(group, `Test suite ${this.nextSuiteId + 1}`)
            }
        }

        if (cfg.includeThresholds) {
            this.parseMetrics(data);
        }
    }

    parseMetrics(data) {
        const metrics = get(data, ["metrics"]);
        const thresholdCases = [];
        let failures = 0;
        for (let metricName in metrics) {
            if (!metrics.hasOwnProperty(metricName)) {
                continue;
            }

            const metric = metrics[metricName];
            const thresholds = get(metric, ["thresholds"]);
            if (!thresholds) {
                continue;
            }

            for (let thresholdName in thresholds) {
                if (!thresholds.hasOwnProperty(thresholdName)) {
                    continue;
                }

                const isOk = get(thresholds[thresholdName], ["ok"]);
                const tc = new TestCase(
                    THRESHOLDS_TEST_SUITE_NAME,
                    this.configuration,
                    `${metricName}: ${thresholdName}`);

                tc.passed = isOk;
                thresholdCases.push(tc);

                if (!isOk) {
                    tc.failMessage = THRESHOLD_FAILURE_MESSAGE;
                    failures++;
                }
            }
        }

        if (!emptyArray(thresholdCases)) {
            const metricTestSuite = new TestSuite(this.nextSuiteId, THRESHOLDS_TEST_SUITE_NAME);
            metricTestSuite.cases = thresholdCases;
            metricTestSuite.failures = failures;
            this.nextSuiteId++;

            this.suites.push(metricTestSuite);
        }
    }

    addSuite(group, defaultName) {
        const checks = get(group, ["checks"]);
        const innerGroups = get(group, ["groups"]);
        const name = get(group, ["name"]) || defaultName;

        const suite = new TestSuite(this.nextSuiteId, name, this.configuration, innerGroups);
        if (emptyArray(checks) && emptyArray(innerGroups)) {
            return;
        }
        suite.parseChecks(checks);

        this.suites.push(suite)
        this.nextSuiteId++;
    }

    toXml() {
        const tab = 1;
        let suitesXml = [];
        let failures = 0;
        let testsCount = 0;
        for (let index = 0; index < this.suites.length; ++index) {
            const suite = this.suites[index];
            suitesXml.push(suite.toXml(tab));
            failures += suite.failures;
            testsCount += suite.cases.length;
        }
        return "<?xml version=\"1.0\"?>\n" +
            `<testsuites tests="${testsCount}" failures="${failures}">\n` +
            suitesXml.join("\n") +
            "\n</testsuites>";
    }
}

function jUnit(data, cfg = null) {
    const configuration = cfg == null ? defaultConfiguration : {
        includeThresholds:
            cfg.includeThresholds == null ? defaultConfiguration.includeThresholds : cfg.includeThresholds,
        testCasePassCondition:
            cfg.testCasePassCondition == null ? defaultConfiguration.testCasePassCondition : cfg.testCasePassCondition,
    };

    return new Report(data, configuration).toXml();
}

exports.jUnit = jUnit;
