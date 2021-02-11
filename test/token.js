const Token = artifacts.require("Token");
const truffleAssert = require("truffle-assertions");

contract("Token", accounts => {
  let token;

  before(async () => {
    token = await Token.deployed();
  });

  it("todo", async () => {
  });
});

