import React, { Component } from 'react'
import MetaCoinContract from '../build/contracts/MetaCoin.json'
import getWeb3 from './utils/getWeb3'
import Logo from './img/logo5.png'
import LeftImage from './img/left.jpg'
import RightImage from './img/right.jpg'
import swal from 'sweetalert'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/style.css'
import './font-awesome/css/fontawesome.css'
import './css/bootstrap.min.css'


class App extends Component {
  constructor(props) {
    super(props)
    this.sendCoinFunction = this.sendCoinFunction.bind(this);
    this.showBalanceFunction = this.showBalanceFunction.bind(this);
    this.state = {
      outputValue: 0,
      web3: null,
      didSend: false
    }
  }

  componentWillMount() {

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {

    const contract = require('truffle-contract')
    const metaCoin = contract(MetaCoinContract)
    metaCoin.setProvider(this.state.web3.currentProvider)
    var metaCoinInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      metaCoin.deployed().then((instance) => {
        metaCoinInstance = instance
        this.setState(prevState => ({
          ...prevState,
          accounts,
          metaCoinInstance
        }));
        return metaCoinInstance.getBalance.call(accounts[0])
           }).then((result) => {
              return this.setState({ outputValue: result.c[0]})
      })
    })
      
      this.state.web3.eth.getAccounts((error, accs) => {
         if (error != null) {
          alert('There was an error fetching your accounts.')
          return
         }
                           
         if (accs.length === 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
            return
        }
           this.setState({ accounts:  accs})
           this.state.account = this.state.accounts[0]
    })
  }
    
   showBalanceFunction(){
        var accountAddress = prompt("Please Enter Your Account Address")
        var isAccount = false
        var accountIndex = 0
       
        this.instantiateContract()
        for(var i = 0; i < this.state.accounts.length; i++){
            if (accountAddress == this.state.accounts[i]){
                isAccount = true
                accountIndex = i
            }
        }
        this.state.metaCoinInstance.getBalance.call(this.state.accounts[accountIndex], {from: this.state.accounts[accountIndex]}).then((result) =>
              this.setState({ outputValue: result})
        )

       if(isAccount){
            swal("Your Ether Balance is " + this.state.outputValue)
        }
        else{
            swal("Invalid Address! Please Double Check Your Address.")
        }
    }
    
    sendCoinFunction(){
        var fromAddress = prompt("Please Enter Sending Address")
        var toAddress = prompt("Please Enter Receiving Address")
        var sendingAmount = prompt("Please Enter the Amount of Ethers You are Sending")
        var validFromAddress = false
        var validToAddress = false
        var fromIndex = 0
        var toIndex = 0
        
        for(var i = 0; i < this.state.accounts.length; i++){
            if (fromAddress == this.state.accounts[i]){
                validFromAddress = true
                fromIndex = i
            }
        }
        for(var i = 0; i < this.state.accounts.length; i++){
            if (toAddress == this.state.accounts[i]){
                validToAddress = true
                toIndex = i
            }
        }
        
        if(validFromAddress && validToAddress){
            this.instantiateContract()
            this.state.metaCoinInstance.sendCoin.call(this.state.accounts[toIndex], sendingAmount, {from: this.state.accounts[fromIndex]}).then((result) =>
                   this.setState({ didSend: result})
            )
        }
        else{
            swal("Invalid Address! Please Double Check Your Sending or Receiving Address.")
        }
        
        if(this.state.didSend){
            swal("Successfully Sent!")
        }
        else{
            swal("Please Check that You Have Enough Balance!")
        }
        
        
    }
    

  render() {
    return (
      <div className="App">
       <section id="top-half">
            
        <section id="intro-title">
            <div className="container">
            <div className="row mh2">
            <div className="col-12 text-center">
                <p>Stablecoin Wallet</p>
            </div>
            </div>
            </div>
        </section>
            
        <section id="intro">
            <div className="container">
            <div className="row mh3">
            <div className="col-12">
                <p>Fast, Easy, and Safe Way to Check and Send Your Ether</p>
            </div>
            </div>
            </div>
        </section>
        </section>
            
        <section id="bottom-half">
        <section id="main">
 
        <section id="forImages">
            <div className="container">
            <div className="row">
            <div className="col">
            <img src= {LeftImage} className="img-fluid" height={500} width={300} id="leftimage"/>
            </div>
            <div className="col">
            <img src= {RightImage} className="img-fluid" height={600} width={300}/>
            </div>
            </div>
            </div>
        </section>
            
            
            <div className="container">
            <div className="row">
            <div className="col">
            <div className="balance-title">
            <section id="balance-input">
            <button type="submit" className="pure-button" bsSize="large" name="submit" value="send" onClick={this.showBalanceFunction}>Check your Balance</button>
            </section>
            </div>
        </div>
            
        <div className="col">
        <div className="send-title">
        <section id="send-input">
            <button type="submit" className="pure-button"  bsSize="large" name="submit" value="send" onClick={this.sendCoinFunction}>Send your Ether</button>
            <section id="send-result">
            <p />
        </section>
        </section>
        </div>
        </div>
        </div>
        </div>
        </section>
        <section id="bottom">
        <div style={{clear: 'both'}} />
        <p id="footer">Created by : Tae Hyun(Mark) Kim</p>
        <p id="footer">Start Running Tests With <a href="https://truffleframework.com/ganache">Ganache</a>.</p>
            <p></p>
        </section>
        </section>
        </div>
    );
  }
}

export default App
