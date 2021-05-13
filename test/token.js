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
    res = await token.transfer(accounts[1], 10, { from: accounts[0] })
    balance = await token.balanceOf.call(accounts[0])
    assert.strictEqual(balance.toNumber(), 9990)

    balance = await token.balanceOf.call(accounts[1])
    assert.strictEqual(balance.toNumber(), 10)

    log = res.logs.find(
      element => element.event.match('Transfer') &&
        element.address.match(token.address)
    )

    assert.strictEqual(log != null, true)
    assert.strictEqual(log.args.from, accounts[0])
    assert.strictEqual(log.args.to, accounts[1])
    assert.strictEqual(log.args.value.toNumber(), 10)
  });

  it("approve", async () => {
    res = await token.approve(accounts[1], 10, { from: accounts[0] })
    allowance = await token.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance.toNumber(), 10)

    log = res.logs.find(
      element => element.event.match('Approval') &&
        element.address.match(token.address)
    )

    assert.strictEqual(log != null, true)
    assert.strictEqual(log.args.owner, accounts[0])
    assert.strictEqual(log.args.spender, accounts[1])
    assert.strictEqual(log.args.value.toNumber(), 10)
  });

  it("transfer_from", async () => {
    res = await token.transferFrom(accounts[0], accounts[1], 10, { from: accounts[1] })

    allowance = await token.allowance.call(accounts[0], accounts[1])
    assert.strictEqual(allowance.toNumber(), 0)

    balance = await token.balanceOf.call(accounts[0])
    assert.strictEqual(balance.toNumber(), 9980)

    log = res.logs.find(
      element => element.event.match('Transfer') &&
        element.address.match(token.address)
    )

    assert.strictEqual(log != null, true)
    assert.strictEqual(log.args.from, accounts[0])
    assert.strictEqual(log.args.to, accounts[1])
    assert.strictEqual(log.args.value.toNumber(), 10)
  });
});
