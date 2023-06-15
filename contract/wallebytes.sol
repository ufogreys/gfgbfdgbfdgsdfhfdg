pragma solidity ^0.8.0;

//import OPZ contracts
 
contract WalleBytesToken is ERC20 {
    address public owner;
    address operationWallet; //contract
    uint256 reward;
    uint256 bonus;
    uint256 public price;
    bool burnPeriod;
 
    mapping(address => uint) balance; //maps user/Contract balance
    mapping(address => uint) public lockedBalance; //locked tokens
    mapping(address => uint) createdAt; //maps user time tokens staked
    mapping(address => uint) unlockDate; //maps user stake release time
    mapping(address => bool) hasStaked; //users can only have one stake at a time
   
    modifier greaterThanZero
        {
            require(msg.value > 0, "You have to enter a sum great than zero!");
            _;
        }
    modifier onlyOwner
        {
            require(msg.sender == owner, "Only owner");
            _;
        }
    modifier hasNoStake
        {
            require(hasStaked[msg.sender] == false, "Staked WALY balance must be zero");
            _;
        }    
    modifier burnTime
        {
            require(burnPeriod == true, "You can not burn tokens outside of alotted time");
            _;
        }
 
    //event transferred(address sender, address recevier,uint256 amount);
    event staked(address staker, uint256 amount, uint256 date, uint256 unlockDate);
    event unstaked(address staker, uint256 amount,uint256 remainingBalance, uint256 date);
    event contribution(address contributor, uint256 amount, uint256 date);
    event userBurn(address user, uint256 amount, uint256 date);
    event burningPeriod(address operator, bool onOff, uint256 date);
    event teamChange(address operator, address prevAddress, address newAddress, uint date);
    event ownerChange(address currentOwner, address newOwner, uint256 date);
    event priceSet(address operator, uint256 prevPrice, uint256 newPrice, uint256 date);
    event purged(address operator, uint256 amount, uint256 date); //owner burns token supply
 
    constructor() ERC20("WalleBytes", "WALY") {
        owner = msg.sender;
        operationWallet = 0xB1ac47931367683F1739Eb6fa1B2dEFC631315fC; //Team Wallet
        reward = 250000;
        bonus = 12700000;
        price = 2000000000000000000;
        burnPeriod = false;
 
        _mint(msg.sender, 27000000000 *(10**18));
        _approve(owner,  address(this), 26000000000 *(10**18));
        _transfer(owner, address(this), 26000000000 *(10**18));
        balance[address(this)]+= 26000000000;
        balance[msg.sender]+= 1000000000;
   
    }
 
    //recevies ERC1155
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4)
    {
       
        require((balance[address(this)] - lockedBalance[address(this)]) >= bonus);
        balance[address(this)]-= bonus;
        balance[from]+= bonus;
 
       _transfer(address(this), from, bonus *(10**18));
 
       return this.onERC1155Received.selector;
       
    }
   
    function setPrice(uint256 _price) public onlyOwner returns(bool success){
        uint256 prevPrice = price;
        price = _price;
 
        emit priceSet(msg.sender, prevPrice, _price, block.timestamp);
        return true;
    }
 
    function setOwner(address _owner) public onlyOwner returns(bool success){
        owner = _owner;
 
        emit ownerChange(msg.sender, owner, block.timestamp);
        return true;
    }
    function teamWallet(address _operationWallet) public onlyOwner returns(bool success){
        address oldAddress = operationWallet;
        operationWallet = _operationWallet;
 
        emit teamChange(owner, oldAddress, operationWallet, block.timestamp);
        return true;
       
    }
 
    function turnOnBurn(bool _state) public onlyOwner returns(bool success){
        burnPeriod = _state;
 
        emit burningPeriod(owner, _state, block.timestamp);
        return true;
       
    }
 
    function burn(uint256 amount) public returns(bool success){
        require(balance[msg.sender] >= amount, "You cannot burn this many WALY tokens");
        require(burnPeriod == true, "You can only burn during authorized times, check DApp");
 
        _burn(msg.sender, amount *(10**18));
        balance[msg.sender]-= amount;
        emit userBurn(msg.sender, amount, block.timestamp);
        return true;
    }
 
    function deplete(uint _amount) public onlyOwner returns(bool success){
        require((balance[address(this)] - lockedBalance[address(this)]) >= _amount,"You cannot burn locked funds");
       
        _burn(address(this), _amount *(10**18));
 
        balance[address(this)]-=_amount;
 
        emit purged(msg.sender, _amount, block.timestamp);
        return true;
    }
 
    function contribute() payable public {
        require(msg.value >= price);
        require((balance[address(this)] - lockedBalance[address(this)]) >= reward, "Contract empty, cannot contribute");
 
       
        rewards(msg.sender);
    }
 
    function rewards(address _user) private {
        uint256 prevBalance = balance[address(this)];
 
        address payable ownerAddress = payable(operationWallet);
        ownerAddress.transfer(msg.value);
 
        balance[address(this)] -= reward;
        balance[msg.sender]+= reward;
 
        _transfer(address(this), _user, reward *(10**18));
 
        assert(balance[address(this)] == prevBalance - reward);
        emit contribution(msg.sender, msg.value, block.timestamp);
    }
 
    function stake(uint _amount, uint _time) public hasNoStake returns(bool success){
 
        uint256 currentAllowance = allowance(msg.sender, address(this));
 
        if(currentAllowance < _amount){
            uint256 approveBal = balanceOf(msg.sender);
            _approve(msg.sender, address(this), approveBal);
        }
 
        createdAt[msg.sender] = block.timestamp;
        unlockDate[msg.sender] = createdAt[msg.sender] + _time;
 
        _transfer(msg.sender, address(this), _amount *(10**18));
 
        //mapping trackers
       // balance[msg.sender]-= _amount;
        balance[address(this)]+= _amount;
        lockedBalance[msg.sender]+= _amount;
        lockedBalance[address(this)]+= _amount;
 
        hasStaked[msg.sender] = true;
        emit staked(msg.sender, _amount, block.timestamp, unlockDate[msg.sender]);
        return true;
 
    }  
 
   function unstake(uint _amount) public returns(bool success) {
       require(_amount <= lockedBalance[msg.sender], "You dont have this amount of WALY staked");
       require(block.timestamp >= unlockDate[msg.sender], "Your WALY stake still has time remaining before it can be unstaked");
 
       _unstake(_amount);
       
       return true;
   }      
 
   function _unstake(uint _amount) private {
       uint256 prevStakeBalance = lockedBalance[msg.sender];
 
       lockedBalance[msg.sender]-= _amount;
       lockedBalance[address(this)]-= _amount;
       
       balance[address(this)]-= _amount;
       
       _transfer(address(this), msg.sender, _amount);
 
      // balance[msg.sender]+= _amount;
 
       if(lockedBalance[msg.sender] == 0){
            hasStaked[msg.sender] = false;
       }
 
       
 
       assert(lockedBalance[msg.sender] == (prevStakeBalance - _amount));
       emit unstaked(msg.sender, _amount, lockedBalance[msg.sender], block.timestamp);
 
   }
 

 

 
      //Check Balances
    function userBalance() public view returns(uint){
        uint256 userBal = balanceOf(msg.sender);
        return userBal;
    }
    //tokens in contract
    function contractWalleBalance() public view returns (uint){
        return balance[address(this)];
    }
    //Locked contract tokens
    function totalLocked() public view returns (uint){
       
        return lockedBalance[address(this)];
    }
}