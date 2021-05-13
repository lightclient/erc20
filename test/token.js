const Token = artifacts.require("Token");
const truffleAssert = require("truffle-assertions");

contract("Token", accounts => {
  let token;

  before(async () => {
    token = await Token.deployed();
  });

  it("balance_of", async () => {
    balance = await token.balanceOf.call(accounts[0])
    assert.strictEqual(balance.toNumber(), 10000)
  });

  it("transfer", async () => {
    await token.transfer(accounts[1], 10, { from: accounts[0] })
    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 10)
  });

  it("approve", async () => {
    await token.approve(accounts[1], 10, { from: accounts[0] })
    allowance = await token.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance.toNumber(), 10)
  });

  it("transfer_from", async () => {
    await token.approve(accounts[1], 10, { from: accounts[0] })
    await token.transferFrom(accounts[0], accounts[1], 10, { from: accounts[1] })

    allowance = await token.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance.toNumber(), 10)

    balance = await token.balanceOf.call(accounts[0])
    assert.strictEqual(allowance.toNumber(), 10)
  });
});

