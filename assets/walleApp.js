const serverUrl = "https://zblo6osjkuzx.usemoralis.com:2053/server";
const appId = "2mbGQC8tpAP9BknZAlzUwKxJxmLxzREWmpv8iWXN";
const CONTRACT_ADDRESS = "0x13B52B16be647C4713a181aB50dD3F34B4ca7ecD";
const ADMIN = "0xaf9fa351b47ee3ebfb03907c1319e518f617dc4e";

init = async () => {
    await Moralis.start({ serverUrl, appId });

    user = await Moralis.User.current();
    if(!user){
        $('#DashboardBtn').hide();
        $('#stakingBtn').hide();
        $('#burningBtn').hide();
        $('#btn-logOut').hide();
        $('#adminBtn').hide();
        $('#unstakeBtn').hide();
        $('#ApusBtn').hide();
        $('#portalBtn').hide();
        $('#contributeBtn').hide();

        $('#btn-logIn').show();
    }else{
        $('#btn-logIn').hide();

        $('#btn-logOut').show();
        $('#DashboardBtn').show();
        $('#stakingBtn').show();
        $('#burningBtn').show();
        $('#adminBtn').show();
        $('#unstakeBtn').show();
        $('#ApusBtn').show();
        $('#portalBtn').show();
        $('#contributeBtn').show();

        await getAllTx();
        await getERC20Bal();
        //await renderStakedAmount();

      
   

    
     
    }
}
//Authorizations
async function login() {
    let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.authenticate({ signingMessage: "Log in WalleBytes DApp" })
        .then(function (user) {
          alert("logged in user:", user);
          console.log(user.get("ethAddress"));
          location.reload();

        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
  
async function logOut() {
    await Moralis.User.logOut();
    alert("logged out");
    location.reload();

  }

//web3 calls

async function getAllTx(){
    const user = await Moralis.User.current();

    const options = { chain: "matic", address: user.get('ethAddress'), order: "desc"};
    const transactions = await Moralis.Web3API.account.getTransactions(options);
    
    await renderTx(transactions.result);
}

async function getNativeBal() {
    const user = await Moralis.User.current();

    const options = { chain: "matic", address: user.get('ethAddress')};
    const balance = await Moralis.Web3API.account.getNativeBalance(options);

    const tokenValue = Moralis.Units.FromWei(balance.balance);
    const tokenRestrict = tokenValue;
    let containedDecimals = tokenValue.toFixed(2);

   // console.log(containedDecimals);
}

async function getERC20Bal(){
    const user = await Moralis.User.current();

    const options = { chain: 'matic', address: user.get('ethAddress')}
    const balance = await Moralis.Web3API.account.getTokenBalances(options);

    await render20Bal(balance);
    //console.log(balance);
}

async function renderTx(transaction){
    const table = document.getElementById('alltransaction');

    transaction.forEach( async (transactions)  =>{
        let row = table.insertRow();
        let sentTo= row.insertCell(0);
        sentTo.innerHTML = await transactions.to_address;
        let amountSpent= row.insertCell(1); 
        amountSpent.innerHTML = await transactions.value;
        let date = row.insertCell(2);
        date.innerHTML = await transactions.block_timestamp;
    });

}

async function render20Bal(balance){
    const table = document.getElementById('allERC20Bal');

    balance.forEach( async (balances)  =>{
        let row = table.insertRow();
        let tokenName = row.insertCell(0);
        tokenName.innerHTML = await balances.name;
        let tokenBalance= row.insertCell(1); 
        tokenBalance.innerHTML = await balances.symbol;
        let total = row.insertCell(2);
        total.innerHTML = await balances.balance;
        let tokenAddress = row.insertCell(3);
        tokenAddress.innerHTML = await balances.token_address;
    });

}

stakeSeven = async () => {
    const time = 604800; // 7 days
    //const time = 300; // 9 mins testing
    let amount = parseInt(document.getElementById('sevenDay_amount').value);
   
     
     const web3 = await Moralis.enableWeb3();
     const accounts = await Moralis.User.current();
     const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
     
     contract.methods.stake(amount, time).send({from: accounts.get('ethAddress'), value: 0})
     .on("receipt", function(receipt){
         alert(amount + " WALY has been staked for ~7 days");
         console.log(receipt);
         setTimeout(refreshcontract, 3000);
     });
 
 }

 stakeMonth = async () => {
    const time = 2592000; // 30 days
    let amount = parseInt(document.getElementById('thirtyDay_amount').value);
   
     
     const web3 = await Moralis.enableWeb3();
     const accounts = await Moralis.User.current();
     const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
     
     contract.methods.stake(amount, time).send({from: accounts.get('ethAddress'), value: 0})
     .on("receipt", function(receipt){
         alert(amount + " WALY has been staked for ~1 Month");
         console.log(receipt);
         setTimeout(refreshcontract, 3000);
     });
 
 }

 stakeNinety = async () => {
    const time = 7776000; // 90 days
    let amount = parseInt(document.getElementById('ninetyDay_amount').value);
   
     
     const web3 = await Moralis.enableWeb3();
     const accounts = await Moralis.User.current();
     const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
     
     contract.methods.stake(amount, time).send({from: accounts.get('ethAddress'), value: 0})
     .on("receipt", function(receipt){
         alert(amount + " WALY has been staked for ~3 Months");
         console.log(receipt);
         setTimeout(refreshcontract, 3000);
     });
 
 }

 stake180 = async () => {
    const time = 15552000; // 180 days
    let amount = parseInt(document.getElementById('180Day_amount').value);
   
     
     const web3 = await Moralis.enableWeb3();
     const accounts = await Moralis.User.current();
     const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
     
     contract.methods.stake(amount, time).send({from: accounts.get('ethAddress'), value: 0})
     .on("receipt", function(receipt){
         alert(amount + " WALY has been staked for ~6 Months");
         console.log(receipt);
         setTimeout(refreshcontract, 3000);
     });
 
 }

 stake365 = async () => {
    const time = 31104000; // 365 days
    let amount = parseInt(document.getElementById('365Day_amount').value);
   
     
     const web3 = await Moralis.enableWeb3();
     const accounts = await Moralis.User.current();
     const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
     
     contract.methods.stake(amount, time).send({from: accounts.get('ethAddress'), value: 0})
     .on("receipt", function(receipt){
         alert(amount + " WALY has been staked for ~1 Year");
         console.log(receipt);
         setTimeout(refreshcontract, 3000);
     });
 
 }

 stake5yrs = async () => {
    const time = 155520000; // 1800 days
    let amount = parseInt(document.getElementById('1800Day_amount').value);
   
     
     const web3 = await Moralis.enableWeb3();
     const accounts = await Moralis.User.current();
     const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
     
     contract.methods.stake(amount, time).send({from: accounts.get('ethAddress'), value: 0})
     .on("receipt", function(receipt){
         alert(amount + " WALY has been staked for ~5 Year");
         console.log(receipt);
         setTimeout(refreshcontract, 3000);
     });
 
 }

 stakedBalance = async () => {
     const web3 = await Moralis.enableWeb3();
     const accounts = await Moralis.User.current();
     const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

     contract.methods.lockedBalance(accounts.get('ethAddress').send({from: accounts.get('ethAddress'), value: 0}))
     .on("receipt", function(receipt){
         alert("Balance!")
         console.log(receipt);
     });


 }

stake = async (amount, time) => {
    const seven = 604800; // 7 days
    const thirty = 2592000; //30 days 1M
    const ninety = 7776000; //90 days 3M
    //15552000 180 days 6M
    //31104000 360 days 1 year
    //155520000 1800 days 5years

    // let amount = parseInt(document.getElementById('amount_input').value);
    // let time = parseInt(document.getElementById('amount_input').value);
     
     const web3 = await Moralis.enableWeb3();
     const accounts = await Moralis.User.current();
     const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
     
     contract.methods.stake(amount, time).send({from: accounts.get('ethAddress'), value: 0})
     .on("receipt", function(receipt){
         alert(amount + " WALY has been staked");
         console.log(receipt);
         setTimeout(refreshcontract, 3000);
     });
 
 }

unstake = async () => {
    
   let amount = parseInt(document.getElementById('unstake_amount').value);
    
    const web3 = await Moralis.enableWeb3();
    const accounts = await Moralis.User.current();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    
    contract.methods.unstake(amount).send({from: accounts.get('ethAddress'), value: 0})
    .on("receipt", function(receipt){
        alert(amount + " WALY have been unstaked");
        console.log(receipt);
        setTimeout(refreshcontract, 3000);
    });

}

burn = async () => {
    let amount = parseInt(document.getElementById('burn_amount').value);

    
    const web3 = await Moralis.enableWeb3();
    const accounts = await Moralis.User.current();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    
    contract.methods.burn(amount).send({from: accounts.get('ethAddress'), value: 0})
    .on("receipt", function(receipt){
        alert(amount + " WALY have been burned");
        console.log(receipt);
        setTimeout(refreshcontract, 3000);
    });   
}
function cantBurn(){
    alert("Can only access burning features during authorized Burn Periods. Hang around the discord to discover new burning periods 👀");
}

burnPeriod = async () =>{
    let status = document.getElementById('burn_period').value;

    const web3 = await Moralis.enableWeb3();
    const accounts = await Moralis.User.current();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    contract.methods.turnOnBurn(status).send({from: accounts.get('ethAddress'), value: 0})
    .on("receipt", function(receipt){
        alert("burn period is: " + status);
        console.log(receipt);
        setTimeout(refreshcontract, 3000);
    });
}
//Burn from contract supply
burnSupply = async () =>{
    let amount = parseInt(document.getElementById('deplete').value);

    const web3 = await Moralis.enableWeb3();
    const accounts = await Moralis.User.current();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    contract.methods.deplete(amount).send({from: accounts.get('ethAddress'), value: 0})
    .on("receipt", function(receipt){
        alert(amount + " WALY Tokens have been burned period");
        console.log(receipt);
        setTimeout(refreshcontract, 3000);
    });
}

setPrice = async () =>{
    let price = parseInt(document.getElementById('setPrice').value);
    const maticInWei = Moralis.Units.ETH(price);

    const web3 = await Moralis.enableWeb3();
    const accounts = await Moralis.User.current();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    contract.methods.setPrice(maticInWei).send({from: accounts.get('ethAddress'), value: 0})
    .on("receipt", function(receipt){
        alert("Contribution now set to " + price + " MATIC");
        alert(maticInWei + " Wei");
        console.log(receipt);
        setTimeout(refreshcontract, 3000);
    });
}

setOwner = async () =>{
    let newOwner = document.getElementById('setOwner').value;
    
    const web3 = await Moralis.enableWeb3();
    const accounts = await Moralis.User.current();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    contract.methods.setOwner(newOwner).send({from: accounts.get('ethAddress'), value: 0})
    .on("receipt", function(receipt){
        alert("New Owner now set to: " + newOwner);
        console.log(receipt);
        setTimeout(refreshcontract, 3000);
    });
}

newTeamWallet = async () =>{
    let newWallet = document.getElementById('newWallet').value;

    const web3 = await Moralis.enableWeb3();
    const accounts = await Moralis.User.current();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    contract.methods.teamWallet(newWallet).send({from: accounts.get('ethAddress'), value: 0})
    .on("receipt", function(receipt){
        alert("Team Wallet now set to: " + newWallet);
        console.log(receipt);
        setTimeout(refreshcontract, 3000);
    });
}

contribution = async () =>{
    let amount = parseInt(document.getElementById('contribute_amount').value);
    const maticInWei = Moralis.Units.ETH(amount);

    const web3 = await Moralis.enableWeb3();
    const accounts = await Moralis.User.current();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    contract.methods.contribute().send({from: accounts.get('ethAddress'), value: maticInWei})
    .on("receipt", function(receipt){
        alert("Thank you for your Contributions of " + amount + " MATIC. " + " 250,000 WALY tokens have been sent to your wallet address");
        console.log(receipt);
        setTimeout(refreshcontract, 3000);
    });
  
}

secondContribution = async () =>{
    let amount = parseInt(document.getElementById('sendMatic').value);
    const maticInWei = Moralis.Units.ETH(amount);

    const web3 = await Moralis.enableWeb3();
    const accounts = await Moralis.User.current();
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    contract.methods.contribute().send({from: accounts.get('ethAddress'), value: maticInWei})
    .on("receipt", function(receipt){
        alert("Thank you for your Contributions of " + amount + " MATIC. " + " 250,000 WALY tokens have been sent to your wallet address");
        console.log(receipt);
        setTimeout(refreshcontract, 3000);
    });
  
}

async function renderStakedAmount(){
    const table = document.getElementById('userStakedBal');
    const user = await Moralis.User.current();
    const stakedamount = new Moralis.Query('staked');
    stakedamount.equalTo('staker', user.get('ethAddress'));
    const results = stakedamount.find();
   // alert("Successfully retrieved " + results.length + " monsters.");
   console.log(results);
/*
    stake.forEach( async (staked)  =>{
        let row = table.insertRow();
        let stakedDate = row.insertCell(0);
        stakedDate.innerHTML = await staked.result.attribute.block_timestamp;
        let stakedAmount= row.insertCell(1); 
        stakedAmount.innerHTML = await staked.result.attribute.amount;
        let unstakeDate = row.insertCell(2);
        unstakeDate.innerHTML = await staked.result.attribute.unlockDate;
        let tokenAddress = row.insertCell(3);
        tokenAddress.innerHTML = await staked.result.attribute.address;
    });
 */   
}

async function renderStakedAmount(){
    const user = await Moralis.User.current();
    //const stakedAmount = document.getElementById("amountBurned");
    const stakedamount = new Moralis.Query('staked');
    stakedamount.equalTo('staker', user.get('ethAddress'));
    const results = stakedamount.first();
    //const results = lastStake.find();
   // alert("Successfully retrieved " + results.length + " monsters.");
   console.log(results);

/*
    let htmlStringValue = `
    <p style="color:red"> ${burnedamount} <b><span style="color:black">TOTAL BURNED</span></b></p> 
    `;

    burnedAmount.innerHTML = htmlStringValue; 
  */  
}

//Toggles
function displayAbout(){
    $('#summary').toggle();

    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#tokenBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#burnBox').hide();
    $('#adminBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 
    $('#bytespaperBox').hide();

    $('#content-header').show();
}
function discordAbout(){
    $('#discordBox').toggle();

    $('#summary').hide();
    $('#nftBox').hide();
    $('#tokenBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#burnBox').hide();
    $('#adminBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 
    $('#bytespaperBox').hide();

    $('#content-header').show();
}
function displayNFT(){
    $('#nftBox').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#tokenBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#burnBox').hide();
    $('#adminBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 
    $('#bytespaperBox').hide();

    $('#content-header').show();
}
function displayTokens(){
    $('#tokenBox').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#burnBox').hide();
    $('#adminBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 

    $('#content-header').show();
}
function displayDashboard(){
    $('#dashboard').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#tokenBox').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#burnBox').hide();
    $('#adminBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 
    $('#bytespaperBox').hide();

    $('#content-header').show();
}
function displayStake(){
    $('#stakeBox').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#tokenBox').hide();
    $('#dashboard').hide();
    $('#unstakeBox').hide();
    $('#burnBox').hide();
    $('#adminBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 
    $('#bytespaperBox').hide();

    $('#content-header').show();
}
function displayUnstake(){
    $('#unstakeBox').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#tokenBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#burnBox').hide();
    $('#adminBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 
    $('#bytespaperBox').hide();

    $('#content-header').show();
}

//Reward display for burning period users
function displayPortal(){
    $('#portalBox').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#tokenBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#adminBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#burnBox').hide();
    $('#bytespaperBox').hide();
    $('#adminBox').hide(); 

    $('#content-header').show();
    
}
function alertPortalStatus(){
    alert("GM your early , Minting Portal is not open yet.");
}

function displayBurn(){
    $('#burnBox').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#tokenBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#adminBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#bytespaperBox').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 
    $('#content-header').show();
}

function displayContribute(){
    $('#contributeBox').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#tokenBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#adminBox').hide();
    $('#burnBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#bytespaperBox').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 
    $('#content-header').show();
}

displayAdminPanel = async() => {
    let user = await Moralis.User.current();
    const admin = user.get('ethAddress');
   
   if(admin == ADMIN){
    $('#adminBox').toggle();   

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#tokenBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#contributeBox').hide();
    $('#burnBox').hide();
    $('#bytespaperBox').hide();
    $('#send-nfts').hide();
    $('#portalBox').hide();

    $('#content-header').show();
        
    }else{
        alert("ADMIN Priveldges required");
    }


}

function displayNFTcontribute(){
    $('#wally-nfts').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#adminBox').hide();
    $('#burnBox').hide();
    $('#contributeBox').hide();
    $('#send-nfts').hide();
    $('#bytespaperBox').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 

    $('#content-header').show();
}

function displayMaticContribute(){
    $('#send-nfts').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#adminBox').hide();
    $('#burnBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#bytespaperBox').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 
    

    $('#content-header').show();
}

function displayBytesPaper(){
    $('#bytespaperBox').toggle();

    $('#summary').hide();
    $('#discordBox').hide();
    $('#nftBox').hide();
    $('#dashboard').hide();
    $('#stakeBox').hide();
    $('#unstakeBox').hide();
    $('#adminBox').hide();
    $('#burnBox').hide();
    $('#contributeBox').hide();
    $('#wally-nfts').hide();
    $('#send-nfts').hide();
    $('#portalBox').hide();
    $('#adminBox').hide(); 
    $('#tokenBox').hide();
    $('#content-header').hide();
}

//subgroup - toggles - charts
function displayChart1(){
    $('#funds_chart').toggle();

    $('#distribution_chart').hide();
    $('#opWallet_chart').hide();
}
function displayChart2(){
    $('#distribution_chart').toggle();

    $('#funds_chart').hide();
    $('#opWallet_chart').hide();
}
function displayChart3(){
    $('#opWallet_chart').toggle();

    $('#funds_chart').hide();
    $('#distribution_chart').hide();
}

//dashboard displays
function displayTX(){
    $('#appTX').toggle();

    $('#appERC20Bal').hide();
    $('#appStakedBal').hide();
}
function display20Bal(){
    $('#appERC20Bal').toggle();

    $('#appStakedBal').hide();
    $('#appTX').hide();

    
}
function displayStakedBal(){
    $('#appStakedBal').toggle();
   

    $('#appTX').hide();
    $('#appERC20Bal').hide();    
}

//helper Functions
function refreshcontract(){
    location.reload(); 
}
//content
document.getElementById('aboutBtn').onclick = displayAbout;
document.getElementById('discordBtn').onclick = discordAbout;
document.getElementById('nftBtn').onclick = displayNFT;
document.getElementById('memeBtn').onclick = displayTokens;
document.getElementById('DashboardBtn').onclick = displayDashboard;
document.getElementById('tx-Btn').onclick = displayTX;
document.getElementById('bal-Btn').onclick = display20Bal;
document.getElementById('staked-Btn').onclick = displayStakedBal;
document.getElementById('stakingBtn').onclick = displayStake;
document.getElementById('unstakeBtn').onclick = displayUnstake;
document.getElementById('burningBtn').onclick = displayBurn;
document.getElementById('contributeBtn').onclick = displayContribute;
document.getElementById('NFTwally').onclick = displayNFTcontribute;
document.getElementById('conWaly').onclick = displayMaticContribute;
document.getElementById('byteBtn').onclick = displayBytesPaper;
//charts
document.getElementById('_fund').onclick = displayChart1;
document.getElementById('_distribution').onclick = displayChart2;
document.getElementById('opWallet').onclick = displayChart3;
//interactions
document.getElementById('adminBtn').onclick = displayAdminPanel;
document.getElementById('_unstake').onclick = unstake;
document.getElementById('7_stake').onclick = stakeSeven;
document.getElementById('30_stake').onclick = stakeMonth;
document.getElementById('90_stake').onclick = stakeNinety;
document.getElementById('180_stake').onclick = stake180;
document.getElementById('365_stake').onclick = stake365;
document.getElementById('1800_stake').onclick = stake5yrs;
document.getElementById('burn-period').onclick = burnPeriod;
document.getElementById('burn-supply').onclick = burnSupply;
document.getElementById('set-price').onclick = setPrice;
document.getElementById('set-owner').onclick = setOwner;
document.getElementById('set-wallet').onclick = newTeamWallet;
document.getElementById('contribute').onclick = contribution; 
document.getElementById('send-matic').onclick = secondContribution; 
//timed operator controlled events
//Burn Period On/Off 
document.getElementById('_burn').onclick = cantBurn; //burn period off
//document.getElementById('_burn').onclick = burn; //burn period on

//minting portal display
document.getElementById('portalBtn').onclick = alertPortalStatus;
//document.getElementById('portalBtn').onclick = displayPortal;

init();