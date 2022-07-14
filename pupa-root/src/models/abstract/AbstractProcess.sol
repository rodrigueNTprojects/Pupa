// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "./AbstractRegistry.sol";


abstract contract AbstractProcess {
    address internal owner;
    address internal parent;
    address internal worklist;
    uint internal instanceIndex;
    address internal processRegistry;
    //uint internal captureNodeTime = 0;

    constructor(address _parent, address _worklist, address _processRegistry) public {
        owner = msg.sender;
        //require(address(_parent) != address(0));
        parent = _parent;
        require(address(_worklist) != address(0));
        worklist = _worklist;
        require(address(_processRegistry) != address(0));
        processRegistry = _processRegistry;
    }

    function setInstanceIndex(uint sinstanceIndex) public {
        require(msg.sender == parent);
        instanceIndex = sinstanceIndex;
    }

    function findParent() public view returns(address) {
        return parent;
    }

    function handleEvent(bytes32 code, bytes32 eventType, uint hEinstanceIndex, bool isInstanceCompleted) virtual public;    
    function killProcess() virtual public;
    function startExecution() virtual public;
    function broadcastSignal() virtual public;

    //Handle timer
    //function addTimer (uint _TimerIndex, address _timerRoleAddr, uint _timeNowCaptured, uint _duration) virtual internal;    
    //function updateTimerCompletion (uint _TimerIndex) virtual external;   
    
    

    function killProcess(uint processElementIndex, uint marking, uint startedActivities) virtual internal returns(uint, uint);
    function broadcastSignal(uint tmpMarking, uint tmpStartedActivities, uint sourceChild) virtual internal returns(uint, uint);

    function propagateEvent(bytes32 code, bytes32 eventType, uint tmpMarking, uint tmpStartedActivities, uint sourceChild) internal returns(uint, uint) {
        if (eventType == "Error" || eventType == "Terminate")
            (tmpMarking, tmpStartedActivities) = killProcess(0, tmpMarking, tmpStartedActivities);
        else if (eventType == "Signal")
            (tmpMarking, tmpStartedActivities) = broadcastSignal(tmpMarking, tmpStartedActivities, sourceChild);        
        if (parent != address(0))
            AbstractProcess(parent).handleEvent(code, eventType, instanceIndex, tmpMarking | tmpStartedActivities == 0);
        return (tmpMarking, tmpStartedActivities);
    }


}
