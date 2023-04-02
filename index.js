const ROOT_TEST_SUITE_NAME = "Root";
const THRESHOLDS_TEST_SUITE_NAME = "Thresholds";
const THRESHOLD_FAILURE_MESSAGE = "threshold exceeded";

const defaultConfiguration = {
    includeThresholds: true,
    maxGroupNestingLevel: 1,
    testCasePassCondition: (passed, failed) => passed > 0 && failed === 0
};

const ident = function (x) {
    return "  ".repeat(x);
};

const get = function (data, path) {
    let i, len = path.length;
    for (i = 0; typeof data === "object" && i < len; ++i) {
        data = data[path[i]];
    }
    return data;
};

const emptyArray = function (a) {
    return !Array.isArray(a) || get(a, ["length"]) === 0;
};

const replacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
};

const sanitizeName = function (s) {
    return s.replace(/[&<>'"]/g, function (char) {
        return replacements[char];
    });
};

class TestCase {
    constructor(className, configuration, name = null) {
        this.configuration = configuration;
        this.className = sanitizeName(className);
        this.failMessage = "";

        if (name) {
            this.name = sanitizeName(name);
        }
    }

    fromCheck(check) {
        if (check.className) {
            this.className = check.className;
        }

        this.name = sanitizeName(get(check, ["name"]));
        const passed = get(check, ["passes"]);
        const failed = get(check, ["fails"]);
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
    constructor(id, name, configuration) {
        this.id = id;
        this.name = sanitizeName(name);
        this.cases = [];
        this.failures = 0;
        this.configuration = configuration;
    }

    parseChecks(checks) {
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
        const groups = this.getGroupsRecursively(rootGroup);
        if (!emptyArray(groups)) {
            groups.forEach(group => {
                const isRootGroup = rootGroup === group;
                const defaultName = isRootGroup ? ROOT_TEST_SUITE_NAME : `Test Suite ${this.nextSuiteId}`;
                this.addSuite(group, defaultName);
            });
        }

        if (cfg.includeThresholds) {
            this.parseMetrics(data);
        }
    }

    getGroupsRecursively(group, nestingLevel = 0) {
        if (!group) {
            return [];
        }

        let result = [group];

        if (nestingLevel === this.configuration.maxGroupNestingLevel) {
            // [kk]: #10 mark those groups which have greater nesting level than required
            group.shouldFlatten = true;
        } else {
            const nestedGroups = this.getNestedGroups(group);
            if (!emptyArray(nestedGroups)) {
                for (let index = 0; index < nestedGroups.length; ++index) {
                    const nestedGroup = nestedGroups[index];
                    const localResult = this.getGroupsRecursively(nestedGroup, nestingLevel + 1);
                    if (!emptyArray(localResult)) {
                        result.push(...localResult);
                    }
                }
            }
        }
        return result;
    }

    parseMetrics(data) {
        const metrics = get(data, ["metrics"]);
        const thresholdCases = [];
        let failures = 0;
        for (let metricName in metrics) {
            if (!Object.prototype.hasOwnProperty.call(metrics, metricName)) {
                continue;
            }

            const metric = metrics[metricName];
            const thresholds = get(metric, ["thresholds"]);
            if (!thresholds) {
                continue;
            }

            for (let thresholdName in thresholds) {
                if (!Object.prototype.hasOwnProperty.call(thresholds, thresholdName)) {
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
        const name = this.getGroupName(group, defaultName);
        const suite = new TestSuite(this.nextSuiteId, name, this.configuration);

        // [kk]: #10 flatten those groups which have greater nesting level than required
        const checks = group.shouldFlatten ? this.getChecksRecursively(group, suite.name) : this.getChecks(group);
        if (!emptyArray(checks)) {
            suite.parseChecks(checks);
            this.suites.push(suite);
            this.nextSuiteId++;
        }

        return suite;
    }

    getChecksRecursively(group, className, nestingLevel = 0) {
        let checks = this.getChecks(group);
        if (nestingLevel > 0) {
            // [kk]: #10 for those checks which were flattened use their's group name as a class name
            checks.forEach(check => {
                check.className = className;
            });
        }

        const groups = this.getNestedGroups(group);
        if (!emptyArray(groups)) {
            for (let index = 0; index < groups.length; ++index) {
                const nestedGroup = groups[index];
                const nestedGroupName = sanitizeName(this.getGroupName(nestedGroup));
                const nestedChecks = this.getChecksRecursively(
                    nestedGroup,
                    nestedGroupName ? `${className}: ${nestedGroupName}` : className,
                    nestingLevel + 1);
                if (!emptyArray(nestedChecks)) {
                    checks.push(...nestedChecks);
                }
            }
        }

        return checks;
    }

    getChecks(group) {
        return get(group, ["checks"]);
    }

    getNestedGroups(group) {
        return get(group, ["groups"]);
    }

    getGroupName(group, defaultName = null) {
        const result = get(group, ["name"]);
        return result ? result : defaultName;
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
        maxGroupNestingLevel:
            cfg.maxGroupNestingLevel == null ? defaultConfiguration.maxGroupNestingLevel : cfg.maxGroupNestingLevel
    };

    return new Report(JSON.parse(JSON.stringify(data)), configuration).toXml();
}

exports.jUnit = jUnit;
