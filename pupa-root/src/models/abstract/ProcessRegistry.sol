// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;


interface IFunct {
    // WorkList functions
    function updateRuntimeRegistry(address _runtimeRegistry) external;
    // Factory Functions
    function setWorklist(address _worklist) external;
    function startInstanceExecution(address processAddress) external;
    function newInstance(address parent, address globalFactory) external returns(address);
    function findParent() external view returns(address);
}

contract ProcessRegistry {
    mapping (bytes32 => mapping (uint => bytes32)) private parent2ChildrenBundleId;
    mapping (bytes32 => address) private factories;
    mapping (bytes32 => bytes32) private policy;
    mapping (bytes32 => bytes32) private taskRole;

    mapping (address => bytes32) private instance2Bundle;
    mapping (address => address) private instance2PolicyOp;
    address[] private instances;

    mapping (address => bytes32) private worklist2Bundle;

    event NewInstanceCreatedFor(address parent, address processAddress);

    function registerFactory(bytes32 bundleId, address factory) external {
        factories[bundleId] = factory;
    }

    function registerWorklist(bytes32 bundleId, address worklist) external {
        address factory = factories[bundleId];
        require(factory != address(0));
        worklist2Bundle[worklist] = bundleId;
        IFunct(factory).setWorklist(worklist);
        IFunct(worklist).updateRuntimeRegistry(address(this));
    }


    function findRuntimePolicy(address pCase) public view returns(address) {
        return instance2PolicyOp[pCase];
    }

    function relateProcessToPolicy(bytes32 bundleId, bytes32 policyPTP, bytes32 taskRolePTP) external {
        taskRole[bundleId] = taskRolePTP;
        policy[bundleId] = policyPTP;
    }


    function addChildBundleId(bytes32 parentBundleId, bytes32 processBundleId, uint nodeIndex) external {
        parent2ChildrenBundleId[parentBundleId][nodeIndex] = processBundleId;
    }

    function newInstanceFor(uint nodeIndex, address parent) public returns(address) {
        return newBundleInstanceFor(parent2ChildrenBundleId[instance2Bundle[parent]][nodeIndex], parent, instance2PolicyOp[parent]);
    }

    function newBundleInstanceFor(bytes32 bundleId, address parent, address policyOpAddr) public returns(address) {
        address factory = factories[bundleId];
        require(factory != address(0));
        address processAddress = IFunct(factory).newInstance(parent, address(this));
        //address processAddress = address(0);
        instance2Bundle[processAddress] = bundleId;
        instance2PolicyOp[processAddress] = policyOpAddr;
        instances.push(processAddress);
        IFunct(factory).startInstanceExecution(processAddress);
        emit NewInstanceCreatedFor(parent, processAddress);
        return processAddress;

    }

    function allInstances() external view returns(address[] memory) {
        return instances;
    }

    function bindingPolicyFor(address procInstance) external view returns(bytes32) {
        bytes32 pId = instance2Bundle[procInstance];
        address pAddr = procInstance;
        while(policy[pId].length != 0) {
            pAddr = IFunct(pAddr).findParent();
            if(pAddr == address(0))
                break;
            pId = instance2Bundle[pAddr];
        }
        return policy[pId];
    }

    function taskRoleMapFor(address procInstance) external view returns(bytes32) {
        bytes32 pId = instance2Bundle[procInstance];
        address pAddr = procInstance;
        while(taskRole[pId].length != 0) {
            pAddr = IFunct(pAddr).findParent();
            if(pAddr == address(0x0))
                break;
            pId = instance2Bundle[pAddr];
        }
        return taskRole[pId];
    }

    function bindingPolicyFromId(bytes32 procId) external view returns(bytes32) {
        return policy[procId];
    }

    function taskRoleMapFromId(bytes32 procId) external view returns(bytes32) {
        return taskRole[procId];
    }

    function bundleFor(address processInstance) external view returns(bytes32) {
        return instance2Bundle[processInstance];
    }

    function childrenFor(bytes32 parent, uint nodeInd) external view returns(bytes32) {
        return parent2ChildrenBundleId[parent][nodeInd];
    }

    function worklistBundleFor(address worklist) external view returns(bytes32) {
        return worklist2Bundle[worklist];
    }
}