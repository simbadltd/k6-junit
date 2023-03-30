import {jUnit} from "../index";

const testPayload = {
    "root_group": {
        "name": "",
        "path": "",
        "id": "d41d8cd98f00b204e9800998ecf8427e",
        "groups": [
          {
            "groups": [
              {
                "name": "Nested check",
                "path": "::Check::Nested check",
                "id": "51ca34dab6261b892e77d3a7376bc1e2",
                "groups": [
                  {
                    "name": "SubNested check",
                    "path": "::Check::Nested check::SubNested check",
                    "id": "632d479e503541294775cefab25f6803",
                    "groups": [],
                    "checks": [
                      {
                        "fails": 1,
                        "name": "https://www.google.com/search?q=k6+nested+groups is 200",
                        "path": "::Check::Nested check::SubNested check::https://www.google.com/search?q=k6+nested+groups is 200",
                        "id": "7876841aec3b9a5bf3fe212ac2c6427d",
                        "passes": 0
                      }
                    ]
                  }
                ],
                "checks": [
                  {
                    "id": "c845da98cb3f1dc81178b6f0a8cbb88c",
                    "passes": 0,
                    "fails": 1,
                    "name": "https://www.google.com/search?q=k6 is 200",
                    "path": "::Check::Nested check::https://www.google.com/search?q=k6 is 200"
                  }
                ]
              }
            ],
            "checks": [
              {
                "path": "::Check::Number: 000000000",
                "id": "22b81b82706371fb8a5e39c384314555",
                "passes": 1,
                "fails": 0,
                "name": "Number: 000000000"
              }
            ],
            "name": "Check",
            "path": "::Check",
            "id": "ce924dcae74f377896f6db7b41607211"
          }
        ],
        "checks": []
      },
      "options": {
        "summaryTimeUnit": "",
        "noColor": false,
        "summaryTrendStats": [
          "avg",
          "min",
          "med",
          "max",
          "p(90)",
          "p(95)"
        ]
      },
      "state": {
        "testRunDurationMs": 3366.1379,
        "isStdOutTTY": true,
        "isStdErrTTY": true
      },
      "metrics": {
        "http_req_receiving": {
          "type": "trend",
          "contains": "time",
          "values": {
            "min": 0.3625,
            "med": 174.40425000000002,
            "max": 409.9591,
            "p(90)": 391.29892,
            "p(95)": 400.62901,
            "avg": 189.78252500000002
          }
        },
        "iteration_duration": {
          "type": "trend",
          "contains": "time",
          "values": {
            "p(95)": 3363.5967,
            "avg": 3363.5967,
            "min": 3363.5967,
            "med": 3363.5967,
            "max": 3363.5967,
            "p(90)": 3363.5967
          }
        },
        "iterations": {
          "type": "counter",
          "contains": "default",
          "values": {
            "rate": 0.29707636160717005,
            "count": 1
          }
        },
        "http_req_failed": {
          "type": "rate",
          "contains": "default",
          "values": {
            "rate": 0,
            "passes": 0,
            "fails": 4
          }
        },
        "http_req_duration{expected_response:true}": {
          "type": "trend",
          "contains": "time",
          "values": {
            "p(95)": 756.0457749999999,
            "avg": 532.1963000000001,
            "min": 295.6045,
            "med": 527.2977000000001,
            "max": 778.5853,
            "p(90)": 733.50625
          }
        },
        "http_req_connecting": {
          "type": "trend",
          "contains": "time",
          "values": {
            "avg": 6.1373750000000005,
            "min": 0,
            "med": 6.026,
            "max": 12.4975,
            "p(90)": 12.363850000000001,
            "p(95)": 12.430675
          }
        },
        "http_req_tls_handshaking": {
          "type": "trend",
          "contains": "time",
          "values": {
            "p(90)": 82.31379000000001,
            "p(95)": 85.051395,
            "avg": 39.331825,
            "min": 0,
            "med": 34.76915,
            "max": 87.789
          }
        },
        "http_reqs": {
          "type": "counter",
          "contains": "default",
          "values": {
            "count": 4,
            "rate": 1.1883054464286802
          }
        },
        "http_req_blocked": {
          "contains": "time",
          "values": {
            "avg": 53.2577,
            "min": 0,
            "med": 47.12875,
            "max": 118.7733,
            "p(90)": 111.41856000000001,
            "p(95)": 115.09593
          },
          "type": "trend"
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
        "data_sent": {
          "contains": "data",
          "values": {
            "count": 2217,
            "rate": 658.618293683096
          },
          "type": "counter"
        },
        "data_received": {
          "type": "counter",
          "contains": "data",
          "values": {
            "count": 225472,
            "rate": 66982.40140429184
          }
        },
        "http_req_duration": {
          "type": "trend",
          "contains": "time",
          "values": {
            "min": 295.6045,
            "med": 527.2977000000001,
            "max": 778.5853,
            "p(90)": 733.50625,
            "p(95)": 756.0457749999999,
            "avg": 532.1963000000001
          },
          "thresholds": {
          }
        },
        "vus": {
          "type": "gauge",
          "contains": "default",
          "values": {
            "value": 1,
            "min": 1,
            "max": 1
          }
        },
        "http_req_sending": {
          "type": "trend",
          "contains": "time",
          "values": {
            "p(90)": 0.4249200000000001,
            "p(95)": 0.48395999999999995,
            "avg": 0.209675,
            "min": 0,
            "med": 0.14785,
            "max": 0.543
          }
        },
        "checks": {
          "type": "rate",
          "contains": "default",
          "values": {
            "rate": 1,
            "passes": 7,
            "fails": 0
          }
        },
        "group_duration": {
          "type": "trend",
          "contains": "time",
          "values": {
            "avg": 1516.2669999999998,
            "min": 779.7139,
            "med": 1408.0357,
            "max": 2361.0514,
            "p(90)": 2170.44826,
            "p(95)": 2265.7498299999997
          }
        },
        "http_req_waiting": {
          "type": "trend",
          "contains": "time",
          "values": {
            "p(95)": 417.29641999999996,
            "avg": 342.2041,
            "min": 280.0203,
            "med": 331.4425,
            "max": 425.9111,
            "p(90)": 408.68174
          }
        }
      }
};

test("Should flat nested groups (1-level nesting)", () => {
  const expected = `<?xml version=\"1.0\"?>
<testsuites tests=\"3\" failures=\"2\">
  <testsuite id=\"0\" name=\"Check\" tests=\"3\" failures=\"2\">
    <testcase name=\"Number: 000000000\" classname=\"Check\" />
    <testcase name=\"https://www.google.com/search?q=k6 is 200\" classname=\"Check: Nested check\" >
      <failure message=\"0 / 1 (0.00%) checks passed\">0 / 1 (0.00%) checks passed</failure>
    </testcase>
    <testcase name=\"https://www.google.com/search?q=k6+nested+groups is 200\" classname=\"Check: Nested check: SubNested check\" >
      <failure message=\"0 / 1 (0.00%) checks passed\">0 / 1 (0.00%) checks passed</failure>
    </testcase>
  </testsuite>
</testsuites>`;
  const result = jUnit(testPayload, { maxGroupNestingLevel: 1 });
  expect(result).toEqual(expected);
});

test("Should flat nested groups (2-level nesting)", () => {
  const expected = `<?xml version=\"1.0\"?>
<testsuites tests=\"3\" failures=\"2\">
  <testsuite id=\"0\" name=\"Check\" tests=\"1\" failures=\"0\">
    <testcase name=\"Number: 000000000\" classname=\"Check\" />
  </testsuite>
  <testsuite id=\"1\" name=\"Nested check\" tests=\"2\" failures=\"2\">
    <testcase name=\"https://www.google.com/search?q=k6 is 200\" classname=\"Nested check\" >
      <failure message=\"0 / 1 (0.00%) checks passed\">0 / 1 (0.00%) checks passed</failure>
    </testcase>
    <testcase name=\"https://www.google.com/search?q=k6+nested+groups is 200\" classname=\"Nested check: SubNested check\" >
      <failure message=\"0 / 1 (0.00%) checks passed\">0 / 1 (0.00%) checks passed</failure>
    </testcase>
  </testsuite>
</testsuites>`;
  const result = jUnit(testPayload, { maxGroupNestingLevel: 2 });
  expect(result).toEqual(expected);
});

test("Should flat nested groups (3-level nesting)", () => {
  const expected = `<?xml version=\"1.0\"?>
<testsuites tests=\"3\" failures=\"2\">
  <testsuite id=\"0\" name=\"Check\" tests=\"1\" failures=\"0\">
    <testcase name=\"Number: 000000000\" classname=\"Check\" />
  </testsuite>
  <testsuite id=\"1\" name=\"Nested check\" tests=\"1\" failures=\"1\">
    <testcase name=\"https://www.google.com/search?q=k6 is 200\" classname=\"Nested check\" >
      <failure message=\"0 / 1 (0.00%) checks passed\">0 / 1 (0.00%) checks passed</failure>
    </testcase>
  </testsuite>
  <testsuite id=\"2\" name=\"SubNested check\" tests=\"1\" failures=\"1\">
    <testcase name=\"https://www.google.com/search?q=k6+nested+groups is 200\" classname=\"SubNested check\" >
      <failure message=\"0 / 1 (0.00%) checks passed\">0 / 1 (0.00%) checks passed</failure>
    </testcase>
  </testsuite>
</testsuites>`;
  const result = jUnit(testPayload, { maxGroupNestingLevel: 3 });
  expect(result).toEqual(expected);
});