# k6-junit
[![NPM](https://img.shields.io/npm/v/is-sorted.svg)](https://www.npmjs.org/package/is-sorted)

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
