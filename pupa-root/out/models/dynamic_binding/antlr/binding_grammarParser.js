"use strict";
// Generated from ./src/models/dynamic_binding/antlr/binding_grammar.g4 by ANTLR 4.6-SNAPSHOT
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ATN_1 = require("antlr4ts/atn/ATN");
const ATNDeserializer_1 = require("antlr4ts/atn/ATNDeserializer");
const Decorators_1 = require("antlr4ts/Decorators");
const NoViableAltException_1 = require("antlr4ts/NoViableAltException");
const Decorators_2 = require("antlr4ts/Decorators");
const Parser_1 = require("antlr4ts/Parser");
const ParserRuleContext_1 = require("antlr4ts/ParserRuleContext");
const ParserATNSimulator_1 = require("antlr4ts/atn/ParserATNSimulator");
const RecognitionException_1 = require("antlr4ts/RecognitionException");
const RuleVersion_1 = require("antlr4ts/RuleVersion");
const VocabularyImpl_1 = require("antlr4ts/VocabularyImpl");
const Utils = require("antlr4ts/misc/Utils");
class binding_grammarParser extends Parser_1.Parser {
    constructor(input) {
        super(input);
        this._interp = new ParserATNSimulator_1.ParserATNSimulator(binding_grammarParser._ATN, this);
    }
    get vocabulary() {
        return binding_grammarParser.VOCABULARY;
    }
    get grammarFileName() { return "binding_grammar.g4"; }
    get ruleNames() { return binding_grammarParser.ruleNames; }
    get serializedATN() { return binding_grammarParser._serializedATN; }
    binding_policy() {
        let _localctx = new Binding_policyContext(this._ctx, this.state);
        this.enterRule(_localctx, 0, binding_grammarParser.RULE_binding_policy);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 34;
                this.binding_set();
                this.state = 35;
                this.unbinding_set();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    binding_set() {
        let _localctx = new Binding_setContext(this._ctx, this.state);
        this.enterRule(_localctx, 2, binding_grammarParser.RULE_binding_set);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 37;
                this.match(binding_grammarParser.LBRACES);
                this.state = 38;
                this.binding_statement();
                this.state = 43;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === binding_grammarParser.SEMICOLON) {
                    {
                        {
                            this.state = 39;
                            this.match(binding_grammarParser.SEMICOLON);
                            this.state = 40;
                            this.binding_statement();
                        }
                    }
                    this.state = 45;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 46;
                this.match(binding_grammarParser.RBRACES);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    unbinding_set() {
        let _localctx = new Unbinding_setContext(this._ctx, this.state);
        this.enterRule(_localctx, 4, binding_grammarParser.RULE_unbinding_set);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 48;
                this.match(binding_grammarParser.LBRACES);
                this.state = 58;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case binding_grammarParser.SELF:
                    case binding_grammarParser.IDENTIFIER:
                        {
                            this.state = 49;
                            this.unbinding_statement();
                            this.state = 54;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                            while (_la === binding_grammarParser.SEMICOLON) {
                                {
                                    {
                                        this.state = 50;
                                        this.match(binding_grammarParser.SEMICOLON);
                                        this.state = 51;
                                        this.unbinding_statement();
                                    }
                                }
                                this.state = 56;
                                this._errHandler.sync(this);
                                _la = this._input.LA(1);
                            }
                        }
                        break;
                    case binding_grammarParser.RBRACES:
                        {
                        }
                        break;
                    default:
                        throw new NoViableAltException_1.NoViableAltException(this);
                }
                this.state = 60;
                this.match(binding_grammarParser.RBRACES);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    binding_statement() {
        let _localctx = new Binding_statementContext(this._ctx, this.state);
        this.enterRule(_localctx, 6, binding_grammarParser.RULE_binding_statement);
        let _la;
        try {
            this.state = 75;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 6, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 62;
                        this.is_creator();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 64;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === binding_grammarParser.UNDER) {
                            {
                                this.state = 63;
                                this.scope_restriction();
                            }
                        }
                        this.state = 66;
                        this.nominator();
                        this.state = 67;
                        this.match(binding_grammarParser.NOMINATES);
                        this.state = 68;
                        this.nominee();
                        this.state = 70;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === binding_grammarParser.IN || _la === binding_grammarParser.NOT) {
                            {
                                this.state = 69;
                                this.binding_constr();
                            }
                        }
                        this.state = 73;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === binding_grammarParser.ENDORSED_BY) {
                            {
                                this.state = 72;
                                this.endorsement_constr();
                            }
                        }
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    unbinding_statement() {
        let _localctx = new Unbinding_statementContext(this._ctx, this.state);
        this.enterRule(_localctx, 8, binding_grammarParser.RULE_unbinding_statement);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 77;
                this.nominator();
                this.state = 78;
                this.match(binding_grammarParser.RELEASES);
                this.state = 79;
                this.nominee();
                this.state = 81;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === binding_grammarParser.IN || _la === binding_grammarParser.NOT) {
                    {
                        this.state = 80;
                        this.binding_constr();
                    }
                }
                this.state = 84;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === binding_grammarParser.ENDORSED_BY) {
                    {
                        this.state = 83;
                        this.endorsement_constr();
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    is_creator() {
        let _localctx = new Is_creatorContext(this._ctx, this.state);
        this.enterRule(_localctx, 10, binding_grammarParser.RULE_is_creator);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 86;
                this.role();
                this.state = 87;
                this.match(binding_grammarParser.IS);
                this.state = 88;
                this.match(binding_grammarParser.CASE_CREATOR);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    binding_constr() {
        let _localctx = new Binding_constrContext(this._ctx, this.state);
        this.enterRule(_localctx, 12, binding_grammarParser.RULE_binding_constr);
        try {
            this.state = 95;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case binding_grammarParser.NOT:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 90;
                        this.match(binding_grammarParser.NOT);
                        this.state = 91;
                        this.match(binding_grammarParser.IN);
                        this.state = 92;
                        this.set_expresion();
                    }
                    break;
                case binding_grammarParser.IN:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 93;
                        this.match(binding_grammarParser.IN);
                        this.state = 94;
                        this.set_expresion();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    endorsement_constr() {
        let _localctx = new Endorsement_constrContext(this._ctx, this.state);
        this.enterRule(_localctx, 14, binding_grammarParser.RULE_endorsement_constr);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 97;
                this.match(binding_grammarParser.ENDORSED_BY);
                this.state = 98;
                this.set_expresion();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    set_expresion() {
        let _localctx = new Set_expresionContext(this._ctx, this.state);
        this.enterRule(_localctx, 16, binding_grammarParser.RULE_set_expresion);
        try {
            this.state = 113;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 10, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 100;
                        this.match(binding_grammarParser.LPAREN);
                        this.state = 101;
                        this.set_expresion();
                        this.state = 102;
                        this.match(binding_grammarParser.RPAREN);
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 104;
                        this.role();
                        this.state = 105;
                        this.match(binding_grammarParser.OR);
                        this.state = 106;
                        this.set_expresion();
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 108;
                        this.role();
                        this.state = 109;
                        this.match(binding_grammarParser.AND);
                        this.state = 110;
                        this.set_expresion();
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 112;
                        this.role();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    scope_restriction() {
        let _localctx = new Scope_restrictionContext(this._ctx, this.state);
        this.enterRule(_localctx, 18, binding_grammarParser.RULE_scope_restriction);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 115;
                this.match(binding_grammarParser.UNDER);
                this.state = 116;
                this.subprocess_id();
                this.state = 117;
                this.match(binding_grammarParser.COMMA);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    nominator() {
        let _localctx = new NominatorContext(this._ctx, this.state);
        this.enterRule(_localctx, 20, binding_grammarParser.RULE_nominator);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 119;
                this.role();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    nominee() {
        let _localctx = new NomineeContext(this._ctx, this.state);
        this.enterRule(_localctx, 22, binding_grammarParser.RULE_nominee);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 121;
                this.role();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    role() {
        let _localctx = new RoleContext(this._ctx, this.state);
        this.enterRule(_localctx, 24, binding_grammarParser.RULE_role);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 126;
                this._errHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this._input, 11, this._ctx)) {
                    case 1:
                        {
                            this.state = 123;
                            this.role_id();
                        }
                        break;
                    case 2:
                        {
                            this.state = 124;
                            this.role_path_expresion();
                        }
                        break;
                    case 3:
                        {
                            this.state = 125;
                            this.match(binding_grammarParser.SELF);
                        }
                        break;
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    role_path_expresion() {
        let _localctx = new Role_path_expresionContext(this._ctx, this.state);
        this.enterRule(_localctx, 26, binding_grammarParser.RULE_role_path_expresion);
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 131;
                this._errHandler.sync(this);
                _alt = 1;
                do {
                    switch (_alt) {
                        case 1:
                            {
                                {
                                    this.state = 128;
                                    this.subprocess_id();
                                    this.state = 129;
                                    this.match(binding_grammarParser.DOT);
                                }
                            }
                            break;
                        default:
                            throw new NoViableAltException_1.NoViableAltException(this);
                    }
                    this.state = 133;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
                } while (_alt !== 2 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER);
                this.state = 135;
                this.role_id();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    subprocess_id() {
        let _localctx = new Subprocess_idContext(this._ctx, this.state);
        this.enterRule(_localctx, 28, binding_grammarParser.RULE_subprocess_id);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 137;
                this.match(binding_grammarParser.IDENTIFIER);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    role_id() {
        let _localctx = new Role_idContext(this._ctx, this.state);
        this.enterRule(_localctx, 30, binding_grammarParser.RULE_role_id);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 139;
                this.match(binding_grammarParser.IDENTIFIER);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    task_id() {
        let _localctx = new Task_idContext(this._ctx, this.state);
        this.enterRule(_localctx, 32, binding_grammarParser.RULE_task_id);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 141;
                this.match(binding_grammarParser.IDENTIFIER);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    static get _ATN() {
        if (!binding_grammarParser.__ATN) {
            binding_grammarParser.__ATN = new ATNDeserializer_1.ATNDeserializer().deserialize(Utils.toCharArray(binding_grammarParser._serializedATN));
        }
        return binding_grammarParser.__ATN;
    }
}
binding_grammarParser.NOMINATES = 1;
binding_grammarParser.RELEASES = 2;
binding_grammarParser.SELF = 3;
binding_grammarParser.ENDORSED_BY = 4;
binding_grammarParser.CASE_CREATOR = 5;
binding_grammarParser.AND = 6;
binding_grammarParser.OR = 7;
binding_grammarParser.IS = 8;
binding_grammarParser.IN = 9;
binding_grammarParser.NOT = 10;
binding_grammarParser.UNDER = 11;
binding_grammarParser.COMMA = 12;
binding_grammarParser.DOT = 13;
binding_grammarParser.SEMICOLON = 14;
binding_grammarParser.LPAREN = 15;
binding_grammarParser.RPAREN = 16;
binding_grammarParser.LBRACES = 17;
binding_grammarParser.RBRACES = 18;
binding_grammarParser.IDENTIFIER = 19;
binding_grammarParser.WS = 20;
binding_grammarParser.RULE_binding_policy = 0;
binding_grammarParser.RULE_binding_set = 1;
binding_grammarParser.RULE_unbinding_set = 2;
binding_grammarParser.RULE_binding_statement = 3;
binding_grammarParser.RULE_unbinding_statement = 4;
binding_grammarParser.RULE_is_creator = 5;
binding_grammarParser.RULE_binding_constr = 6;
binding_grammarParser.RULE_endorsement_constr = 7;
binding_grammarParser.RULE_set_expresion = 8;
binding_grammarParser.RULE_scope_restriction = 9;
binding_grammarParser.RULE_nominator = 10;
binding_grammarParser.RULE_nominee = 11;
binding_grammarParser.RULE_role = 12;
binding_grammarParser.RULE_role_path_expresion = 13;
binding_grammarParser.RULE_subprocess_id = 14;
binding_grammarParser.RULE_role_id = 15;
binding_grammarParser.RULE_task_id = 16;
binding_grammarParser.ruleNames = [
    "binding_policy", "binding_set", "unbinding_set", "binding_statement",
    "unbinding_statement", "is_creator", "binding_constr", "endorsement_constr",
    "set_expresion", "scope_restriction", "nominator", "nominee", "role",
    "role_path_expresion", "subprocess_id", "role_id", "task_id"
];
binding_grammarParser._LITERAL_NAMES = [
    undefined, "'nominates'", "'releases'", "'self'", undefined, "'case-creator'",
    "'and'", "'or'", "'is'", "'in'", "'not'", "'Under'", "','", "'.'", "';'",
    "'('", "')'", "'{'", "'}'"
];
binding_grammarParser._SYMBOLIC_NAMES = [
    undefined, "NOMINATES", "RELEASES", "SELF", "ENDORSED_BY", "CASE_CREATOR",
    "AND", "OR", "IS", "IN", "NOT", "UNDER", "COMMA", "DOT", "SEMICOLON",
    "LPAREN", "RPAREN", "LBRACES", "RBRACES", "IDENTIFIER", "WS"
];
binding_grammarParser.VOCABULARY = new VocabularyImpl_1.VocabularyImpl(binding_grammarParser._LITERAL_NAMES, binding_grammarParser._SYMBOLIC_NAMES, []);
binding_grammarParser._serializedATN = "\x03\uAF6F\u8320\u479D\uB75C\u4880\u1605\u191C\uAB37\x03\x16\x92\x04\x02" +
    "\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
    "\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
    "\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x03" +
    "\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x07\x03,\n\x03\f" +
    "\x03\x0E\x03/\v\x03\x03\x03\x03\x03\x03\x04\x03\x04\x03\x04\x03\x04\x07" +
    "\x047\n\x04\f\x04\x0E\x04:\v\x04\x03\x04\x05\x04=\n\x04\x03\x04\x03\x04" +
    "\x03\x05\x03\x05\x05\x05C\n\x05\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05" +
    "I\n\x05\x03\x05\x05\x05L\n\x05\x05\x05N\n\x05\x03\x06\x03\x06\x03\x06" +
    "\x03\x06\x05\x06T\n\x06\x03\x06\x05\x06W\n\x06\x03\x07\x03\x07\x03\x07" +
    "\x03\x07\x03\b\x03\b\x03\b\x03\b\x03\b\x05\bb\n\b\x03\t\x03\t\x03\t\x03" +
    "\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03" +
    "\n\x05\nt\n\n\x03\v\x03\v\x03\v\x03\v\x03\f\x03\f\x03\r\x03\r\x03\x0E" +
    "\x03\x0E\x03\x0E\x05\x0E\x81\n\x0E\x03\x0F\x03\x0F\x03\x0F\x06\x0F\x86" +
    "\n\x0F\r\x0F\x0E\x0F\x87\x03\x0F\x03\x0F\x03\x10\x03\x10\x03\x11\x03\x11" +
    "\x03\x12\x03\x12\x03\x12\x02\x02\x02\x13\x02\x02\x04\x02\x06\x02\b\x02" +
    "\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C" +
    "\x02\x1E\x02 \x02\"\x02\x02\x02\x90\x02$\x03\x02\x02\x02\x04\'\x03\x02" +
    "\x02\x02\x062\x03\x02\x02\x02\bM\x03\x02\x02\x02\nO\x03\x02\x02\x02\f" +
    "X\x03\x02\x02\x02\x0Ea\x03\x02\x02\x02\x10c\x03\x02\x02\x02\x12s\x03\x02" +
    "\x02\x02\x14u\x03\x02\x02\x02\x16y\x03\x02\x02\x02\x18{\x03\x02\x02\x02" +
    "\x1A\x80\x03\x02\x02\x02\x1C\x85\x03\x02\x02\x02\x1E\x8B\x03\x02\x02\x02" +
    " \x8D\x03\x02\x02\x02\"\x8F\x03\x02\x02\x02$%\x05\x04\x03\x02%&\x05\x06" +
    "\x04\x02&\x03\x03\x02\x02\x02\'(\x07\x13\x02\x02(-\x05\b\x05\x02)*\x07" +
    "\x10\x02\x02*,\x05\b\x05\x02+)\x03\x02\x02\x02,/\x03\x02\x02\x02-+\x03" +
    "\x02\x02\x02-.\x03\x02\x02\x02.0\x03\x02\x02\x02/-\x03\x02\x02\x0201\x07" +
    "\x14\x02\x021\x05\x03\x02\x02\x022<\x07\x13\x02\x0238\x05\n\x06\x0245" +
    "\x07\x10\x02\x0257\x05\n\x06\x0264\x03\x02\x02\x027:\x03\x02\x02\x028" +
    "6\x03\x02\x02\x0289\x03\x02\x02\x029=\x03\x02\x02\x02:8\x03\x02\x02\x02" +
    ";=\x03\x02\x02\x02<3\x03\x02\x02\x02<;\x03\x02\x02\x02=>\x03\x02\x02\x02" +
    ">?\x07\x14\x02\x02?\x07\x03\x02\x02\x02@N\x05\f\x07\x02AC\x05\x14\v\x02" +
    "BA\x03\x02\x02\x02BC\x03\x02\x02\x02CD\x03\x02\x02\x02DE\x05\x16\f\x02" +
    "EF\x07\x03\x02\x02FH\x05\x18\r\x02GI\x05\x0E\b\x02HG\x03\x02\x02\x02H" +
    "I\x03\x02\x02\x02IK\x03\x02\x02\x02JL\x05\x10\t\x02KJ\x03\x02\x02\x02" +
    "KL\x03\x02\x02\x02LN\x03\x02\x02\x02M@\x03\x02\x02\x02MB\x03\x02\x02\x02" +
    "N\t\x03\x02\x02\x02OP\x05\x16\f\x02PQ\x07\x04\x02\x02QS\x05\x18\r\x02" +
    "RT\x05\x0E\b\x02SR\x03\x02\x02\x02ST\x03\x02\x02\x02TV\x03\x02\x02\x02" +
    "UW\x05\x10\t\x02VU\x03\x02\x02\x02VW\x03\x02\x02\x02W\v\x03\x02\x02\x02" +
    "XY\x05\x1A\x0E\x02YZ\x07\n\x02\x02Z[\x07\x07\x02\x02[\r\x03\x02\x02\x02" +
    "\\]\x07\f\x02\x02]^\x07\v\x02\x02^b\x05\x12\n\x02_`\x07\v\x02\x02`b\x05" +
    "\x12\n\x02a\\\x03\x02\x02\x02a_\x03\x02\x02\x02b\x0F\x03\x02\x02\x02c" +
    "d\x07\x06\x02\x02de\x05\x12\n\x02e\x11\x03\x02\x02\x02fg\x07\x11\x02\x02" +
    "gh\x05\x12\n\x02hi\x07\x12\x02\x02it\x03\x02\x02\x02jk\x05\x1A\x0E\x02" +
    "kl\x07\t\x02\x02lm\x05\x12\n\x02mt\x03\x02\x02\x02no\x05\x1A\x0E\x02o" +
    "p\x07\b\x02\x02pq\x05\x12\n\x02qt\x03\x02\x02\x02rt\x05\x1A\x0E\x02sf" +
    "\x03\x02\x02\x02sj\x03\x02\x02\x02sn\x03\x02\x02\x02sr\x03\x02\x02\x02" +
    "t\x13\x03\x02\x02\x02uv\x07\r\x02\x02vw\x05\x1E\x10\x02wx\x07\x0E\x02" +
    "\x02x\x15\x03\x02\x02\x02yz\x05\x1A\x0E\x02z\x17\x03\x02\x02\x02{|\x05" +
    "\x1A\x0E\x02|\x19\x03\x02\x02\x02}\x81\x05 \x11\x02~\x81\x05\x1C\x0F\x02" +
    "\x7F\x81\x07\x05\x02\x02\x80}\x03\x02\x02\x02\x80~\x03\x02\x02\x02\x80" +
    "\x7F\x03\x02\x02\x02\x81\x1B\x03\x02\x02\x02\x82\x83\x05\x1E\x10\x02\x83" +
    "\x84\x07\x0F\x02\x02\x84\x86\x03\x02\x02\x02\x85\x82\x03\x02\x02\x02\x86" +
    "\x87\x03\x02\x02\x02\x87\x85\x03\x02\x02\x02\x87\x88\x03\x02\x02\x02\x88" +
    "\x89\x03\x02\x02\x02\x89\x8A\x05 \x11\x02\x8A\x1D\x03\x02\x02\x02\x8B" +
    "\x8C\x07\x15\x02\x02\x8C\x1F\x03\x02\x02\x02\x8D\x8E\x07\x15\x02\x02\x8E" +
    "!\x03\x02\x02\x02\x8F\x90\x07\x15\x02\x02\x90#\x03\x02\x02\x02\x0F-8<" +
    "BHKMSVas\x80\x87";
__decorate([
    Decorators_2.Override,
    Decorators_1.NotNull
], binding_grammarParser.prototype, "vocabulary", null);
__decorate([
    Decorators_2.Override
], binding_grammarParser.prototype, "grammarFileName", null);
__decorate([
    Decorators_2.Override
], binding_grammarParser.prototype, "ruleNames", null);
__decorate([
    Decorators_2.Override
], binding_grammarParser.prototype, "serializedATN", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "binding_policy", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "binding_set", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "unbinding_set", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "binding_statement", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "unbinding_statement", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "is_creator", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "binding_constr", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "endorsement_constr", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "set_expresion", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "scope_restriction", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "nominator", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "nominee", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "role", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "role_path_expresion", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "subprocess_id", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "role_id", null);
__decorate([
    RuleVersion_1.RuleVersion(0)
], binding_grammarParser.prototype, "task_id", null);
exports.binding_grammarParser = binding_grammarParser;
class Binding_policyContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    binding_set() {
        return this.getRuleContext(0, Binding_setContext);
    }
    unbinding_set() {
        return this.getRuleContext(0, Unbinding_setContext);
    }
    get ruleIndex() { return binding_grammarParser.RULE_binding_policy; }
    enterRule(listener) {
        if (listener.enterBinding_policy)
            listener.enterBinding_policy(this);
    }
    exitRule(listener) {
        if (listener.exitBinding_policy)
            listener.exitBinding_policy(this);
    }
    accept(visitor) {
        if (visitor.visitBinding_policy)
            return visitor.visitBinding_policy(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Binding_policyContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Binding_policyContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Binding_policyContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Binding_policyContext.prototype, "accept", null);
exports.Binding_policyContext = Binding_policyContext;
class Binding_setContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    LBRACES() { return this.getToken(binding_grammarParser.LBRACES, 0); }
    binding_statement(i) {
        if (i === undefined) {
            return this.getRuleContexts(Binding_statementContext);
        }
        else {
            return this.getRuleContext(i, Binding_statementContext);
        }
    }
    RBRACES() { return this.getToken(binding_grammarParser.RBRACES, 0); }
    SEMICOLON(i) {
        if (i === undefined) {
            return this.getTokens(binding_grammarParser.SEMICOLON);
        }
        else {
            return this.getToken(binding_grammarParser.SEMICOLON, i);
        }
    }
    get ruleIndex() { return binding_grammarParser.RULE_binding_set; }
    enterRule(listener) {
        if (listener.enterBinding_set)
            listener.enterBinding_set(this);
    }
    exitRule(listener) {
        if (listener.exitBinding_set)
            listener.exitBinding_set(this);
    }
    accept(visitor) {
        if (visitor.visitBinding_set)
            return visitor.visitBinding_set(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Binding_setContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Binding_setContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Binding_setContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Binding_setContext.prototype, "accept", null);
exports.Binding_setContext = Binding_setContext;
class Unbinding_setContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    LBRACES() { return this.getToken(binding_grammarParser.LBRACES, 0); }
    RBRACES() { return this.getToken(binding_grammarParser.RBRACES, 0); }
    unbinding_statement(i) {
        if (i === undefined) {
            return this.getRuleContexts(Unbinding_statementContext);
        }
        else {
            return this.getRuleContext(i, Unbinding_statementContext);
        }
    }
    SEMICOLON(i) {
        if (i === undefined) {
            return this.getTokens(binding_grammarParser.SEMICOLON);
        }
        else {
            return this.getToken(binding_grammarParser.SEMICOLON, i);
        }
    }
    get ruleIndex() { return binding_grammarParser.RULE_unbinding_set; }
    enterRule(listener) {
        if (listener.enterUnbinding_set)
            listener.enterUnbinding_set(this);
    }
    exitRule(listener) {
        if (listener.exitUnbinding_set)
            listener.exitUnbinding_set(this);
    }
    accept(visitor) {
        if (visitor.visitUnbinding_set)
            return visitor.visitUnbinding_set(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Unbinding_setContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Unbinding_setContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Unbinding_setContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Unbinding_setContext.prototype, "accept", null);
exports.Unbinding_setContext = Unbinding_setContext;
class Binding_statementContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    is_creator() {
        return this.tryGetRuleContext(0, Is_creatorContext);
    }
    nominator() {
        return this.tryGetRuleContext(0, NominatorContext);
    }
    NOMINATES() { return this.tryGetToken(binding_grammarParser.NOMINATES, 0); }
    nominee() {
        return this.tryGetRuleContext(0, NomineeContext);
    }
    scope_restriction() {
        return this.tryGetRuleContext(0, Scope_restrictionContext);
    }
    binding_constr() {
        return this.tryGetRuleContext(0, Binding_constrContext);
    }
    endorsement_constr() {
        return this.tryGetRuleContext(0, Endorsement_constrContext);
    }
    get ruleIndex() { return binding_grammarParser.RULE_binding_statement; }
    enterRule(listener) {
        if (listener.enterBinding_statement)
            listener.enterBinding_statement(this);
    }
    exitRule(listener) {
        if (listener.exitBinding_statement)
            listener.exitBinding_statement(this);
    }
    accept(visitor) {
        if (visitor.visitBinding_statement)
            return visitor.visitBinding_statement(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Binding_statementContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Binding_statementContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Binding_statementContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Binding_statementContext.prototype, "accept", null);
exports.Binding_statementContext = Binding_statementContext;
class Unbinding_statementContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    nominator() {
        return this.getRuleContext(0, NominatorContext);
    }
    RELEASES() { return this.getToken(binding_grammarParser.RELEASES, 0); }
    nominee() {
        return this.getRuleContext(0, NomineeContext);
    }
    binding_constr() {
        return this.tryGetRuleContext(0, Binding_constrContext);
    }
    endorsement_constr() {
        return this.tryGetRuleContext(0, Endorsement_constrContext);
    }
    get ruleIndex() { return binding_grammarParser.RULE_unbinding_statement; }
    enterRule(listener) {
        if (listener.enterUnbinding_statement)
            listener.enterUnbinding_statement(this);
    }
    exitRule(listener) {
        if (listener.exitUnbinding_statement)
            listener.exitUnbinding_statement(this);
    }
    accept(visitor) {
        if (visitor.visitUnbinding_statement)
            return visitor.visitUnbinding_statement(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Unbinding_statementContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Unbinding_statementContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Unbinding_statementContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Unbinding_statementContext.prototype, "accept", null);
exports.Unbinding_statementContext = Unbinding_statementContext;
class Is_creatorContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    role() {
        return this.getRuleContext(0, RoleContext);
    }
    IS() { return this.getToken(binding_grammarParser.IS, 0); }
    CASE_CREATOR() { return this.getToken(binding_grammarParser.CASE_CREATOR, 0); }
    get ruleIndex() { return binding_grammarParser.RULE_is_creator; }
    enterRule(listener) {
        if (listener.enterIs_creator)
            listener.enterIs_creator(this);
    }
    exitRule(listener) {
        if (listener.exitIs_creator)
            listener.exitIs_creator(this);
    }
    accept(visitor) {
        if (visitor.visitIs_creator)
            return visitor.visitIs_creator(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Is_creatorContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Is_creatorContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Is_creatorContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Is_creatorContext.prototype, "accept", null);
exports.Is_creatorContext = Is_creatorContext;
class Binding_constrContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    NOT() { return this.tryGetToken(binding_grammarParser.NOT, 0); }
    IN() { return this.getToken(binding_grammarParser.IN, 0); }
    set_expresion() {
        return this.getRuleContext(0, Set_expresionContext);
    }
    get ruleIndex() { return binding_grammarParser.RULE_binding_constr; }
    enterRule(listener) {
        if (listener.enterBinding_constr)
            listener.enterBinding_constr(this);
    }
    exitRule(listener) {
        if (listener.exitBinding_constr)
            listener.exitBinding_constr(this);
    }
    accept(visitor) {
        if (visitor.visitBinding_constr)
            return visitor.visitBinding_constr(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Binding_constrContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Binding_constrContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Binding_constrContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Binding_constrContext.prototype, "accept", null);
exports.Binding_constrContext = Binding_constrContext;
class Endorsement_constrContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    ENDORSED_BY() { return this.getToken(binding_grammarParser.ENDORSED_BY, 0); }
    set_expresion() {
        return this.getRuleContext(0, Set_expresionContext);
    }
    get ruleIndex() { return binding_grammarParser.RULE_endorsement_constr; }
    enterRule(listener) {
        if (listener.enterEndorsement_constr)
            listener.enterEndorsement_constr(this);
    }
    exitRule(listener) {
        if (listener.exitEndorsement_constr)
            listener.exitEndorsement_constr(this);
    }
    accept(visitor) {
        if (visitor.visitEndorsement_constr)
            return visitor.visitEndorsement_constr(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Endorsement_constrContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Endorsement_constrContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Endorsement_constrContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Endorsement_constrContext.prototype, "accept", null);
exports.Endorsement_constrContext = Endorsement_constrContext;
class Set_expresionContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    LPAREN() { return this.tryGetToken(binding_grammarParser.LPAREN, 0); }
    set_expresion() {
        return this.tryGetRuleContext(0, Set_expresionContext);
    }
    RPAREN() { return this.tryGetToken(binding_grammarParser.RPAREN, 0); }
    role() {
        return this.tryGetRuleContext(0, RoleContext);
    }
    OR() { return this.tryGetToken(binding_grammarParser.OR, 0); }
    AND() { return this.tryGetToken(binding_grammarParser.AND, 0); }
    get ruleIndex() { return binding_grammarParser.RULE_set_expresion; }
    enterRule(listener) {
        if (listener.enterSet_expresion)
            listener.enterSet_expresion(this);
    }
    exitRule(listener) {
        if (listener.exitSet_expresion)
            listener.exitSet_expresion(this);
    }
    accept(visitor) {
        if (visitor.visitSet_expresion)
            return visitor.visitSet_expresion(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Set_expresionContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Set_expresionContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Set_expresionContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Set_expresionContext.prototype, "accept", null);
exports.Set_expresionContext = Set_expresionContext;
class Scope_restrictionContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    UNDER() { return this.getToken(binding_grammarParser.UNDER, 0); }
    subprocess_id() {
        return this.getRuleContext(0, Subprocess_idContext);
    }
    COMMA() { return this.getToken(binding_grammarParser.COMMA, 0); }
    get ruleIndex() { return binding_grammarParser.RULE_scope_restriction; }
    enterRule(listener) {
        if (listener.enterScope_restriction)
            listener.enterScope_restriction(this);
    }
    exitRule(listener) {
        if (listener.exitScope_restriction)
            listener.exitScope_restriction(this);
    }
    accept(visitor) {
        if (visitor.visitScope_restriction)
            return visitor.visitScope_restriction(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Scope_restrictionContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Scope_restrictionContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Scope_restrictionContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Scope_restrictionContext.prototype, "accept", null);
exports.Scope_restrictionContext = Scope_restrictionContext;
class NominatorContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    role() {
        return this.getRuleContext(0, RoleContext);
    }
    get ruleIndex() { return binding_grammarParser.RULE_nominator; }
    enterRule(listener) {
        if (listener.enterNominator)
            listener.enterNominator(this);
    }
    exitRule(listener) {
        if (listener.exitNominator)
            listener.exitNominator(this);
    }
    accept(visitor) {
        if (visitor.visitNominator)
            return visitor.visitNominator(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], NominatorContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], NominatorContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], NominatorContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], NominatorContext.prototype, "accept", null);
exports.NominatorContext = NominatorContext;
class NomineeContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    role() {
        return this.getRuleContext(0, RoleContext);
    }
    get ruleIndex() { return binding_grammarParser.RULE_nominee; }
    enterRule(listener) {
        if (listener.enterNominee)
            listener.enterNominee(this);
    }
    exitRule(listener) {
        if (listener.exitNominee)
            listener.exitNominee(this);
    }
    accept(visitor) {
        if (visitor.visitNominee)
            return visitor.visitNominee(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], NomineeContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], NomineeContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], NomineeContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], NomineeContext.prototype, "accept", null);
exports.NomineeContext = NomineeContext;
class RoleContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    role_id() {
        return this.tryGetRuleContext(0, Role_idContext);
    }
    role_path_expresion() {
        return this.tryGetRuleContext(0, Role_path_expresionContext);
    }
    SELF() { return this.tryGetToken(binding_grammarParser.SELF, 0); }
    get ruleIndex() { return binding_grammarParser.RULE_role; }
    enterRule(listener) {
        if (listener.enterRole)
            listener.enterRole(this);
    }
    exitRule(listener) {
        if (listener.exitRole)
            listener.exitRole(this);
    }
    accept(visitor) {
        if (visitor.visitRole)
            return visitor.visitRole(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], RoleContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], RoleContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], RoleContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], RoleContext.prototype, "accept", null);
exports.RoleContext = RoleContext;
class Role_path_expresionContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    role_id() {
        return this.getRuleContext(0, Role_idContext);
    }
    subprocess_id(i) {
        if (i === undefined) {
            return this.getRuleContexts(Subprocess_idContext);
        }
        else {
            return this.getRuleContext(i, Subprocess_idContext);
        }
    }
    DOT(i) {
        if (i === undefined) {
            return this.getTokens(binding_grammarParser.DOT);
        }
        else {
            return this.getToken(binding_grammarParser.DOT, i);
        }
    }
    get ruleIndex() { return binding_grammarParser.RULE_role_path_expresion; }
    enterRule(listener) {
        if (listener.enterRole_path_expresion)
            listener.enterRole_path_expresion(this);
    }
    exitRule(listener) {
        if (listener.exitRole_path_expresion)
            listener.exitRole_path_expresion(this);
    }
    accept(visitor) {
        if (visitor.visitRole_path_expresion)
            return visitor.visitRole_path_expresion(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Role_path_expresionContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Role_path_expresionContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Role_path_expresionContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Role_path_expresionContext.prototype, "accept", null);
exports.Role_path_expresionContext = Role_path_expresionContext;
class Subprocess_idContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    IDENTIFIER() { return this.getToken(binding_grammarParser.IDENTIFIER, 0); }
    get ruleIndex() { return binding_grammarParser.RULE_subprocess_id; }
    enterRule(listener) {
        if (listener.enterSubprocess_id)
            listener.enterSubprocess_id(this);
    }
    exitRule(listener) {
        if (listener.exitSubprocess_id)
            listener.exitSubprocess_id(this);
    }
    accept(visitor) {
        if (visitor.visitSubprocess_id)
            return visitor.visitSubprocess_id(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Subprocess_idContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Subprocess_idContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Subprocess_idContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Subprocess_idContext.prototype, "accept", null);
exports.Subprocess_idContext = Subprocess_idContext;
class Role_idContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    IDENTIFIER() { return this.getToken(binding_grammarParser.IDENTIFIER, 0); }
    get ruleIndex() { return binding_grammarParser.RULE_role_id; }
    enterRule(listener) {
        if (listener.enterRole_id)
            listener.enterRole_id(this);
    }
    exitRule(listener) {
        if (listener.exitRole_id)
            listener.exitRole_id(this);
    }
    accept(visitor) {
        if (visitor.visitRole_id)
            return visitor.visitRole_id(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Role_idContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Role_idContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Role_idContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Role_idContext.prototype, "accept", null);
exports.Role_idContext = Role_idContext;
class Task_idContext extends ParserRuleContext_1.ParserRuleContext {
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    IDENTIFIER() { return this.getToken(binding_grammarParser.IDENTIFIER, 0); }
    get ruleIndex() { return binding_grammarParser.RULE_task_id; }
    enterRule(listener) {
        if (listener.enterTask_id)
            listener.enterTask_id(this);
    }
    exitRule(listener) {
        if (listener.exitTask_id)
            listener.exitTask_id(this);
    }
    accept(visitor) {
        if (visitor.visitTask_id)
            return visitor.visitTask_id(this);
        else
            return visitor.visitChildren(this);
    }
}
__decorate([
    Decorators_2.Override
], Task_idContext.prototype, "ruleIndex", null);
__decorate([
    Decorators_2.Override
], Task_idContext.prototype, "enterRule", null);
__decorate([
    Decorators_2.Override
], Task_idContext.prototype, "exitRule", null);
__decorate([
    Decorators_2.Override
], Task_idContext.prototype, "accept", null);
exports.Task_idContext = Task_idContext;
//# sourceMappingURL=binding_grammarParser.js.map