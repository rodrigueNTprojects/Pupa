// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

abstract contract AbstractFactory {
    address internal worklist = address(0);

    function setWorklist(address sworklist) public {
        require(address(sworklist) != address(0));
        worklist = sworklist;
    }

    function newInstance(address parent, address globalFactory) virtual public returns(address);
    function startInstanceExecution(address processAddress) virtual public;
}
