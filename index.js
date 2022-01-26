const ROOT_TEST_SUITE_NAME = "Root";
const TEST_CASE_FAILURE_MESSAGE = "failed";

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

const sanitizeName = function (s) {
    return s.replace(/[&<>'"]/g, function (char) {
        return replacements[char]
    })
}

class TestCase {
    constructor(className, check) {
        this.className = sanitizeName(className);
        this.name = sanitizeName(get(check, ["name"]));
        this.passed = get(check, ["passes"]) > 0 && get(check, ["fails"]) === 0;
    }

    toXml(tab) {
        return this.passed ?
            `${ident(tab)}<testcase name="${this.name}" classname="${this.className}" />` :
            `${ident(tab)}<testcase name="${this.name}" classname="${this.className}" >\n` +
            `${ident(tab + 1)}<failure message="${TEST_CASE_FAILURE_MESSAGE}" />\n` +
            `${ident(tab)}</testcase>`;
    }
}

class TestSuite {
    constructor(id, name, checks) {
        this.id = id;
        this.name = sanitizeName(name);
        this.cases = [];
        this.failures = 0;

        this.parseChecks(checks);
    }

    parseChecks(checks) {
        if (emptyArray(checks)) {
            return;
        }

        for (let index = 0; index < checks.length; ++index) {
            const check = checks[index];
            const c = new TestCase(check);
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
            "\n</testsuite>";
    }
}

class Report {
    constructor(data) {
        this.nextSuiteId = 0;
        this.suites = [];

        const rootGroup = get(data, ["root_group"]);

        this.addSuite(rootGroup, ROOT_TEST_SUITE_NAME);
        const groups = get(rootGroup, ["groups"]);

        if (!emptyArray(groups)) {
            for (let index = 0; index < groups.length; ++index) {
                const group = groups[index];
                this.addSuite(group, `Test suite ${this.nextSuiteId + 1}`)
            }
        }
    }

    addSuite(group, defaultName) {
        const checks = get(group, ["checks"]);
        const name = get(group, ["name"]) || defaultName;

        if (emptyArray(checks)) {
            return;
        }

        this.suites.push(new TestSuite(this.nextSuiteId, name, checks))
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
        return "<?xml version=\"1.0\"?>" +
            `<testsuites tests="${testsCount}" failures="${failures}">\n` +
            suitesXml.join("\n") +
            "\n</testsuites>";
    }
}

function jUnit(data) {
    return new Report(data).toXml();
}

exports.jUnit = jUnit;