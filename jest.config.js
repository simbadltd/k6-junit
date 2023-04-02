module.exports = {
    coverageThreshold: {
        global: {
            lines: 95
        },
    },
    coverageReporters: ["json-summary"],
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    }
};
