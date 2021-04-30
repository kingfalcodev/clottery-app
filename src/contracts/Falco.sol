// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Falco is ERC20 {
    constructor(uint256 initialSupply) ERC20("Falco", "FL") {
        _mint(msg.sender, initialSupply);
    }

    function mint(uint256 supply) public {
        _mint(msg.sender, supply);
    }
}
