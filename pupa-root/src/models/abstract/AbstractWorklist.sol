// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

abstract contract IRFunct {
    function findRuntimePolicy(address pCase) virtual public view returns(address);
    function canPerform(address actor, address pCase, uint taskIndex) virtual public view returns(bool);
}
contract AbstractWorklist {

    struct Workitem {
        uint elementIndex;
        address processInstanceAddr;
    }
    //mapping (bytes32 => uint) internal nodeId2PrevTimerWorkitem;
    Workitem[] internal workitems;
    address internal runtimeRegistry;

    function updateRuntimeRegistry(address uruntimeRegistry) public {
        require(address(uruntimeRegistry) != address(0));
        runtimeRegistry = uruntimeRegistry;
    }

    function workItemsFor(uint elementIndex, address processInstance) external view returns(uint) {
        uint reqIndex = 0;
        for (uint i = 0; i < workitems.length; i++) {
            if (workitems[i].elementIndex == elementIndex && workitems[i].processInstanceAddr == processInstance)
                reqIndex |= uint(1) << i;
        }
        
        return reqIndex;
    }

    function processInstanceFor(uint workitemId) public view returns(address) {
        require(workitemId < workitems.length);
        return workitems[workitemId].processInstanceAddr;
    } 

    function elementIndexFor(uint workitemId) public view returns(uint) {
        require(workitemId < workitems.length);
        return workitems[workitemId].elementIndex;
    }

    function canPerform(address actor, address pCase, uint elementIndex) internal view returns(bool) {
        return IRFunct(IRFunct(runtimeRegistry).findRuntimePolicy(pCase)).canPerform(actor, pCase, elementIndex);
    }
}