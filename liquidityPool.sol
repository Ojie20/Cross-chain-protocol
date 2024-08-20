// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    // event Transfer(address indexed from, address indexed to, uint256 value);
    // event Approval(address indexed owner, address indexed spender, uint256 value);
  }

    library Math {
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a<b) {
            return a;
        }
        return b;
    }
}

contract liquidityPool {

  uint256 public reserve1;//reserve of the first token
  uint256 public reserve2;//reserve of the second token

  IERC20 public token1;
  IERC20 public token2;

  uint256 public totalLiquidity;// liquidity in the pool

  mapping (address=>uint256)public userLiquidity;// liquidity owned by a particular user

  uint256 constant public MinimumLiquidity = 10**3;// required liquidity so the pool isn't empty

  function setAddress(address _token1, address _token2) public  {
    token1 = IERC20(_token1);
    token2 = IERC20(_token2);
  }

  function getReserves() public returns (uint256 _reserve1, uint256 _reserve2) {
    _reserve1 = reserve1;
    _reserve2 = reserve2;
  }

  function quote(uint256 amount1, uint256 _reserve1, uint256 _reserve2) public  returns (uint256) {
    uint256 amount2 = (amount1 * _reserve2) / _reserve1;
    return amount2;
  }

  function shouldAddLiquidity(uint256 token1quan, uint256 token2quan) public  returns (uint256 amount1, uint256 amount2){
    (uint256 _reserve1 ,uint256 _reserve2)= getReserves();
    if(_reserve1==0 && _reserve2==0){
      (amount1, amount2)=(token1quan, token2quan);
    }
    else {
       uint256 amount2Opt = quote(token1quan, _reserve1, _reserve2);
       if (amount2Opt<= token2quan){
        (amount1, amount2)=(token1quan, amount2Opt);
       }
       else {
        uint256 amount1Opt = quote(token2quan, _reserve2, _reserve1);
        (amount1, amount2)=(amount1Opt, token2quan);
       }
    }
  }


  function addLiquidity(uint256 amountTok1, uint256 amountTok2) public  {
    (uint256 amount1 ,uint256 amount2) = shouldAddLiquidity(amountTok1, amountTok2);
    token1.transferFrom(msg.sender, address(this), amount1);
    token2.transferFrom(msg.sender, address(this), amount2);
  }

  function mintLPtoken(address to) public returns (uint256 liquidity) {
    (uint256 _reserve1, uint256 _reserve2) = getReserves();

    uint256 balance1 = token1.balanceOf(address(this));
    uint256 balance2 = token2.balanceOf(address(this));

    uint256 amount1 = balance1-_reserve1;
    uint256 amount2 = balance2-_reserve2;

    uint256 _totalLiqidity = totalLiquidity;
    if(_totalLiqidity == 0){
       liquidity = Math.sqrt(amount1*amount2)-MinimumLiquidity;
    }
    else {
        liquidity = Math.min(
            amount1 *_totalLiqidity/reserve1, 
            amount2*_totalLiqidity/reserve2 
        );
    }
    userLiquidity[to]+= liquidity;
    totalLiquidity+=liquidity;

    reserve1 = token1.balanceOf(address(this));
    reserve2 = token2.balanceOf(address(this));
  }

  function burn(uint256 liquidity) public returns (uint256 amount1, uint256 amount2) {
    uint256 balance1 = token1.balanceOf(address(this));
    uint256 balance2 = token2.balanceOf(address(this));
    uint256 _totalLiquidity = totalLiquidity;
    amount1 = liquidity * balance1 / _totalLiquidity;
    amount2 = liquidity * balance2 / _totalLiquidity;
  }

  function removeLiquidity(uint256 liquidity, address to) public  {
    (uint256 amount1, uint256 amount2) = burn(liquidity);
    token1.transfer(to, amount1);
    token2.transfer(to, amount2);
    totalLiquidity -= liquidity;
    userLiquidity[to] -= liquidity;

    reserve1 = token1.balanceOf(address(this));
    reserve2 = token2.balanceOf(address(this));
  }
}