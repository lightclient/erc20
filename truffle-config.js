module.exports = {
  contracts_build_directory: "./build",
  compilers: {
    external: {
      command: "npm run compile",
      targets: [{
        path: "./build/*.json"
      }]
    }
  }
};
