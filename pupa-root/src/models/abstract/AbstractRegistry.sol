// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

abstract contract AbstractRegistry {

    function registerFactory(bytes32 bundleId, address factory) virtual public;

    function registerWorklist(bytes32 bundleId, address worklist) virtual public;

    function allInstances() virtual public returns(address[] memory);

    function newInstanceFor(uint nodeIndex, address parent) virtual public returns(address);

    function newBundleInstanceFor(bytes32 bundleId, address parent) virtual public returns(address);

    function bundleFor(address processInstance) virtual public returns(bytes32);

    function worklistBundleFor(address worklist) virtual public returns(bytes32);

    // Functions for Dynamic Bindings
    function bindingPolicyFor(address processInstance) virtual public view returns(bytes32);

    function taskRoleMapFor(address processInstance) virtual public view returns(bytes32);

    function relateProcessToPolicy(bytes32 bundleId, bytes32 _taskRole, bytes32 _policy) virtual external;

    function canPerform(address actor, address processCase, uint taskIndex) virtual external view returns(bool);
}
