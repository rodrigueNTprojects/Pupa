"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Policy {
    constructor() {
        this.caseCreator = undefined;
        this.roleIndexMap = new Map();
        this.roleCount = 0;
        this.nominationStatements = new Array();
        this.releaseStatements = new Array();
        this.solidity = undefined;
    }
    setCreator(caseCreator) {
        this.caseCreator = caseCreator;
        this.addRole(caseCreator);
    }
    addRole(roleId) {
        if (!this.roleIndexMap.has(roleId))
            this.roleIndexMap.set(roleId, ++this.roleCount);
    }
    addNominationStatement(statement) {
        this.nominationStatements.push(statement);
    }
    addReleaseStatement(statement) {
        this.releaseStatements.push(statement);
    }
    print() {
        console.log('Roles: ');
        for (var [key, value] of this.roleIndexMap) {
            console.log(key + ': ' + value);
        }
        console.log('---------------------------');
        this.nominationStatements.forEach(value => {
            value.print();
            console.log('---------------------------');
        });
    }
}
exports.Policy = Policy;
class Statement {
    constructor() {
        this.bindingConstraint = undefined;
        this.endorsementConstraint = undefined;
    }
    print() {
        console.log('Nominator: ', this.nominator);
        console.log('Nominee: ', this.nominee);
        if (this.bindingConstraint !== undefined) {
            console.log('Binding Constraints ');
            this.bindingConstraint.print();
        }
        if (this.endorsementConstraint !== undefined) {
            console.log('Endorsement Constraints ');
            this.endorsementConstraint.print();
        }
    }
}
exports.Statement = Statement;
class DisjunctionSet {
    constructor() {
        this.conjunctionSets = new Array();
    }
    print() {
        console.log('  Disjunction Set: ', this.isNegative ? 'NOT IN' : 'IN');
        this.conjunctionSets.forEach(value => {
            value.print();
        });
    }
}
exports.DisjunctionSet = DisjunctionSet;
class ConjunctionSet {
    constructor() {
        this.roles = new Array();
    }
    print() {
        console.log('    [' + this.roles.toString() + ']');
    }
}
exports.ConjunctionSet = ConjunctionSet;
//# sourceMappingURL=DataStructures.js.map