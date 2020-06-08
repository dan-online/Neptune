module.exports = function catchExit(cb) {
  process.stdin.resume(); //so the program will not close instantly

  function exitHandler(options, exitCode) {
    if (options.cleanup) return;
    log.info("shutdown...");
    cb(function () {
      process.exit(exitCode);
    });
    return false;
  }

  //do something when app is closing
  process.on("exit", exitHandler.bind(null, { cleanup: true }));

  //catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
};
