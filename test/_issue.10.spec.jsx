import {jUnit} from "../index";

const testPayload = {
    "root_group": {
        "name": "",
        "path": "",
        "id": "d41d8cd98f00b204e9800998ecf8427e",
        "groups": [
            {
                "name": "First Test Suite",
                "path": "::First Test Suite",
                "id": "8a623391cdbabe7f1805342f55842ec9",
                "groups": [
                    {
                        "checks": [
                            {
                                "passes": 1,
                                "fails": 0,
                                "name": "expected response status to equal 204",
                                "path": "::First Test Suite::Required fields::expected response status to equal 204",
                                "id": "fe7ddbf0095f68c6145db413bad8f69b"
                            },
                            {
                                "passes": 1,
                                "fails": 0,
                                "name": "expected response to be truthy",
                                "path": "::First Test Suite::Required fields::expected response to be truthy",
                                "id": "72978a256d3e471e9665906fa664a403"
                            }
                        ],
                        "name": "Required fields",
                        "path": "::First Test Suite::Required fields",
                        "id": "b3926becf295d9990206c90f89644c68",
                        "groups": []
                    },
                    {
                        "path": "::First Test Suite::Required and optional fields",
                        "id": "01abf3678da7f9c398b5491c5be28d7e",
                        "groups": [],
                        "checks": [
                            {
                                "passes": 1,
                                "fails": 0,
                                "name": "expected response status to equal 204",
                                "path": "::First Test Suite::Required and optional fields::expected response status to equal 204",
                                "id": "bc9accd325bb5da8d8753d25afb1c304"
                            }
                        ],
                        "name": "Required and optional fields"
                    }
                ],
                "checks": []
            },
            {
                "checks": [],
                "name": "Second Test Suite",
                "path": "::Second Test Suite",
                "id": "ac640c4b7fb61bf83c6a7006302ebb6e",
                "groups": [
                    {
                        "name": "Manage User",
                        "path": "::Second Test Suite::Manage User",
                        "id": "70d15ea3f4e93f66931f7c9be98e6c9a",
                        "groups": [],
                        "checks": [
                            {
                                "name": "expected Create instance response status to equal 201",
                                "path": "::Second Test Suite::Manage User::expected Create instance response status to equal 201",
                                "id": "5640bf3008a30c86787c139b08523b0e",
                                "passes": 0,
                                "fails": 1
                            }
                        ]
                    },
                    {
                        "name": "Manage Group",
                        "path": "::Second Test Suite::Manage Group",
                        "id": "568ee351d28fceacf63d4eeb065db635",
                        "groups": [],
                        "checks": [
                            {
                                "passes": 0,
                                "fails": 1,
                                "name": "expected Create tenant response status to equal 201",
                                "path": "::Second Test Suite::Manage Group::expected Create tenant response status to equal 201",
                                "id": "3632639434c4b8c87af98bf49f966909"
                            }
                        ]
                    }
                ]
            }
        ],
        "checks": []
    },
    "options": {
        "noColor": false,
        "summaryTrendStats": [
            "avg",
            "min",
            "med",
            "max",
            "p(90)",
            "p(95)"
        ],
        "summaryTimeUnit": ""
    },
    "state": {
        "isStdOutTTY": false,
        "isStdErrTTY": false,
        "testRunDurationMs": 2664.079596
    },
    "metrics": {
        "iterations": {
            "type": "counter",
            "contains": "default",
            "values": {
                "count": 1,
                "rate": 0.37536416010297013
            }
        },
        "vus": {
            "type": "gauge",
            "contains": "default",
            "values": {
                "max": 1,
                "value": 1,
                "min": 1
            }
        },
        "data_sent": {
            "type": "counter",
            "contains": "data",
            "values": {
                "rate": 1893.7121877194843,
                "count": 5045
            }
        },
        "group_duration": {
            "type": "trend",
            "contains": "time",
            "values": {
                "avg": 231.58278630434788,
                "min": 0.982903,
                "med": 61.249093,
                "max": 2659.083479,
                "p(90)": 290.044433,
                "p(95)": 1152.8712865999987
            }
        },
        "data_received": {
            "type": "counter",
            "contains": "data",
            "values": {
                "count": 9985,
                "rate": 3748.0111386281565
            }
        },
        "vus_max": {
            "type": "gauge",
            "contains": "default",
            "values": {
                "value": 1,
                "min": 1,
                "max": 1
            }
        },
        "iteration_duration": {
            "type": "trend",
            "contains": "time",
            "values": {
                "min": 2663.764294,
                "med": 2663.764294,
                "max": 2663.764294,
                "p(90)": 2663.764294,
                "p(95)": 2663.764294,
                "avg": 2663.764294
            }
        },
        "checks": {
            "contains": "default",
            "values": {
                "rate": 0.8095238095238095,
                "passes": 17,
                "fails": 4
            },
            "thresholds": {
                "rate == 1.00": {
                    "ok": false
                }
            },
            "type": "rate"
        }
    }
}

test("Issue #10: Should flat nested test suites at 2nd level", () => {
    const expected = `<?xml version="1.0"?>
<testsuites tests="6" failures="3">
  <testsuite id="0" name="First Test Suite" tests="3" failures="0">
    <testcase name="expected response status to equal 204" classname="First Test Suite: Required fields" />
    <testcase name="expected response to be truthy" classname="First Test Suite: Required fields" />
    <testcase name="expected response status to equal 204" classname="First Test Suite: Required and optional fields" />
  </testsuite>
  <testsuite id="1" name="Second Test Suite" tests="2" failures="2">
    <testcase name="expected Create instance response status to equal 201" classname="Second Test Suite: Manage User" >
      <failure message="0 / 1 (0.00%) checks passed">0 / 1 (0.00%) checks passed</failure>
    </testcase>
    <testcase name="expected Create tenant response status to equal 201" classname="Second Test Suite: Manage Group" >
      <failure message="0 / 1 (0.00%) checks passed">0 / 1 (0.00%) checks passed</failure>
    </testcase>
  </testsuite>
  <testsuite id="2" name="Thresholds" tests="1" failures="1">
    <testcase name="checks: rate == 1.00" classname="Thresholds" >
      <failure message="threshold exceeded">threshold exceeded</failure>
    </testcase>
  </testsuite>
</testsuites>`;
    const result = jUnit(testPayload);
    expect(result).toEqual(expected);
});