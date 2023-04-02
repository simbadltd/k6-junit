const jUnit = require("../index").jUnit;

const demoPayload = {
    "root_group": {
        "checks": [],
        "name": "",
        "path": "",
        "id": "d41d8cd98f00b204e9800998ecf8427e",
        "groups": [
            {
                "id": "7b353b29c77786d1524d3589fe6bb709",
                "groups": [],
                "checks": [
                    {
                        "fails": 0,
                        "name": "#1: @#$",
                        "path": "::Test-Case Demo::#1: @#$",
                        "id": "df12b4491b5ca43bff623588b147f78a",
                        "passes": 1
                    },
                    {
                        "fails": 0,
                        "name": "#2: ><,'",
                        "path": "::Test-Case Demo::#2: ><,'",
                        "id": "7c14f3411dc09ddba0f63c332da85efc",
                        "passes": 1
                    },
                    {
                        "id": "399dd2ed91c3c4cd39506cfd8733ed25",
                        "passes": 1,
                        "fails": 0,
                        "name": "subscriptionId: 9cb94c24-7dc0-4b00-9874-16d45a12d0ea",
                        "path": "::Test-Case Demo::subscriptionId: 9cb94c24-7dc0-4b00-9874-16d45a12d0ea"
                    },
                    {
                        "name": "#3: &\"",
                        "path": "::Test-Case Demo::#3: &\"",
                        "id": "5886f850f72705e849a5dc0fdc98f852",
                        "passes": 1,
                        "fails": 0
                    },
                    {
                        "name": "https://google.com is 200",
                        "path": "::Test-Case Demo::https://google.com is 200",
                        "id": "c67e999b968d74e29e8f38c4d16415e9",
                        "passes": 1,
                        "fails": 0
                    }
                ],
                "name": "Test-Case Demo",
                "path": "::Test-Case Demo"
            }
        ]
    },
    "options": {
        "summaryTrendStats": [
            "avg",
            "min",
            "med",
            "max",
            "p(90)",
            "p(95)"
        ],
        "summaryTimeUnit": "",
        "noColor": false
    },
    "state": {
        "isStdOutTTY": true,
        "isStdErrTTY": true,
        "testRunDurationMs": 581.636
    },
    "metrics": {
        "http_req_sending": {
            "type": "trend",
            "contains": "time",
            "values": {
                "p(95)": 0.535215,
                "avg": 0.37875,
                "min": 0.2049,
                "med": 0.37875,
                "max": 0.5526,
                "p(90)": 0.51783
            }
        },
        "data_sent": {
            "type": "counter",
            "contains": "data",
            "values": {
                "rate": 2102.689654698127,
                "count": 1223
            }
        },
        "http_req_blocked": {
            "contains": "time",
            "values": {
                "avg": 146.8498,
                "min": 122.312,
                "med": 146.8498,
                "max": 171.3876,
                "p(90)": 166.48004,
                "p(95)": 168.93382
            },
            "type": "trend"
        },
        "data_received": {
            "values": {
                "count": 29543,
                "rate": 50792.93578801862
            },
            "type": "counter",
            "contains": "data"
        },
        "http_req_duration": {
            "type": "trend",
            "contains": "time",
            "values": {
                "p(95)": 198.15316,
                "avg": 138.2875,
                "min": 71.7701,
                "med": 138.2875,
                "max": 204.8049,
                "p(90)": 191.50142000000002
            }
        },
        "http_req_waiting": {
            "type": "trend",
            "contains": "time",
            "values": {
                "min": 59.0807,
                "med": 123.23855,
                "max": 187.3964,
                "p(90)": 174.56483,
                "p(95)": 180.980615,
                "avg": 123.23855
            }
        },
        "http_req_tls_handshaking": {
            "type": "trend",
            "contains": "time",
            "values": {
                "max": 113.9825,
                "p(90)": 109.69454999999999,
                "p(95)": 111.838525,
                "avg": 92.54275,
                "min": 71.103,
                "med": 92.54275
            }
        },
        "group_duration": {
            "type": "trend",
            "contains": "time",
            "values": {
                "avg": 579.8947,
                "min": 579.8947,
                "med": 579.8947,
                "max": 579.8947,
                "p(90)": 579.8947,
                "p(95)": 579.8947
            }
        },
        "checks": {
            "type": "rate",
            "contains": "default",
            "values": {
                "rate": 1,
                "passes": 5,
                "fails": 0
            }
        },
        "http_req_failed": {
            "type": "rate",
            "contains": "default",
            "values": {
                "rate": 0,
                "passes": 0,
                "fails": 2
            }
        },
        "http_reqs": {
            "contains": "default",
            "values": {
                "count": 2,
                "rate": 3.438576704330543
            },
            "type": "counter"
        },
        "http_req_duration{expected_response:true}": {
            "type": "trend",
            "contains": "time",
            "values": {
                "min": 71.7701,
                "med": 138.2875,
                "max": 204.8049,
                "p(90)": 191.50142000000002,
                "p(95)": 198.15316,
                "avg": 138.2875
            }
        },
        "http_req_connecting": {
            "type": "trend",
            "contains": "time",
            "values": {
                "avg": 53.9799,
                "min": 50.6564,
                "med": 53.9799,
                "max": 57.3034,
                "p(90)": 56.6387,
                "p(95)": 56.971050000000005
            }
        },
        "iterations": {
            "type": "counter",
            "contains": "default",
            "values": {
                "count": 1,
                "rate": 1.7192883521652715
            }
        },
        "http_req_receiving": {
            "values": {
                "p(95)": 16.63733,
                "avg": 14.6702,
                "min": 12.4845,
                "med": 14.6702,
                "max": 16.8559,
                "p(90)": 16.41876
            },
            "type": "trend",
            "contains": "time"
        },
        "iteration_duration": {
            "type": "trend",
            "contains": "time",
            "values": {
                "p(90)": 579.8947,
                "p(95)": 579.8947,
                "avg": 579.8947,
                "min": 579.8947,
                "med": 579.8947,
                "max": 579.8947
            }
        }
    }
};

test("Empty payload", () => {
    const expected = `<?xml version="1.0"?>
<testsuites tests="0" failures="0">

</testsuites>`;

    const result = jUnit({});
    expect(result).toEqual(expected);
});

test("Null payload", () => {
    const expected = `<?xml version="1.0"?>
<testsuites tests="0" failures="0">

</testsuites>`;

    const result = jUnit(null);
    expect(result).toEqual(expected);
});

test("Demo payload", () => {
    const expected = `<?xml version="1.0"?>
<testsuites tests="5" failures="0">
  <testsuite id="0" name="Test-Case Demo" tests="5" failures="0">
    <testcase name="#1: @#$" classname="Test-Case Demo" />
    <testcase name="#2: &gt;&lt;,&#39;" classname="Test-Case Demo" />
    <testcase name="subscriptionId: 9cb94c24-7dc0-4b00-9874-16d45a12d0ea" classname="Test-Case Demo" />
    <testcase name="#3: &amp;&quot;" classname="Test-Case Demo" />
    <testcase name="https://google.com is 200" classname="Test-Case Demo" />
  </testsuite>
</testsuites>`;

    const result = jUnit(demoPayload);
    expect(result).toEqual(expected);
});

test("Failure message check", () => {
    const expected = `<?xml version="1.0"?>
<testsuites tests="5" failures="5">
  <testsuite id="0" name="Test-Case Demo" tests="5" failures="5">
    <testcase name="#1: @#$" classname="Test-Case Demo" >
      <failure message="1 / 0 (100.00%) checks passed">1 / 0 (100.00%) checks passed</failure>
    </testcase>
    <testcase name="#2: &gt;&lt;,&#39;" classname="Test-Case Demo" >
      <failure message="1 / 0 (100.00%) checks passed">1 / 0 (100.00%) checks passed</failure>
    </testcase>
    <testcase name="subscriptionId: 9cb94c24-7dc0-4b00-9874-16d45a12d0ea" classname="Test-Case Demo" >
      <failure message="1 / 0 (100.00%) checks passed">1 / 0 (100.00%) checks passed</failure>
    </testcase>
    <testcase name="#3: &amp;&quot;" classname="Test-Case Demo" >
      <failure message="1 / 0 (100.00%) checks passed">1 / 0 (100.00%) checks passed</failure>
    </testcase>
    <testcase name="https://google.com is 200" classname="Test-Case Demo" >
      <failure message="1 / 0 (100.00%) checks passed">1 / 0 (100.00%) checks passed</failure>
    </testcase>
  </testsuite>
</testsuites>`;

    const result = jUnit(demoPayload, {testCasePassCondition: () => false});
    expect(result).toEqual(expected);
});