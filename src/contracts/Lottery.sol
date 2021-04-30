//SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "hardhat/console.sol";

contract Lottery {
    using SafeMath for uint256;
    address public manager;
    address payable[] public players;
    IERC20 public fl;
    uint256 public lastDrawTimestamp;

    constructor(address managerAddress, address flAddress) {
        manager = managerAddress;
        fl = IERC20(flAddress);
    }

    function enter() external payable {
        require(
            block.timestamp - lastDrawTimestamp > 300,
            "Cannot enter the lottery"
        );

        fl.transferFrom(msg.sender, address(this), 20 ether);

        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public restricted {
        uint256 balanceMantissa = fl.balanceOf(address(this));
        uint256 index = random().mod(players.length);
        uint256 prizeMantissa = balanceMantissa.mul(19).div(20);
        uint256 feeMantissa = balanceMantissa - prizeMantissa;

        fl.transfer(players[index], prizeMantissa);
        fl.transfer(manager, feeMantissa);

        players = new address payable[](0);
        lastDrawTimestamp = block.timestamp;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getBalance() public view returns (uint256) {
        return fl.balanceOf(address(this));
    }
}
