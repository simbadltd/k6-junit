# k6-junit
[![NPM](https://img.shields.io/npm/v/k6-junit.svg)](https://www.npmjs.org/package/k6-junit)
&nbsp;
[![CI](https://github.com/simbadltd/k6-junit/actions/workflows/default.yml/badge.svg)](https://github.com/simbadltd/k6-junit/actions/workflows/default.yml)
&nbsp;
<img src="./badges/coverage-jest coverage.svg">

k6 JUnit summary exporter library.


## Usage
``` javascript
import {jUnit} from "k6-junit";
// ...
export function handleSummary(data) {
    console.log('Preparing the end-of-test summary...');
    return {
        "./test-results.xml": jUnit(data)
    };
}
```

### Typescript integration
Based on [k6-template-typescript](https://github.com/grafana/k6-template-typescript).

Add dev-dependency to `package.json`:
```json
{
  "devDependencies": {
    "k6-junit": "X.X.X"
  }
}

```

Resolve `k6-junit` package as internal dependecy in `webpack.config.js`:
```javascript
// ...
module.exports = {
  // ...
    externals: [
        function ({context, request}, c) {
            if (request.startsWith('k6') || request.startsWith('https://')) {
                return request === 'k6-junit' ? c() : c(null, 'commonjs ' + request);
            }
            return c();
        },
    ],
  // ...
}
```

### Using without transpiling
In case when it is necessary to avoid transpiling to js and run k6 right on typescript tests, you should modify import statement:
```javascript
import {jUnit} from "./node_modules/k6-junit/index.js";
```

### Configuration
Since your project may have its own features there is a possibility to adjust behaviour 
to your needs. There are several configuration parameters available. Please, see their 
reference below:

| Parameter Name        | Description                                                                                    | Default value              |
|-----------------------|------------------------------------------------------------------------------------------------|----------------------------|
| includeThresholds     | Allows you to control the inclusion of Threshold metrics during the export                     | true                       |
| testCasePassCondition | Allows you to control the logic which decides whether testCase passed or not                   | passed > 0 && failed === 0 |
| maxGroupNestingLevel  | Defines the maximum level of group nesting, more nested groups will be flattened as test-cases | 1                          |

If you need to override default values, please call `jUnit` function with `cfg`
argument defined. So that, your specific configuration will be used by the library.
``` javascript
import {jUnit} from "k6-junit";
// ...
    return {
        "./test-results.xml": jUnit(data, {
           includeThresholds: false,
           testCasePassCondition: (passed, failed) => passed > 0 && failed <= passed,
           maxGroupNestingLevel: 2
        })
    };
// ...
```

## Example k6 JSON Summary
```json
{
  "metrics": {
    "http_req_duration": {
      "avg": 123.456,
      "max": 123.456,
      "med": 123.456,
      "min": 123.456,
      "p(90)": 123.456,
      "p(95)": 123.456,
      "thresholds": {
        "p(90) < 100": false,
        "p(95) < 130": true
      }
    }
  },
  "root_group": {
    "name": "",
    "path": "",
    "id": "d41d8cd98f00b204e9800998ecf8427e",
    "groups": [
      {
        "name": "Register New User",
        "path": "::Register New User",
        "id": "ef69e341fa4ed9426351b0cf6861b7ac",
        "groups": [],
        "checks": [
          {
            "passes": 1,
            "fails": 0,
            "name": "Access token:[empty]",
            "path": "::Register New User::Access token:[empty]",
            "id": "0de369f3d729210fd6916a3a19b78660"
          },
          {
            "path": "::Register New User::Sign-up confirmation is successful",
            "id": "c1575f06e564d14c750ade1e016a4f44",
            "passes": 0,
            "fails": 1,
            "name": "Sign-up confirmation is successful"
          }
        ]
      }
    ],
    "checks": [
      {
        "name": "200 OK",
        "path": "::200 OK",
        "id": "a6e8273230e2df18dd7e2067b12fc13c",
        "passes": 5,
        "fails": 70
      }
    ]
  }
}
```

```xml
<?xml version="1.0"?>
<testsuites tests="5" failures="3">
  <testsuite id="0" name="Root" tests="1" failures="1">
    <testcase name="200 OK" classname="Root" >
      <failure message="5 / 70 (6.67%) checks passed" />
    </testcase>
  </testsuite>
  <testsuite id="1" name="Register New User" tests="2" failures="1">
    <testcase name="Access token:[empty]" classname="Register New User" />
    <testcase name="Sign-up confirmation is successful" classname="Register New User" >
      <failure message="0 / 1 (0.00%) checks passed" />
    </testcase>
  </testsuite>
  <testsuite id="2" name="Thresholds" tests="2" failures="1">
    <testcase name="http_req_duration: p(90) &lt; 100" classname="Thresholds" >
      <failure message="threshold exceeded" />
    </testcase>
    <testcase name="http_req_duration: p(95) &lt; 130" classname="Thresholds" />
  </testsuite>
</testsuites>
```


## LICENSE
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
