"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Decorators_1 = require("antlr4ts/Decorators");
const DataStructures_1 = require("./DataStructures");
class BindingVisitor {
    constructor() {
        this._names = [];
        this.policy = new DataStructures_1.Policy();
    }
    defaultResult() {
        return "";
    }
    updateRules(names) {
        this._names = names;
    }
    visitTerminal(node) {
        let res = node.toStringTree();
        if (res === 'and')
            return '&';
        else if (res === 'or')
            return '|';
        else
            return res;
    }
    visitErrorNode(node) {
        let res = node.toStringTree();
        return res;
    }
    visit(tree) {
        return tree.accept(this);
    }
    visitUnbinding_statement(ctx) {
        let statement = new DataStructures_1.Statement();
        statement.nominator = ctx.nominator().accept(this);
        statement.nominee = ctx.nominee().accept(this);
        if (ctx.binding_constr() !== undefined)
            statement.bindingConstraint = this.createDisjunctionSet(ctx.binding_constr().accept(this));
        if (ctx.endorsement_constr() !== undefined)
            statement.endorsementConstraint = this.createDisjunctionSet(ctx.endorsement_constr().accept(this));
        this.policy.addReleaseStatement(statement);
        return '';
    }
    visitBinding_statement(ctx) {
        if (ctx.is_creator() !== undefined) {
            let creator = ctx.is_creator().accept(this);
            this.policy.setCreator(creator);
        }
        else {
            let statement = new DataStructures_1.Statement();
            statement.nominator = ctx.nominator().accept(this);
            statement.nominee = ctx.nominee().accept(this);
            if (ctx.binding_constr() !== undefined)
                statement.bindingConstraint = this.createDisjunctionSet(ctx.binding_constr().accept(this));
            if (ctx.endorsement_constr() !== undefined)
                statement.endorsementConstraint = this.createDisjunctionSet(ctx.endorsement_constr().accept(this));
            this.policy.addNominationStatement(statement);
        }
        return '';
    }
    visitIs_creator(ctx) {
        return ctx.role().text;
    }
    visitNominator(ctx) {
        this.policy.addRole(ctx.text);
        return ctx.text;
    }
    visitNominee(ctx) {
        this.policy.addRole(ctx.text);
        return ctx.text;
    }
    visitRole(ctx) {
        this.policy.addRole(ctx.text);
        return ctx.text;
    }
    visitBinding_constr(ctx) {
        let neg = ctx.NOT() === undefined ? '+' : '-';
        return neg + ctx.set_expresion().accept(this);
    }
    visitEndorsement_constr(ctx) {
        return '+' + ctx.set_expresion().accept(this);
    }
    visitSet_expresion(ctx) {
        let exp = '';
        for (let i = 0; i < ctx.childCount; i++)
            exp += ctx.getChild(i).accept(this);
        return exp;
    }
    visitChildren(node) {
        let nodeName = this._names[node.ruleContext.ruleIndex];
        let res = '';
        for (let i = 0; i < node.childCount; i++)
            res += node.getChild(i).accept(this);
        return res;
    }
    createDisjunctionSet(setStr) {
        let disjunctionSet = new DataStructures_1.DisjunctionSet();
        disjunctionSet.isNegative = setStr[0] === '+' ? false : true;
        let conjS = setStr.substr(1).split('|');
        conjS.forEach(value => {
            let conjuntionSet = new DataStructures_1.ConjunctionSet();
            conjuntionSet.roles = value.split('&');
            disjunctionSet.conjunctionSets.push(conjuntionSet);
        });
        return disjunctionSet;
    }
}
__decorate([
    Decorators_1.Override
], BindingVisitor.prototype, "visitTerminal", null);
__decorate([
    Decorators_1.Override
], BindingVisitor.prototype, "visitErrorNode", null);
exports.BindingVisitor = BindingVisitor;
//# sourceMappingURL=BindingPolicyParser.js.map