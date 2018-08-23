var Wallet = artifacts.require("./MetaCoin.sol");

contract("MetaCoin", function(address)){
    it("initializes metacoin balance", function(){
       return MetaCoin.deployed().then(function(instance){
           return instance.balances()
          })
       }
    )
}

