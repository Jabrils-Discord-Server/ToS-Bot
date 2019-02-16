require("node-wrap")("./bot.js", {
    restartOnCrash: true,
    crashTimeout: 1000,
    restartTimeout: 0,
    console: true,
    logFile: "./wrapper.log",
    logConsoleOutput: null,
    logTimestamp: true,
    bootLoopDetection: 3000
});