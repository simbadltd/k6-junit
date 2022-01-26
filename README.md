# k6-junit
[![NPM](https://img.shields.io/npm/v/k6-junit.svg)](https://www.npmjs.org/package/k6-junit)

k6 JUnit summary exporter libray.


## Example
``` javascript
export function handleSummary(data) {
    console.log('Preparing the end-of-test summary...');
    return {
        "./test-results.xml": jUnit(data)
    }
}
```


## LICENSE [MIT](LICENSE)
