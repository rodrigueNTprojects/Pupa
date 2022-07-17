"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const solc = require("solc");
const Web3 = require("web3");
const models_parsers_1 = require("./models.parsers");
const procModelData_1 = require("../repo/procModelData");
const procModelData_2 = require("../repo/procModelData");
const procModelData_3 = require("../repo/procModelData");
const procModelData_4 = require("../repo/procModelData");
const procModelData_5 = require("../repo/procModelData");
const BindingPolicyGenerator_1 = require("./dynamic_binding/validation_code_gen/BindingPolicyGenerator");
const ProcessRoleGenerator_1 = require("./dynamic_binding/validation_code_gen/ProcessRoleGenerator");
// import * as mongoose from 'mongoose';
// let app = require('express')();
// let http = require('http').Server(app);
// let io = require('socket.io')(http);
// let ObjectId = mongoose.Types.ObjectId;
/* http.listen(8090, () => {
    // console.log('started on port 8090');
}); */
const fs = require("fs");
////// ANTLR Runtime Requirements //////////////////////////
////////////////////////////////////////////////////////////
const models = express_1.Router();
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
// var web3 = new Web3(new Web3.providers.HttpProvider("http://193.40.11.64:80"));
const WebSocket = require('ws');
let mws;
var accessControlPolicyContract = '';
let taskLeadbyTimer = [];
var timerCheckFunctionName = 'check_timer_duration';
var handlingTimerEvent = "worklist_timer_handling";
var idTxRootProcessMap = new Map();
let LeadTimerNodeCompleted = new Map();
const wss = new WebSocket.Server({ port: 8090 });
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        // console.log('received: %s', message);
    });
    ws.on('error', () => { });
    mws = ws;
});
let executionAccount = 0;
web3.eth.filter("latest", function (error, result) {
    if (!error) {
        try {
            let info = web3.eth.getBlock(result);
            if (info.transactions.length > 0) {
                //  // console.log('----------------------------------------------------------------------------------------------');
                //  // console.log('NEW BLOCK MINED');
                let toNotify = [];
                info.transactions.forEach(transactionHash => {
                    // // console.log("TRANSACTION ", transRec);
                    //// console.log(web3.eth.estimateGas({from: web3.eth.accounts[0], to: transactionHash, amount: web3.toWei(1, "ether")}))
                    let transRec = web3.eth.getTransactionReceipt(transactionHash);
                    let tranInfo = { 'hash': transactionHash,
                        'blockNumber': transRec.blockNumber,
                        'gas': transRec.gasUsed,
                        'cumulGas': transRec.cumulativeGasUsed };
                    toNotify.push(tranInfo);
                    //  if(toPrint.length > 0 && toPrint === transactionHash) {
                    //      // console.log('Gas :' + tI + " " + transRec.gasUsed);
                    //      toPrint = '';
                    //      tI = 0;
                    //  }
                    if (!bindingOpTransactions.has(tranInfo.hash)) {
                        transRec.logs.forEach(logElem => {
                            if (workListInstances.has(logElem.address) && toNotify.indexOf(logElem.address) < 0) {
                                //// console.log("LOG ELEMENT ", logElem);
                                // console.log('WorkList', workListInstances);
                                toNotify.push(workListInstances.get(logElem.address));
                            }
                        });
                    }
                    //// console.log('----------------------------------------------------------------------------------------------');
                });
                if (toNotify.length > 0) {
                    //// console.log("Message sent through socket running on port 8090");
                    toNotify.forEach(add => {
                        if (mws)
                            mws.send(JSON.stringify(add), function ack(error) {
                            });
                    });
                    //io.emit('message', { type: 'new-message', text: "Updates in Server" });
                }
                else {
                    //// console.log("Nothing to notify");
                }
            }
        }
        catch (ex) { }
    }
});
let workListInstances = new Map();
let bindingOpTransactions = new Map();
let processRegistryContract = undefined;
let modelRegistryContract = undefined;
// Querying for every contract all the created instances
models.get('/processes', (req, res) => {
    console.log('QUERYING ALL ACTIVE CONTRACTS');
    let actives = [];
    if (processRegistryContract) {
        let registeredInstances = processRegistryContract.allInstances.call();
        registeredInstances.forEach(instance => {
            let repoID = web3.toAscii(processRegistryContract.bundleFor.call(instance)).toString().substr(0, 24);
            procModelData_1.repoSchema.find({ _id: repoID }, (err, repoData) => {
                if (err) {
                    res.status(404).send([]);
                    return;
                }
                else {
                    if (repoData.length > 0) {
                        console.log({ id: repoID, name: repoData[0].rootProcessName, address: instance });
                        actives.push({ id: repoID, name: repoData[0].rootProcessName, address: instance });
                        if (actives.length === registeredInstances.length) {
                            res.status(200).send(actives);
                            return;
                        }
                    }
                }
            });
        });
    }
    else {
        res.status(404).send([]);
    }
});
// Querying all registered (root) process in the repository
models.get('/models', (req, res) => {
    console.log('QUERYING REGISTERED MODELS');
    let actives = [];
    if (processRegistryContract) {
        procModelData_1.repoSchema.find({ 'bpmnModel': { $ne: 'empty' } }, (err, repoData) => {
            if (err)
                res.send([]);
            else {
                
                
                repoData.forEach(data => {
                   
                    if (web3.toAscii(processRegistryContract.childrenFor.call(data._id.toString(), 0)).toString().substr(0, 24) === data._id.toString()) {
                        console.log({ id: data._id, name: data.rootProcessName });
                        actives.push({
                            id: data._id,
                            name: data.rootProcessName,
                            bpmn: data.bpmnModel,
                            solidity: data.solidityCode
                        });
                    }
                });
                console.log('----------------------------------------------------------------------------------------------');
                res.send(actives);
            }
        });
    }
    else {
        res.send([]);
        console.log('----------------------------------------------------------------------------------------------');
    }
});
//////////////////////////////////////////////////////////////////////
///    CONFIGURATION (ProcessRegistry) REGISTRATION operations     ///
//////////////////////////////////////////////////////////////////////
models.post('/registry', (req, res) => {
    console.log('DEPLOYING PROCESS RUNTIME REGISTRY ...');
    try {
        let input = {
            'AbstractFactory': fs.readFileSync('./src/models/abstract/AbstractFactory.sol', 'utf8'),
            'ProcessRegistry': fs.readFileSync('./src/models/abstract/ProcessRegistry.sol', 'utf8')
        };
        console.log('=============================================');
        console.log("SOLIDITY CODE");
        console.log('=============================================');
        console.log(input['ProcessRegistry']);
        console.log('....................................................................');


        let CompilerInput = {
            language: 'Solidity',
            sources: {
              'AbstractFactory.sol': {
                content: input['AbstractFactory']
                },
              'ProcessRegistry.sol': {
                content: input['ProcessRegistry']
              }
            },
            settings: {
                optimizer: {
                    // disabled by default
                    enabled: true,
                },    
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
          };


        let output = JSON.parse(solc.compile(JSON.stringify(CompilerInput)));        
        if (output.contracts['ProcessRegistry.sol']['ProcessRegistry'].length === 0 ) {
            res.status(400).send('COMPILATION ERROR IN RUNTIME REGISTRY SMART CONTRACTS');
            console.log('COMPILATION ERROR IN SMART CONTRACTS');
            console.log(output.errors);
            console.log('----------------------------------------------------------------------------------------------');
            return;
        }
        console.log('PROCESS RUNTIME REGISTRY COMPILED SUCCESSFULLY');
        console.log('CREATING RUNTIME REGISTRY INSTANCE ... ');        
        let ProcContract = web3.eth.contract(output.contracts['ProcessRegistry.sol']['ProcessRegistry'].abi);
        ProcContract.new({
            from: web3.eth.accounts[executionAccount],
            data: "0x" + output.contracts['ProcessRegistry.sol']['ProcessRegistry'].evm.bytecode.object,
            gas: 4700000
        }, (err, contract) => {
            if (err) {
                console.log(`ERROR: ProcessRegistry instance creation failed`);
                console.log('RESULT ', err);
                res.status(403).send(err);
            }
            else if (contract.address) {
                procModelData_2.registrySchema.create({
                    address: contract.address,
                    solidityCode: input['ProcessRegistry'],
                    abi: JSON.stringify(output.contracts['ProcessRegistry.sol']['ProcessRegistry'].abi),
                    bytecode: output.contracts['ProcessRegistry.sol']['ProcessRegistry'].evm.bytecode.object,
                }, (err, repoData) => {
                    if (err) {
                        console.log('Error ', err);
                        console.log('----------------------------------------------------------------------------------------------');
                        // registerModels(currentIndex, sortedElements, createdElementMap, modelInfo, contracts, res);
                    }
                    else {
                        processRegistryContract = contract;
                        let registryGas = web3.eth.getTransactionReceipt(contract.transactionHash).gasUsed;
                        let idAsString = repoData._id.toString();
                        //console.log(repoData.address.toString());
                        console.log("Process Registry DEPLOYED and RUNNING at " + processRegistryContract.address.toString());
                        console.log('GAS USED: ', registryGas);
                        console.log('REPO ID: ', idAsString);
                        res.status(200).send({ 'address': processRegistryContract.address.toString(), gas: registryGas, repoId: idAsString });
                        console.log('----------------------------------------------------------------------------------------------');
                        //let version = web3.version.api;
                        //console.log(version);
                    }
                });
            }
        });
    }
    catch (e) {
        console.log("Error: ", e);
        console.log('----------------------------------------------------------------------------------------------');
        res.status(400).send(e);
    }
});
models.post('/registry/load', (req, res) => {
    console.log('LOADING PROCESS RUNTIME REGISTRY ...');
    if (web3.isAddress(req.body.from)) {
        procModelData_2.registrySchema.find({ address: req.body.from }, (err, repoData) => {
            if (!err && repoData && repoData.length > 0) {                
                processRegistryContract = web3.eth.contract(repoData[0].abi , req.body.from);                
                console.log('Registry Loaded Successfully');                
                res.status(200).send('Registry Loaded Successfully');
                console.log('----------------------------------------------------------------------------------------------');
            }
            else {
                console.log("Error: Registry NOT Found");
                console.log('----------------------------------------------------------------------------------------------');
                res.status(400).send('Registry NOT Found');
                return;
            }
        });
    }
    else {
        procModelData_2.registrySchema.find({ _id: req.body.from }, (err, repoData) => {
            if (!err && repoData && repoData.length > 0) {
                //processRegistryContract = web3.eth.contract(repoData[0].abi).at(repoData[0].address);
                processRegistryContract = web3.eth.contract(repoData[0].abi , repoData[0].address);
                console.log('Registry Loaded Successfully');
                res.status(200).send('Registry Loaded Successfully');
                console.log('----------------------------------------------------------------------------------------------');
            }
            else {
                console.log("Error: Registry NOT Found");
                console.log('----------------------------------------------------------------------------------------------');
                res.status(400).send('Registry NOT Found');
                return;
            }
        });
    }
});
models.post('/transaction/load', (req, res) => {
    console.log('LOADING TRANSACTION INFORMATION RUNTIME REGISTRY ...');
    if (web3.isAddress(req.body.from)) {
        /* PENDING !!! */
    }
    else {
        procModelData_5.repoTxSchema.find({_id: req.body.from }, (err, repoTxData) => {
            if (!err && repoTxData && repoTxData.length > 0) {
                //processRegistryContract = web3.eth.contract(repoData[0].abi).at(repoData[0].address);
                let txID = req.body.from;
                let parentProcessTx = repoTxData[0].rootProcessID;
                let txName = repoTxData[0].transactionName;
                let txBlockNumber = repoTxData[0].blockNumber;
                let txTimeExecution = repoTxData[0].timeExecution;
                procModelData_1.repoSchema.find({ _id: parentProcessTx }, (err, repoData) => {
                    if (!err && repoData && repoData.length > 0) {
                        let parentProcessName = repoData[0].rootProcessName;
                        console.log('------------------------- WELL DONE! TRANSACTION FOUND ------------------------------');                        
                        //console.log(`The transaction name is ${txName} , created inside the process ${parentProcessName}, updated in repository on ${txBlockNumber}, at ${txTimeExecution}`);
                        console.log("Transaction ID: ", txID);
                        console.log("Transaction hash: ", repoTxData[0].transactionHash);
                        console.log("Transaction name: ", txName);
                        console.log("Process parent: ", parentProcessName);
                        console.log("Mined on Block number: ", txBlockNumber);
                        console.log("Date of block mining: ", txTimeExecution);                        
                        console.log("...............................................................");
                        res.status(200).send('Transaction Loaded Successfully');
                        console.log('----------------------------------------------------------------------------------------------');
                }
                else {
                    console.log("Error: Parent process NOT Found");
                    console.log('----------------------------------------------------------------------------------------------');
                    res.status(400).send('Parent process NOT Found');
                    return;

                }});
            }
            else {
                console.log("Error: Transaction NOT Found");
                console.log('----------------------------------------------------------------------------------------------');
                res.status(400).send('Transaction NOT Found');
                return;
            }
        });
    }
});

models.post('/processsteps/load', async (req, res) => {
    console.log('LOADING PROCESS STEPS INFORMATION FROM RUNTIME REGISTRY ...');
    if (web3.isAddress(req.body.from)) {
        /* procModelData_2.registrySchema.find({ address: req.body.from }, (err, repoData) => {
            if (!err && repoData && repoData.length > 0) {
                //processRegistryContract = web3.eth.contract(JSON.parse(repoData[0].abi)).at(req.body.from);
                processRegistryContract = web3.eth.contract(repoData[0].abi , req.body.from);
                console.log('Registry Loaded Successfully');
                res.status(200).send('Registry Loaded Successfully');
                console.log('----------------------------------------------------------------------------------------------');
            }
            else {
                console.log("Error: Registry NOT Found");
                console.log('----------------------------------------------------------------------------------------------');
                res.status(400).send('Registry NOT Found');
                return;
            }
        }); */
        console.log('It is an address ...');
    }
    else {        
        procModelData_1.repoSchema.find({_id: req.body.from }, (err, repoData) => {
            if (!err && repoData && repoData.length > 0) {  
                let processStepsList = [];
                let idProcessList = [];
                let myList = JSON.parse(JSON.stringify(repoData[0].txIDList));             
                console.log(myList);
                if(repoData[0].txIDList.length > 0) {
                    console.log('------------------------- WELL DONE! PROCESS FOUND ------------------------------');
                    idProcessList = repoData[0].txIDList; 

                    const a = [];
                    for (let i = 0; i < myList.length; i++) {
                        a.push(new Promise((resolve, reject) => {
                            procModelData_5.repoTxSchema.find({_id: myList[i]}, function (err, data) {
                                if (!err) {
                                    resolve(data[0]);
                                } else {
                                    reject(new Error('find transaction ERROR : ' + err));
                                }
                            });
                        }));
                    }
                    //return Promise.all(a);            
                    Promise.all(a).then((outputTx) => {
                        processStepsList = outputTx;
                        console.log(processStepsList);
                        res.status(200).send(processStepsList);
                    });             
                    

                    // repoData[0].txIDList.forEach(txID => {                                               
                    //     //idStepProcesses.push(txID);
                    //     processStepsList.push(outputTransactionRepo(txID))
                        
                        
                    // });
                    //await Promise.all(repoData[0].txIDList.map(async(txID) => {
                    // for (const txID of repoData[0].txIDList) {
                    //     const txDetails = await outputTransactionRepo(txID);
                    //     processStepsList.push(txDetails);

                    // }
                    /* repoData[0].txIDList.forEach(txID => {                                               
                        //idStepProcesses.push(txID);
                        let txOutput = await outputTransactionRepo(txID);                                            
                        processStepsList.push(txOutput);                                                                                           
                    }); */
                    //processStepsList = fillProcessList(repoData[0].txIDList);
                    
                     
                }                
               
                // if(processStepsList.length > 0) {
                //     console.log('Success');
                //     console.log(processStepsList);
                //     res.status(200).send(processStepsList);
                // } else {
                //     console.log('Empty response');
                //     /* myList.forEach(id =>{
                //         processStepsList.push (idTxRootProcessMap.get(id));
                //         //console.log(idTxRootProcessMap.get(id).timeExecution);
                //     });
                //     console.log(processStepsList); */
                //     res.status(200).send(processStepsList);
                // }
            }
            else {
                console.log("Error: Transaction NOT Found");
                console.log('----------------------------------------------------------------------------------------------');
                res.status(400).send('Transaction NOT Found');
                return;
            }
        });
    }
});
//////////////////////////////////////////////////////////////////////
///               ROLE DYNAMIC BINDING operations                  ///
//////////////////////////////////////////////////////////////////////
models.post('/resources/policy', (req, res) => {
    console.log('GENERATING AND DEPLOYING BINDING POLICY CONTRACTS ...');
    if (processRegistryContract === undefined) {
        console.log('ERROR: No Runtime Registry Available');
        console.log('----------------------------------------------------------------------------------------------');
        res.status(404).send('Error: Runtime Registry Not Found');
    }
    else {
        console.log('GENERATING SMART CONTRACTS FROM BINDING POLICY ...');
        let resourceModel = req.body.model;
        let parsingResult = BindingPolicyGenerator_1.generatePolicy(resourceModel, 'BindingPolicy');
        parsingResult
            .then((policy) => {
            let input = {
                'BindingAccessControl': fs.readFileSync('./src/models/dynamic_binding/runtime_solidity/BindingAccessControl.sol', 'utf8')
            };
            input['BindingPolicy'] = policy.solidity;
            console.log('=============================================');
            console.log("SOLIDITY CODE");
            console.log('=============================================');
            Object.keys(input).forEach(key => {
                console.log(input[key]);
            });
            console.log('....................................................................');


            let CompilerInput = {
                language: 'Solidity',
                sources: {
                    'BindingPolicy.sol': {
                        content: input['BindingPolicy']
                    },
                    'BindingAccessControl.sol': {
                    content: input['BindingAccessControl']
                    }
                },
                settings: {
                    optimizer: {
                        // disabled by default
                        enabled: true,
                    }, 
                  outputSelection: {
                    '*': {
                      '*': ['*']
                    }
                  }
                }
            };            


            let output = JSON.parse(solc.compile(JSON.stringify(CompilerInput)));            
            if (output.contracts.length === 0) {
                res.status(400).send('COMPILATION ERROR IN POLICY CONTRACTS');
                console.log('COMPILATION ERROR IN POLICY CONTRACTS');                
                console.log('----------------------------------------------------------------------------------------------');
                return;
            }
            
            console.log('POLICY CONTRACTS GENERATED AND COMPILED SUCCESSFULLY');          
            let ProcContract = web3.eth.contract(output.contracts['BindingPolicy.sol']['BindingPolicy_Contract'].abi); 
            ProcContract.new({
                from: web3.eth.accounts[executionAccount],
                data: "0x" + output.contracts['BindingPolicy.sol']['BindingPolicy_Contract'].evm.bytecode.object,
                gas: 4700000
            }, (err, contract) => {                
                if (err) {
                    console.log(`ERROR: PolicyContract instance creation failed`);
                    console.log('RESULT ', err);
                    res.status(403).send(err);
                }
                else if (contract.address) {
                    console.log(contract.address);
                    let indexToRole = [];
                    for (let [role, index] of policy.roleIndexMap) {
                        indexToRole[index] = role;
                    }
                    procModelData_3.policySchema.create({
                        address: contract.address,
                        model: req.body.model,
                        solidityCode: input['BindingPolicy'],
                        abi: JSON.stringify(output.contracts['BindingPolicy.sol']['BindingPolicy_Contract'].abi),
                        bytecode: output.contracts['BindingPolicy.sol']['BindingPolicy_Contract'].evm.bytecode.object,
                        indexToRole: indexToRole,
                        accessControlAbi: JSON.stringify(output.contracts['BindingAccessControl.sol']['BindingAccessControl'].abi),
                        accessControlBytecode: output.contracts['BindingAccessControl.sol']['BindingAccessControl'].evm.bytecode.object,                        
                    }, (err, repoData) => {
                        if (err) {
                            console.log('Error ', err);
                            console.log('----------------------------------------------------------------------------------------------');
                            // registerModels(currentIndex, sortedElements, createdElementMap, modelInfo, contracts, res);
                        }
                        else {
                            let idAsString = repoData._id.toString();
                            let policyGas = web3.eth.getTransactionReceipt(contract.transactionHash).gasUsed;
                            console.log("Policy CREATED and RUNNING at " + contract.address.toString());                            
                            console.log('GAS USED: ', policyGas);
                            console.log('Policy Id: ', idAsString);
                            console.log('Role\'s indexes: ', policy.roleIndexMap);
                            console.log(".............................................");
                            res.status(200).send({ address: contract.address.toString(), gas: policyGas, repoId: idAsString });
                            console.log('----------------------------------------------------------------------------------------------');
                        }
                    });
                }
            });
        })
            .catch((err) => {
            res.status(200).send({ 'Error': 'Error Parsing' });
            console.log(err);         
            console.log('----------------------------------------------------------------------------------------------');
        });
    }
});
models.post('/resources/task-role', (req, res) => {
    if (processRegistryContract === undefined) {
        console.log('ERROR: Runtime Registry NOT FOUND.');
        res.status(404).send({ 'Error': 'Runtime Registry NOT FOUND. Please, Create/Load a Registry.' });
        console.log('----------------------------------------------------------------------------------------------');
    }
    else {
        if (web3.isAddress(req.body.policyId)) {
            procModelData_3.policySchema.find({ address: req.body.policyId }, (err, repoData) => {
                if (!err && repoData && repoData.length > 0) {
                    let processData = new Map();
                    searchRepository(0, [req.body.rootProc], processData, res, req.body.policyId, findRoleMap(repoData[0].indexToRole));
                }
                else {
                    console.log("Error: Binding Policy NOT Found");
                    console.log('----------------------------------------------------------------------------------------------');
                    res.status(400).send('Binding Policy NOT Found');
                    return;
                }
            });
        }
        else {
            procModelData_3.policySchema.find({ _id: req.body.policyId }, (err, repoData) => {
                if (!err && repoData && repoData.length > 0) {
                    let processData = new Map();
                    searchRepository(0, [req.body.rootProc], processData, res, req.body.policyId, findRoleMap(repoData[0].indexToRole));
                }
                else {
                    console.log("Error: Binding Policy NOT Found");
                    console.log('----------------------------------------------------------------------------------------------');
                    res.status(400).send('Binding Policy NOT Found');
                    return;
                }
            });
        }
    }
});
models.get('/resources/:role/:procAddress', (req, res) => {
    if (!web3.isAddress(req.params.procAddress)) {
        res.status(200).send({ 'state': 'INVALID INPUT PROCESS ADDRESS' });
    }
    else if (processRegistryContract === undefined) {
        res.status(200).send({ 'state': 'UNDEFINED PROCESS REGISTRY' });
    }
    else {
        let _policyId = web3.toAscii(processRegistryContract.bindingPolicyFor.call(req.params.procAddress)).toString().substr(0, 24);
        procModelData_3.policySchema.find({ _id: _policyId }, (err, repoData) => {
            if (!err && repoData && repoData.length > 0) {
                let roleIndexMap = findRoleMap(repoData[0].indexToRole);
                if (!roleIndexMap.has(req.params.role)) {
                    console.log('UNDEFINED INPUT ROLE');
                    res.status(200).send({ 'state': 'UNDEFINED INPUT ROLE' });
                }
                else {
                    let accessControlAddr = processRegistryContract.findRuntimePolicy.call(req.params.procAddress);
                    if (accessControlAddr.toString() === '0x0000000000000000000000000000000000000000') {
                        console.log('UNDEFINED ACESS CONTROL CONTRACT');
                        res.status(200).send({ 'state': 'UNDEFINED ACESS CONTROL CONTRACT' });
                    }
                    else {
                        let _runtimePolicyContract = web3.eth.contract(JSON.parse(repoData[0].accessControlAbi)).at(accessControlAddr);
                        //let _runtimePolicyContract = web3.eth.contract(repoData[0].accessControlAbi , accessControlAddr);
                        let result = _runtimePolicyContract.roleState.call(roleIndexMap.get(req.params.role), req.params.procAddress);
                        if (result.c[0] === 0) {
                            console.log(`${req.params.role} is UNBOUND`);
                            res.status(200).send({ 'state': 'UNBOUND' });
                        }
                        else if (result.c[0] === 1) {
                            console.log(`${req.params.role} is RELEASING`);
                            res.status(200).send({ 'state': 'RELEASING' });
                        }
                        else if (result.c[0] === 2) {
                            console.log(`${req.params.role} is NOMINATED`);
                            res.status(200).send({ 'state': 'NOMINATED' });
                        }
                        else if (result.c[0] === 3) {
                            console.log(`${req.params.role} is BOUND`);
                            res.status(200).send({ 'state': 'BOUND' });
                        }
                        else {
                            console.log('UNDEFINED STATE');
                            res.status(200).send({ 'state': 'UNDEFINED' });
                        }
                    }
                }
            }
            else {
                console.log('UNDEFINED POLICY CONTRACT');
                res.status(200).send({ 'state': 'UNDEFINED POLICY CONTRACT' });
                return;
            }
        });
    }
    console.log('----------------------------------------------------------------------------------------------');
});
let validateInput = (rNominator, rNominee, roleIndexMap, res) => {
    if (!roleIndexMap.has(rNominee)) {
        console.log(`Error Nominee Role [${rNominee}] NOT FOUND`);
        res.status(404).send({ 'Error': `Nominee Role [${rNominee}] NOT FOUND` });
        console.log('----------------------------------------------------------------------------------------------');
        return false;
    }
    else if (!roleIndexMap.has(rNominator)) {
        console.log(`Error Nominee Role [${rNominee}] NOT FOUND`);
        res.status(404).send({ 'Error': `Nominee Role [${rNominee}] NOT FOUND` });
        console.log('----------------------------------------------------------------------------------------------');
        return false;
    }
    return true;
};
let findRoleMap = (repoArr) => {
    let roleInedexMap = new Map();
    for (let i = 1; i < repoArr.length; i++)
        if (repoArr[i])
            roleInedexMap.set(repoArr[i], i);
    return roleInedexMap;
};
let verifyAddress = (address, actor, res) => {
    if (!web3.isAddress(address)) {
        console.log('Error: ', `Invalid ${actor} Address [${address}]`);
        res.status(400).send(`Invalid Nominator Address [${address}]`);
        console.log('----------------------------------------------------------------------------------------------');
        return false;
    }
    return true;
};
models.post('/resources/nominate', (req, res) => {
    if (processRegistryContract === undefined) {
        res.status(404).send({ 'state': 'UNDEFINED PROCESS REGISTRY' });
    }
    else {
        let _policyId = web3.toAscii(processRegistryContract.bindingPolicyFor.call(req.body.pCase)).toString().substr(0, 24);
        procModelData_3.policySchema.find({ _id: _policyId }, (err, repoData) => {
            if (!err && repoData && repoData.length > 0) {
                let roleIndexMap = findRoleMap(repoData[0].indexToRole);
                if (validateInput(req.body.rNominator, req.body.rNominee, roleIndexMap, res)) {
                    if (verifyAddress(req.body.nominator, 'Nominator', res) &&
                        verifyAddress(req.body.nominee, 'Nominee', res) &&
                        verifyAddress(req.body.pCase, 'Process Case', res)) {
                        let accessControlAddr = processRegistryContract.findRuntimePolicy.call(req.body.pCase);
                        if (accessControlAddr.toString() !== '0x0000000000000000000000000000000000000000') {
                            console.log(`${req.body.rNominator}[${req.body.nominator}] is nominating ${req.body.rNominee}[${req.body.nominee}]`);
                            console.log(`Process Case: ${req.body.pCase}`);
                            let _runtimePolicyContract = web3.eth.contract(JSON.parse(repoData[0].accessControlAbi)).at(accessControlAddr);
                            //let _runtimePolicyContract = web3.eth.contract(repoData[0].accessControlAbi , accessControlAddr);
                            _runtimePolicyContract.nominate(roleIndexMap.get(req.body.rNominator), roleIndexMap.get(req.body.rNominee), req.body.nominator, req.body.nominee, req.body.pCase, {
                                from: req.body.nominator,
                                gas: 4700000
                            }, (error, result) => {
                                if (result) {
                                    console.log(`SUCCESS: ${req.body.nominator} nominated ${req.body.nominee}`);
                                    console.log(`Transaction Hash: ${result}`);
                                    console.log('----------------------------------------------------------------------------------------------');
                                    bindingOpTransactions.set(result, 0);
                                    res.status(200).send({ 'transactionHash': result });
                                }
                                else {
                                    console.log('ERROR', 'Nomination REJECTED by the Binding Policy');
                                    console.log('----------------------------------------------------------------------------------------------');
                                    res.status(404).send({ 'ERROR': error });
                                }
                            });
                        }
                        else {
                            console.log(`Process Instance NOT FOUND.`);
                            res.status(404).send({ 'Error': `Process Instance NOT FOUND. The nomination of an actor must occurr afterthe process deployment.` });
                            console.log('----------------------------------------------------------------------------------------------');
                        }
                    }
                }
            }
            else {
                console.log('UNDEFINED POLICY CONTRACT');
                res.status(400).send({ 'state': 'UNDEFINED POLICY CONTRACT' });
                return;
            }
        });
    }
});
models.post('/resources/release', (req, res) => {
    if (processRegistryContract === undefined) {
        res.status(404).send({ 'state': 'UNDEFINED PROCESS REGISTRY' });
    }
    else {
        let _policyId = web3.toAscii(processRegistryContract.bindingPolicyFor.call(req.body.pCase)).toString().substr(0, 24);
        procModelData_3.policySchema.find({ _id: _policyId }, (err, repoData) => {
            if (!err && repoData && repoData.length > 0) {
                let roleIndexMap = findRoleMap(repoData[0].indexToRole);
                if (validateInput(req.body.rNominator, req.body.rNominee, roleIndexMap, res)) {
                    if (verifyAddress(req.body.nominator, 'Nominator', res) &&
                        verifyAddress(req.body.pCase, 'Process Case', res)) {
                        let accessControlAddr = processRegistryContract.findRuntimePolicy.call(req.body.pCase);
                        if (accessControlAddr.toString() !== '0x0000000000000000000000000000000000000000') {
                            console.log(`${req.body.rNominator}[${req.body.nominator}] is releasing ${req.body.rNominee}[${req.body.nominee}]`);
                            console.log(`Process Case: ${req.body.pCase}`);
                            let _runtimePolicyContract = web3.eth.contract(JSON.parse(repoData[0].accessControlAbi)).at(accessControlAddr);
                            //let _runtimePolicyContract = web3.eth.contract(repoData[0].accessControlAbi , accessControlAddr);
                            _runtimePolicyContract.release(roleIndexMap.get(req.body.rNominator), roleIndexMap.get(req.body.rNominee), req.body.nominator, req.body.pCase, {
                                from: req.body.nominator,
                                gas: 4700000
                            }, (error, result) => {
                                if (result) {
                                    console.log(`SUCCESS: ${req.body.nominator} released ${req.body.nominee}`);
                                    console.log(`Transaction Hash: ${result}`);
                                    console.log('----------------------------------------------------------------------------------------------');
                                    bindingOpTransactions.set(result, 0);
                                    res.status(200).send({ 'transactionHash': result });
                                }
                                else {
                                    console.log('ERROR', 'Release REJECTED by the Binding Policy');
                                    res.status(400).send({ 'ERROR': error });
                                }
                            });
                        }
                        else {
                            console.log(`Process Instance NOT FOUND.`);
                            res.status(404).send({ 'Error': `Process Instance NOT FOUND. The release of an actor must occurr afterthe process deployment.` });
                            console.log('----------------------------------------------------------------------------------------------');
                        }
                    }
                }
            }
            else {
                console.log('UNDEFINED POLICY CONTRACT');
                res.status(400).send({ 'state': 'UNDEFINED POLICY CONTRACT' });
                return;
            }
        });
    }
});
let verifyEndorser = (rEndorser, endorser, roleIndexMap, res) => {
    if (!roleIndexMap.has(rEndorser)) {
        console.log(`Error Endorser Role [${rEndorser}] NOT FOUND`);
        res.status(404).send({ 'Error': `Nominee Role [${rEndorser}] NOT FOUND` });
        console.log('----------------------------------------------------------------------------------------------');
        return false;
    }
    return verifyAddress(endorser, 'Endorser', res);
};
models.post('/resources/vote', (req, res) => {
    if (processRegistryContract === undefined) {
        res.status(404).send({ 'state': 'UNDEFINED PROCESS REGISTRY' });
    }
    else {
        let _policyId = web3.toAscii(processRegistryContract.bindingPolicyFor.call(req.body.pCase)).toString().substr(0, 24);
        procModelData_3.policySchema.find({ _id: _policyId }, (err, repoData) => {
            if (!err && repoData && repoData.length > 0) {
                let roleIndexMap = findRoleMap(repoData[0].indexToRole);
                if (validateInput(req.body.rNominator, req.body.rNominee, roleIndexMap, res)) {
                    if (verifyEndorser(req.body.rEndorser, req.body.endorser, roleIndexMap, res) &&
                        verifyAddress(req.body.pCase, 'Process Case', res)) {
                        let accessControlAddr = processRegistryContract.findRuntimePolicy.call(req.body.pCase);
                        if (accessControlAddr.toString() !== '0x0000000000000000000000000000000000000000') {
                            let _runtimePolicyContract = web3.eth.contract(JSON.parse(repoData[0].accessControlAbi)).at(accessControlAddr);
                            //let _runtimePolicyContract = web3.eth.contract(repoData[0].accessControlAbi , accessControlAddr);
                            if (req.body.onNomination) {
                                let voteResult = req.body.isAccepted === "true" ? 'endorsing' : 'rejecting';
                                console.log(`${req.body.rEndorser}[${req.body.endorser}] is ${voteResult} nomination of ${req.body.rNominee} by ${req.body.rNominator}`);
                                console.log(`Process Case: ${req.body.pCase}`);
                                _runtimePolicyContract.voteN(roleIndexMap.get(req.body.rNominator), roleIndexMap.get(req.body.rNominee), roleIndexMap.get(req.body.rEndorser), req.body.endorser, req.body.pCase, req.body.isAccepted, {
                                    from: req.body.endorser,
                                    gas: 4700000
                                }, (error, result) => {
                                    if (result) {
                                        let tp = req.body.isAccepted === 'true' ? 'endorsed' : 'rejected';
                                        console.log(`SUCCESS: ${req.body.endorser} ${tp} the nomination of ${req.body.nominee}`);
                                        console.log(`Transaction Hash: ${result}`);
                                        console.log('----------------------------------------------------------------------------------------------');
                                        bindingOpTransactions.set(result, 0);
                                        res.status(200).send({ 'transactionHash': result });
                                    }
                                    else {
                                        console.log('ERROR', 'Vote REJECTED by the Binding Policy');
                                        console.log('----------------------------------------------------------------------------------------------');
                                        res.status(400).send({ 'ERROR': error });
                                    }
                                });
                            }
                            else {
                                let voteResult = req.body.isAccepted === "true" ? 'endorsing' : 'rejecting';
                                console.log(`${req.body.rEndorser}[${req.body.endorser}] is ${voteResult} release of ${req.body.rNominee} by ${req.body.rNominator}`);
                                console.log(`Process Case: ${req.body.pCase}`);
                                _runtimePolicyContract.voteR(roleIndexMap.get(req.body.rNominator), roleIndexMap.get(req.body.rNominee), roleIndexMap.get(req.body.rEndorser), req.body.endorser, req.body.pCase, req.body.isAccepted, {
                                    from: req.body.endorser,
                                    gas: 4700000
                                }, (error, result) => {
                                    if (result) {
                                        let tp = req.body.isAccepted === 'true' ? 'endorsed' : 'rejected';
                                        console.log(`VOTE ACCEPTED: ${req.body.endorser} ${tp} the release of ${req.body.nominee}`);
                                        console.log(`Transaction Hash: ${result}`);
                                        console.log('----------------------------------------------------------------------------------------------');
                                        bindingOpTransactions.set(result, 0);
                                        res.status(200).send({ 'transactionHash': result });
                                    }
                                    else {
                                        console.log('ERROR', 'Vote REJECTED by the Binding Policy');
                                        console.log('----------------------------------------------------------------------------------------------');
                                        res.status(400).send({ 'ERROR': error });
                                    }
                                });
                            }
                        }
                        else {
                            console.log(`Process Instance NOT FOUND.`);
                            res.status(404).send({ 'Error': `Process Instance NOT FOUND. The voting of an operation must occurr afterthe process deployment.` });
                            console.log('----------------------------------------------------------------------------------------------');
                        }
                    }
                }
            }
            else {
                console.log('UNDEFINED POLICY CONTRACT');
                res.status(400).send({ 'state': 'UNDEFINED POLICY CONTRACT' });
                return;
            }
        });
    }
});
let searchRepository = (top, queue, processData, response, policyId, roleIndexMap) => {
    processData.set(queue[top], new Array());
    procModelData_1.repoSchema.find({ _id: queue[top] }, (err, repoData) => {
        if (err) {
            return;
        }
        else {
            if (repoData.length > 0) {
                let dictionary = repoData[0].indexToElement;
                
                for (let i = 1; i < dictionary.length; i++) {
                    
                    if (dictionary[i].type === 'Workitem' || dictionary[i].type === 'EventTime') {
                        processData.get(queue[top]).push({ taskIndex: i, roleIndex: roleIndexMap.get(dictionary[i].role) });
                    }
                    else if (dictionary[i].type === 'Separate-Instance') {
                        queue.push(web3.toAscii(processRegistryContract.childrenFor.call(queue[top], i)).toString().substr(0, 24));
                    }
                }
                if (top < queue.length - 1)
                    searchRepository(top + 1, queue, processData, response, policyId, roleIndexMap);
                else {
                    let procesRoleContract = ProcessRoleGenerator_1.generateRoleTaskContract(processData, 'TaskRoleContract', true);
                    procesRoleContract
                        .then((solidity) => {
                        let input = {};
                        input['TaskRoleContract'] = solidity;
                        console.log('=============================================');
                        console.log("SOLIDITY CODE");
                        console.log('=============================================');
                        console.log(solidity);
                        let CompilerInput = {
                            language: 'Solidity',
                            sources: {
                                'TaskRoleContract.sol': {
                                    content: input['TaskRoleContract']
                                },
                                
                            },
                            settings: {
                                /* optimizer: {
                                    // disabled by default
                                    enabled: true,
                                }, */    
                                outputSelection: {
                                    '*': {
                                        '*': ['*']
                                    }
                                }
                            }
                          };
                        let output = JSON.parse(solc.compile(JSON.stringify(CompilerInput)));                        
                        if (Object.keys(output.contracts).length === 0) {
                            response.status(400).send('COMPILATION ERROR IN TASK-ROLE CONTRACT');
                            console.log('COMPILATION ERROR IN TASK-ROLE CONTRACT');
                            console.log(output.errors);
                            console.log('----------------------------------------------------------------------------------------------');
                            return;
                        }
                        let ProcContract = web3.eth.contract(output.contracts['TaskRoleContract.sol']['TaskRoleContract_Contract'].abi);
                        ProcContract.new({
                            from: web3.eth.accounts[executionAccount],
                            data: "0x" + output.contracts['TaskRoleContract.sol']['TaskRoleContract_Contract'].evm.bytecode.object,
                            gas: 4700000
                        }, (err, contract) => {
                            if (err) {
                                console.log(`ERROR: TASK-ROLE-MAP instance creation failed`);
                                console.log('RESULT ', err);
                                response.status(403).send(err);
                            }
                            else if (contract.address) {
                                procModelData_4.roleTaskSchema.create({
                                    address: contract.address,
                                    solidityCode: input['TaskRoleContract'],
                                    abi: output.contracts['TaskRoleContract.sol']['TaskRoleContract_Contract'].abi,
                                    bytecode: output.contracts['TaskRoleContract.sol']['TaskRoleContract_Contract'].evm.bytecode.object,
                                }, (err, repoData) => {
                                    if (err) {
                                        console.log('Error ', err);
                                        console.log('----------------------------------------------------------------------------------------------');
                                    }
                                    else {
                                        let idAsString = repoData._id.toString();
                                        processRegistryContract.relateProcessToPolicy(queue[0], policyId, idAsString, {
                                            from: web3.eth.accounts[0],
                                            gas: 4700000
                                        }, (error, result) => {
                                            if (result) {
                                                let gas = web3.eth.getTransactionReceipt(contract.transactionHash).gasUsed;
                                                console.log("TaskRoleMap CREATED and RUNNING at " + contract.address.toString());
                                                console.log('GAS USED: ', gas);
                                                console.log('Repo Id: ', idAsString);
                                                response.status(200).send({ address: contract.address.toString(), gas: gas, repoId: idAsString });
                                                console.log('----------------------------------------------------------------------------------------------');
                                            }
                                            else {
                                                console.log('ERROR ', error);
                                                response.status(400).send(error);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    })
                        .catch((err) => {
                        //console.log('Error: output ' + err + ' found');
                        console.log('Error: process ID ' + queue[top] + ' not found');
                        response.status(404).send({ 'Error': 'Process ID not found' });
                        console.log('----------------------------------------------------------------------------------------------');
                    });
                }
            }
        }
    });
};
//////////////////////////////////////////////////////////////////////
///    PROCESS MODEL CONTROL FLOW + WORKLIST operations            ///
//////////////////////////////////////////////////////////////////////
models.post('/models', (req, res) => {
    if (processRegistryContract === undefined) {
        console.log('ERROR: Runtime Registry NOT FOUND');
        res.status(404).send({ 'Error': 'Runtime Registry NOT FOUND' });
        console.log('----------------------------------------------------------------------------------------------');
    }
    else {
        console.log('GENERATING SMART CONTRACTS FROM PROCESS MODEL ...');
        let modelInfo = req.body;
        try {
            let cont = models_parsers_1.parseModel(modelInfo);
            cont.then(() => {
                let outputModelinfo = modelInfo.solidity;                
                let input = {
                    'AbstractFactory': fs.readFileSync('./src/models/abstract/AbstractFactory.sol', 'utf8'),
                    'AbstractRegistry': fs.readFileSync('./src/models/abstract/AbstractRegistry.sol', 'utf8'),
                    'AbstractWorklist': fs.readFileSync('./src/models/abstract/AbstractWorklist.sol', 'utf8'),
                    'ProcessRegistry': fs.readFileSync('./src/models/abstract/ProcessRegistry.sol', 'utf8'),
                    'AbstractProcess': fs.readFileSync('./src/models/abstract/AbstractProcess.sol', 'utf8'),
                    'BindingAccessControl': fs.readFileSync('./src/models/dynamic_binding/runtime_solidity/BindingAccessControl.sol', 'utf8'),                    

                };
                input[modelInfo.id] = modelInfo.solidity;
                input['modelInfo'] = modelInfo.solidity;
                       
                console.log('=============================================');
                console.log("SOLIDITY CODE");
                console.log('=============================================');
                console.log(modelInfo.solidity);
                console.log('....................................................................');
                let CompilerInput = {
                    language: 'Solidity',
                    sources: {
                        'modelInfo.sol': {
                            content: input['modelInfo']
                        },
                        'AbstractFactory.sol': {
                            content: input['AbstractFactory']
                        },
                        'AbstractRegistry.sol': {
                            content: input['AbstractRegistry']
                        },
                        'AbstractWorklist.sol': {
                            content: input['AbstractWorklist']
                        },
                        'ProcessRegistry.sol': {
                            content: input['ProcessRegistry']
                        },
                        'AbstractProcess.sol': {
                            content: input['AbstractProcess']
                        },
                        'BindingAccessControl.sol': {
                            content: input['BindingAccessControl']
                        },
                        
                    },
                    settings: {
                        optimizer: {
                            // disabled by default
                            enabled: true,
                        },    
                        outputSelection: {
                            '*': {
                                '*': ['*']
                            }
                        }
                    }
                  };

                let output = JSON.parse(solc.compile(JSON.stringify(CompilerInput)));  
                if (Object.keys(output.contracts).length === 0) {
                    res.status(400).send('COMPILATION ERROR IN SMART CONTRACTS');
                    console.log('COMPILATION ERROR IN SMART CONTRACTS');
                    console.log(output.errors);
                    console.log('----------------------------------------------------------------------------------------------');
                    return;
                }
                console.log('CONTRACTS GENERATED AND COMPILED SUCCESSFULLY');                
                console.log('....................................................................');
                console.log('STARTING PROCESS MODEL REGISTRATION ...');
                registerModel(modelInfo, output.contracts, res);
            });
        }
        catch (e) {
            console.log("ERROR: ", e);
            res.status(400).send(e);
            console.log('----------------------------------------------------------------------------------------------');
        }
    }
});
// Creating a new instance of a registered (root) process
let caseCreatorMap = new Map();
models.post('/models/:bundleId', (req, res) => {
    if (verifyAddress(req.body.caseCreator, 'Case Creator', res) && processRegistryContract !== undefined) {
        let _taskRoleId = web3.toAscii(processRegistryContract.taskRoleMapFromId.call(req.params.bundleId)).toString().substr(0, 24);
        procModelData_4.roleTaskSchema.find({ _id: _taskRoleId }, (err, repoDataTaskRole) => {
            if (!err && repoDataTaskRole && repoDataTaskRole.length > 0) {
                let _policyId = web3.toAscii(processRegistryContract.bindingPolicyFromId.call(req.params.bundleId)).toString().substr(0, 24);
                procModelData_3.policySchema.find({ _id: _policyId }, (err, repoDataPolicy) => {
                    if (!err && repoDataPolicy && repoDataPolicy.length > 0) {
                        let roleIndexMap = findRoleMap(repoDataPolicy[0].indexToRole);
                        if (!roleIndexMap.has(req.body.creatorRole)) {
                            console.log('Case Creator Role NOT found');
                            res.status(404).send('Case Creator Role NOT found');
                            console.log('----------------------------------------------------------------------------------------------');
                        }
                        else {
                            procModelData_1.repoSchema.find({ _id: req.params.bundleId }, (err, repoData) => {
                                if (err)
                                    res.status(404).send('Process model not found');
                                else {
                                    console.log("TRYING TO CREATE INSTANCE OF CONTRACT: ", repoData[0].rootProcessID);
                                    
                                    let AccessControlContract = web3.eth.contract(JSON.parse(repoDataPolicy[0].accessControlAbi));
                                    AccessControlContract.new(processRegistryContract.address, repoDataPolicy[0].address, repoDataTaskRole[0].address, {
                                        from: req.body.caseCreator,
                                        data: "0x" + repoDataPolicy[0].accessControlBytecode,
                                        gas: 4700000
                                    },(err, contract) => {
                                        if (err) {
                                            console.log(`ERROR: BindingAccessControl instance creation failed`);
                                            console.log('RESULT ', err);
                                            res.status(403).send(err);
                                        }
                                        else if (contract.address) {
                                            let policyGas = web3.eth.getTransactionReceipt(contract.transactionHash).gasUsed;
                                            console.log("BindingAccessControl Contract DEPLOYED and RUNNING at " + contract.address.toString());
                                            console.log('Gas Used: ', policyGas);
                                            console.log('....................................................................');
                                           
                                            let parent_address = web3.eth.accounts[executionAccount];
                                            processRegistryContract.newBundleInstanceFor(repoData[0]._id.toString(), 0, contract.address, {
                                                from: web3.eth.accounts[executionAccount],
                                                gas: 4500000
                                            }, (errNew, resNew) => {
                                                if (!errNew) {                                                    
                                                    let myEvent = processRegistryContract.NewInstanceCreatedFor(
                                                        {
                                                        fromBlock: 0,
                                                        toBlock: 'latest'
                                                    }
                                                    );                                                
                                                    myEvent.watch((errEvt, resEvt) => {
                                                        if (!errEvt) {
                                                            //console.log('Event watched well ===== ', resEvt.event);
                                                            if (resEvt && resEvt.transactionHash === resNew && resEvt.event === 'NewInstanceCreatedFor' && parseInt(resEvt.args.parent.toString(), 16) === 0) {
                                                                myEvent.stopWatching();
                                                                let processAddress = resEvt.args.processAddress.toString();
                                                                console.log('Root Process Contract DEPLOYED and RUNNING !!! AT ADDRESS: ', processAddress);
                                                                console.log('GAS USED: ', web3.eth.getTransactionReceipt(resEvt.transactionHash).gasUsed);
                                                                console.log('....................................................................');
                                                                contract.nominateCaseCreator(roleIndexMap.get(req.body.creatorRole), req.body.caseCreator, processAddress, {
                                                                    from: req.body.caseCreator,
                                                                    gas: 4700000
                                                                }, (error1, result1) => {
                                                                    if (result1) {
                                                                        console.log("Case-creator nominated ");
                                                                        caseCreatorMap.set(result1, processAddress);
                                                                        console.log('----------------------------------------------------------------------------------------------');
                                                                        res.status(200).send({
                                                                            address: processAddress,
                                                                            gas: web3.eth.getTransactionReceipt(resEvt.transactionHash).gasUsed,
                                                                            runtimeAddress: contract.address.toString(),
                                                                            runtimeGas: policyGas,
                                                                            transactionHash: result1,
                                                                        });
                                                                    }
                                                                    else {
                                                                        console.log('ERROR ', error1);
                                                                        console.log('----------------------------------------------------------------------------------------------');
                                                                        res.status(200).send({ ERROR: error1 });
                                                                    }
                                                                });
                                                            }
                                                        }
                                                        else {
                                                            console.log('ERROR ', errEvt);
                                                            console.log('----------------------------------------------------------------------------------------------');
                                                            res.status(400).send(errEvt);
                                                        }
                                                    });
                                                    
                                                }
                                                else {
                                                    console.log('ERROR ', errNew);
                                                    console.log('----------------------------------------------------------------------------------------------');
                                                    res.status(400).send(errNew);
                                                }
                                            });
                                            

                                        }
                                    });
                                }
                            });
                        }
                    }
                    else {
                        console.log('UNDEFINED POLICY CONTRACT');
                        res.status(400).send({ 'state': 'UNDEFINED POLICY CONTRACT' });
                        return;
                    }
                });
            }
            else {
                console.log('Task-Role Contract NOT found');
                res.status(404).send('Task-Role Contract NOT found');
                console.log('----------------------------------------------------------------------------------------------');
            }
        });
    }
    else
        res.status(404).send('Process model not found');
});
// Querying activation for a given process (repository ID provided)
models.get('/processes/:procAddress', (req, res) => {
    let contractAddress = req.params.procAddress;
    console.log('QUERYING ACTIVATION FOR CONTRACT:', contractAddress);
    if (processRegistryContract) {
        let bundleId = web3.toAscii(processRegistryContract.bundleFor.call(contractAddress)).toString().substr(0, 24);
        procModelData_1.repoSchema.find({ _id: bundleId }, (err, repoData) => {
            if (!err && repoData && repoData.length > 0) {
                let workitems = [], serviceTasks = [];
                console.log("CHECKING STARTED ELEMENTS ");
                instanceStateFor(0, [contractAddress], repoData[0].bpmnModel, workitems, serviceTasks, res);
            }
            else {
                console.log('Instance Not Found');
                console.log('----------------------------------------------------------------------------------------------');
                res.status(400).send({});
            }
        });
    }
    else {
        console.log('Instance Not Found');
        res.status(400).send({});
    }
});
// Performing an operation on a started workitem: Execute, Allocate, Revoke.
models.post('/workitems/:worklistAddress/:reqId', (req, res) => {
    let worklistAddress = req.params.worklistAddress;
    let reqId = req.params.reqId;
    //console.log(`Input parameter '${req.body.inputParameters}' of request.`);
    if (!web3.isAddress(req.body.user)) {
        console.log('Error: ', `Invalid Addres '${req.body.user}' of user trying to perform the operation.`);
        console.log('----------------------------------------------------------------------------------------------');
        res.status(400).send(`Invalid Addres '${req.body.user}' of user trying to perform the operation.`);
    }
    else if (processRegistryContract) {
        let bundleId = web3.toAscii(processRegistryContract.worklistBundleFor.call(worklistAddress)).toString().substr(0, 24);
        procModelData_1.repoSchema.find({ _id: bundleId }, (err, repoData) => {
            if (!err && repoData && repoData.length > 0) {
                //let worklistInstance = web3.eth.contract(JSON.parse(repoData[0].worklistAbi)).at(worklistAddress);
                let worklistInstance = web3.eth.contract(JSON.parse(repoData[0].worklistAbi)).at(worklistAddress);                
                let nodeIndex = worklistInstance.elementIndexFor.call(reqId);
                let processInstanceAddr = worklistInstance.processInstanceFor.call(reqId);
                let processInstance = web3.eth.contract(JSON.parse(repoData[0].abi)).at(processInstanceAddr);
                let node = repoData[0].indexToElement[nodeIndex];
                let inputParams = req.body.inputParameters;
                let realParameters = [];                
                let functionName = '';
                //Start including check of node lead by time                                
                realParameters = inputParams.length > 0 ? [reqId].concat(inputParams) : [reqId];
                console.log(`WANT TO EXECUTE TASK: ${node.name}, ON WORKLIST: ${worklistAddress}`);
                functionName = node.name;                              
                //step in node non lead by timer
                if (taskLeadbyTimer.indexOf(node.id) < 0 ) {
                   let ufunctionName = node.type !='EventTime' ? functionName : handlingTimerEvent;
                   //console.log('real parameters  ==>'+realParameters);
                    worklistInstance[ufunctionName].apply(this, realParameters.concat({
                        from: req.body.user,
                        gas: 4700000
                    }, (error, result) => {
                    if (error) {
                        console.log('ERROR: After real parameter' + error);
                        console.log('----------------------------------------------------------------------------------------------');
                        res.status(400).send('Error');
                    }
                    else {
                        if (node.type !='EventTime') {
                        console.log(`TRANSACTION: ${result}, PENDING !!!`);
                        console.log('----------------------------------------------------------------------------------------------');
                        res.status(200).send({ transactionHash: result });
                        }
                        else {
                            let blockNbr = web3.eth.getTransactionReceipt(result).blockNumber;
                            let block_time = web3.eth.getBlock(blockNbr).timestamp;
                            console.log(`TRANSACTION: ${result}, PENDING !!!`);
                            console.log('----------------------------------------------------------------------------------------------');
                            console.log(`Block time: ${block_time}, DONE !!!`);
                            // adding block time to TimerIndex
                            worklistInstance.Worklist_Timer_global(reqId, block_time, {
                                from: web3.eth.accounts[0],
                                gas: 4700000
                            }, (err1, res1) => {
                                if (err1) {
                                    console.log('ERROR: ' + err1);
                                    console.log('----------------------------------------------------------------------------------------------');
                                    res.status(400).send('Error');
                                }
                                else {
                                    
                                    console.log(`Block time captured from Timer : ${reqId}, Done !!!`);
                                    console.log('----------------------------------------------------------------------------------------------');
                                    console.log(`TRANSACTION: ${res1}, DONE !!!`);
                                    //res.status(200).send({ transactionHash: res1 });
                                    }
                                    
                                });
                                res.status(200).send({ transactionHash: result });
                            }
                            saveTransactionRepo(result, repoData, functionName);                            
                            //res.status(200).send({ transactionHash: result });
                        //}
                    }
                }));
                }
                //End of node non lead by timer
                //Starting step in for node lead by timer
                else {
                    if (!LeadTimerNodeCompleted.get(node.id)){
                        let timerrealParameters = [];
                        //let timerIndex=nodeIndex-1;
                        let reqTimerId = reqId-1;
                        let workitemIdTimer = JSON.stringify(reqTimerId); 
                        let timerIndex = parseInt(worklistInstance.elementIndexFor.call(reqTimerId));
                        //let timerProcessAddress = worklistInstance.previousTimerProcessInstance.call(node.id);
                     //let workitemIdTimer = worklistInstance.workItemsFor.call(timerIndex, processInstanceAddr);
                        //let workitemIdTimer = reqId-1;                                                                                               
                        timerrealParameters = inputParams.length > 0 ? [workitemIdTimer].concat(inputParams) : [workitemIdTimer];
                        //timerrealParameters.push(workitemIdTimer);                                              
                        worklistInstance[timerCheckFunctionName].apply(this, timerrealParameters.concat({
                        //worklistInstance.check_timer_duration(workitemIdTimer, {                        
                            from: req.body.user,
                            gas: 4700000
                        }, (error, resultTimer) => {
                            if (error) {
                                console.log('ERROR while calling check_timer_duration function : ' + error);
                                console.log('----------------------------------------------------------------------------------------------');
                                res.status(400).send('Error');
                            }
                            else {                                
                                let timerstatus = processInstance.isTimerCompleted.call(timerIndex);                                
                                let blockNb = web3.eth.getTransactionReceipt(resultTimer).blockNumber;
                                let blockTime = web3.eth.getBlock(blockNb).timestamp;
                                if (timerstatus) {
                                    LeadTimerNodeCompleted.set(node.id, true);
                                    console.log(`SUCCESSFULL, you have reached the waited time. You can continue !!!`);
                                    console.log('----------------------------------------------------------------------------------------------');
                                    res.status(200).send({ transactionHash: resultTimer });
                                }
                                else {                                    
                                    let endTime = processInstance.getEndTime.call(timerIndex);                                    
                                    let remainingTime = endTime > blockTime ? endTime - blockTime : 0;
                                    console.log(`this end time (block time now + duration) : ${endTime}, seconds !!!`);                               
                                    console.log(`Waiting time not yet complete, please try again in : ${remainingTime} seconds !!!`);
                                    console.log('----------------------------------------------------------------------------------------------');                                                                    
                                }
                            }
                        }));
                        
                    } 
                    else {
                        worklistInstance[functionName].apply(this, realParameters.concat({
                            from: req.body.user,
                            gas: 4700000
                        }, (error, result) => {
                            if (error) {
                                console.log('ERROR: ' + error);
                                console.log('----------------------------------------------------------------------------------------------');
                                res.status(400).send('Error');
                            }
                            else {                        
                                console.log(`TRANSACTION: ${result}, PENDING !!!`);
                                console.log('----------------------------------------------------------------------------------------------');
                                res.status(200).send({ transactionHash: result });
                                
                                saveTransactionRepo(result, repoData, functionName);
                              
                            }

                        }));

                        

                    }
                }
                //Ending step in for node lead by timer
            }
            else {
                console.log('Error: ', err);
                console.log('----------------------------------------------------------------------------------------------');
                res.status(400).send('Error');
            }
        });
    }
    else {
        console.log('Error: ', 'Process Registry Undefined');
        res.status(400).send('Process Registry Undefined');
    }
});
/////////////// Methods for deploying model //////////////////////
// Step 1. Model Registration: Collects the compilation artifacts of the produced models, 
//         and saves all these metadata as an entry in the Process Repository.
let registerModel = (modelInfo, contracts, response) => {
    // Sorting elements such that children are created first
    let queue = [{ nodeId: modelInfo.id, nodeName: modelInfo.name, bundleId: '', nodeIndex: 0, bundleParent: '', factoryContract: '' }];
    for (let i = 0; i < queue.length; i++) {
        if (modelInfo.controlFlowInfoMap.has(queue[i].nodeId)) {
            let cfInfo = modelInfo.controlFlowInfoMap.get(queue[i].nodeId);
            let candidates = [cfInfo.multiinstanceActivities, cfInfo.nonInterruptingEvents, cfInfo.callActivities];
            candidates.forEach(children => {
                if (children) {
                    children.forEach((value, key) => {
                        queue.push({ nodeId: key, nodeName: value, bundleId: '', nodeIndex: 0, bundleParent: '', factoryContract: '' });
                    });
                }
            });
        }
    }
    queue.reverse();
    let nodeIndexes = new Map();
    for (let i = 0; i < queue.length; i++)
        nodeIndexes.set(queue[i].nodeId, i);
    console.log('....................................................................');
    console.log('UPDATING COMPILATION ARTIFACTS IN REPOSITORY ...');
    registerModels(0, queue, nodeIndexes, modelInfo, contracts, response);
};
let registerModels = (currentIndex, sortedElements, nodeIndexes, modelInfo, contracts, res) => {
    let nodeName = sortedElements[currentIndex].nodeName;
    let gNodeId = sortedElements[currentIndex].nodeId;
    let controlFlowInfo = modelInfo.controlFlowInfoMap.get(gNodeId);
    if (modelInfo.globalNodeMap.get(gNodeId).$type === 'bpmn:StartEvent')
        controlFlowInfo = modelInfo.controlFlowInfoMap.get(modelInfo.globalNodeMap.get(gNodeId).$parent.id);
    if (controlFlowInfo) {
        let indexToFunctionName = [];
        let childrenSubproc = [];
        controlFlowInfo.nodeList.forEach(nodeId => {
            let element = modelInfo.globalNodeMap.get(nodeId);            
            if (controlFlowInfo.nodeList.indexOf(nodeId) >= 0) {
                let type = "None";
                let role = "None";
                let indexRole = 0;                
                if (controlFlowInfo.callActivities.has(nodeId) || controlFlowInfo.multiinstanceActivities.has(nodeId) || controlFlowInfo.nonInterruptingEvents.has(nodeId))
                    type = "Separate-Instance";
                else if (element.$type === 'bpmn:ServiceTask')
                    type = "Service";
                else if (controlFlowInfo.catchingTimers.indexOf(nodeId) >= 0) {
                    type = "EventTime";
                    if (!controlFlowInfo.taskRoleMap.has(nodeId))
                        throw 'No role related to User Task: ' + controlFlowInfo.nodeNameMap.get(nodeId);
                    role = controlFlowInfo.taskRoleMap.get(nodeId); 
                    }                  
                else if (element.$type === 'bpmn:UserTask' || element.$type === 'bpmn:ReceiveTask' || controlFlowInfo.catchingMessages.indexOf(nodeId) >= 0) {
                    type = "Workitem";                    
                    if (!controlFlowInfo.taskRoleMap.has(nodeId))
                        throw 'No role related to User Task: ' + controlFlowInfo.nodeNameMap.get(nodeId);
                    role = controlFlowInfo.taskRoleMap.get(nodeId);
                    if (element.$type === 'bpmn:UserTask' || element.$type === 'bpmn:ReceiveTask'){
                        if (controlFlowInfo.nodeLeadbyTimer.indexOf(nodeId) >= 0) {
                            taskLeadbyTimer.push(nodeId);
                            LeadTimerNodeCompleted.set(nodeId, false);
                        }
                    }
                }
                indexToFunctionName[controlFlowInfo.nodeIndexMap.get(nodeId)] = {
                    name: controlFlowInfo.nodeNameMap.get(nodeId),
                    id: nodeId,
                    type: type,
                    role: role
                };
                if (controlFlowInfo.callActivities.has(nodeId) || controlFlowInfo.multiinstanceActivities.has(nodeId) || controlFlowInfo.nonInterruptingEvents.has(nodeId)) {
                    childrenSubproc.push(nodeId);
                    sortedElements[nodeIndexes.get(nodeId)].nodeIndex = controlFlowInfo.nodeIndexMap.get(nodeId);
                    if (controlFlowInfo.externalBundles.has(nodeId))
                        sortedElements[nodeIndexes.get(nodeId)].bundleId = controlFlowInfo.externalBundles.get(nodeId);
                }
            }
        });
        let txIDArray = [];
        let bpmnModel = currentIndex < sortedElements.length - 1 ? 'empty' : modelInfo.bpmn;
        let worklistAbi = contracts['modelInfo.sol'][`${nodeName}_Worklist`] ? JSON.stringify(contracts['modelInfo.sol'][`${nodeName}_Worklist`].abi ): 'undefined';
        procModelData_1.repoSchema.create({
            rootProcessID: gNodeId,
            rootProcessName: nodeName,
            bpmnModel: bpmnModel,
            solidityCode: modelInfo.solidity,
            abi: JSON.stringify(contracts['modelInfo.sol'][`${nodeName}_Contract`].abi),
            bytecode: contracts['modelInfo.sol'][`${nodeName}_Contract`].evm.bytecode.object,
            indexToElement: indexToFunctionName,
            worklistAbi: worklistAbi,
            txIDList: txIDArray,
        }, (err, repoData) => {
            if (err) {
                console.log('Error ', err);
                // registerModels(currentIndex, sortedElements, createdElementMap, modelInfo, contracts, res);
            }
            else {
                let idAsString = repoData._id.toString();
                sortedElements[currentIndex].bundleId = idAsString;
                sortedElements[currentIndex].bundleParent = idAsString;
                childrenSubproc.forEach(childId => {
                    sortedElements[nodeIndexes.get(childId)].bundleParent = idAsString;
                });
                console.log(`Compilation artifacts of ${nodeName} updated in repository with id ${idAsString}`);
                continueRegistration(currentIndex, sortedElements, nodeIndexes, modelInfo, contracts, res);
            }
        });
    }
    else {
        continueRegistration(currentIndex, sortedElements, nodeIndexes, modelInfo, contracts, res);
    }
};
let continueRegistration = (currentIndex, sortedElements, nodeIndexes, modelInfo, contracts, res) => {
    if (currentIndex + 1 >= sortedElements.length) {
        console.log('....................................................................');
        console.log('RELATING PARENT TO NESTED CHILDREN IN REGISTRY  ...');
        createParent2ChildRelation(0, sortedElements, contracts, modelInfo, res);
    }
    else
        registerModels(currentIndex + 1, sortedElements, nodeIndexes, modelInfo, contracts, res);
};
let createParent2ChildRelation = (currentIndex, sortedElements, outputContracts, modelInfo, response) => {
    processRegistryContract.addChildBundleId(sortedElements[currentIndex].bundleParent, sortedElements[currentIndex].bundleId, sortedElements[currentIndex].nodeIndex, {
        from: web3.eth.accounts[0],
        gas: 4700000
    }, (error, result) => {
        if (result) {
            console.log(`${sortedElements[currentIndex].nodeName} : ${sortedElements[currentIndex].bundleParent} => (${sortedElements[currentIndex].nodeIndex}), ${sortedElements[currentIndex].bundleId}`);
            if (currentIndex + 1 < sortedElements.length) {
                createParent2ChildRelation(currentIndex + 1, sortedElements, outputContracts, modelInfo, response);
            }
            else {
                console.log('....................................................................');
                let removedCallActivities = [];
                sortedElements.forEach(element => {
                    if (modelInfo.controlFlowInfoMap.has(element.nodeId) || modelInfo.globalNodeMap.get(element.nodeId).$type === 'bpmn:StartEvent') {
                        removedCallActivities.push(element);
                    }
                });
                if (removedCallActivities.length > 0) {
                    console.log('DEPLOYING FACTORIES AND UPDATING PROCESS-FACTORY RELATION IN REGISTRY ...');
                    registerFactory(0, removedCallActivities, outputContracts, modelInfo, response);
                }
            }
        }
        else {
            console.log('ERROR ', error);
            response.status(400).send(error);
        }
    });
};
let registerFactory = (currentIndex, sortedElements, outputContracts, modelInfo, response) => {
    let entryFactoryName = outputContracts['modelInfo.sol'][`${sortedElements[currentIndex].nodeName}_Factory`];
    let FactoryContract = web3.eth.contract(entryFactoryName.abi);
    FactoryContract.new({ from: web3.eth.accounts[0], data: "0x" + entryFactoryName.evm.bytecode.object, gas: 4700000 }, (errF, contractF) => {
        if (errF) {
            console.log(`ERROR: ${sortedElements[currentIndex].nodeName}_Factory instance creation failed`);
            console.log('RESULT ', errF);
            response.status(400).send(errF);
        }
        else if (contractF.address) {
            console.log(`${sortedElements[currentIndex].nodeName}_Factory running at address ${contractF.address.toString()}`);
            continueFactoryRegistration(currentIndex, sortedElements, outputContracts, contractF, modelInfo, response);
        }
    });
};
let continueFactoryRegistration = (currentIndex, sortedElements, outputContracts, contractF, modelInfo, response) => {
    processRegistryContract.registerFactory(sortedElements[currentIndex].bundleId, contractF.address, {
        from: web3.eth.accounts[0],
        gas: 4700000
    }, (error1, result1) => {
        if (result1) {
            console.log(`${sortedElements[currentIndex].nodeName}_Factory registered SUCCESSFULLY in Process Registry`);
            //console.log(`=======Id of Abstract factory contract ${sortedElements[currentIndex].bundleId}`);
            console.log('....................................................................');
            if (currentIndex + 1 < sortedElements.length) {
                registerFactory(currentIndex + 1, sortedElements, outputContracts, modelInfo, response);
            }
            else {
                console.log('....................................................................');
                console.log('DEPLOYING WORKLIST CONTRACTS AND UPDATING PROCESS REGISTRY ...');
                createWorklistInstances(0, sortedElements, outputContracts, modelInfo, response);
            }
        }
        else {
            console.log('Error ', error1);
            response.status(400).send(error1);
        }
    });
};
let createWorklistInstances = (currentIndex, sortedElements, outputContracts, modelInfo, response) => {    
    let entryWorklistName = `${sortedElements[currentIndex].nodeName}_Worklist`;
    if (outputContracts['modelInfo.sol'][entryWorklistName]) {        
        let WorklistContract = web3.eth.contract(outputContracts['modelInfo.sol'][entryWorklistName].abi);
        WorklistContract.new({ from: web3.eth.accounts[0], data: "0x" + outputContracts['modelInfo.sol'][entryWorklistName].evm.bytecode.object, gas: 6700000 }, (errW, contractW) => {
            if (errW) {
                console.log(`${sortedElements[currentIndex].nodeName}_Worklist instance creation failed`);
                console.log('ERROR: ', errW);
                response.status(400).send(errW);
            }
            else if (contractW.address) {
                //let registryGasWorklist = web3.eth.getTransactionReceipt(contractW.transactionHash).gasUsed;
                console.log(`${sortedElements[currentIndex].nodeName}_Worklist running at address ${contractW.address.toString()}`);
                //console.log('Gas for Worklist contract creation ', registryGasWorklist);
                processRegistryContract.registerWorklist(sortedElements[currentIndex].bundleId, contractW.address, {
                    from: web3.eth.accounts[0],
                    gas: 6500000
                }, (error1, result1) => {
                    if (result1) {
                        console.log(`${sortedElements[currentIndex].nodeName}_Worklist registered SUCCESSFULLY in Process Registry`);
                        console.log('....................................................................');
                        workListInstances.set(sortedElements[currentIndex].bundleId, contractW.address);
                        sortedElements[currentIndex] = {
                            nodeId: sortedElements[currentIndex].nodeId,
                            nodeName: sortedElements[currentIndex].nodeName,
                            bundleId: sortedElements[currentIndex].bundleId,
                            bundleParent: sortedElements[currentIndex].bundleParent,
                            worklist: contractW.address
                        };
                        continueWorklistCreation(currentIndex, sortedElements, outputContracts, modelInfo, response);
                    }
                    else {
                        console.log('ERROR ', error1);
                        response.status(400).send(error1);
                    }
                });
            }
        });
    }
    else {
        continueWorklistCreation(currentIndex, sortedElements, outputContracts, modelInfo, response);
    }
};
let continueWorklistCreation = (currentIndex, sortedElements, outputContracts, modelInfo, response) => {
    if (currentIndex + 1 < sortedElements.length) {
        createWorklistInstances(currentIndex + 1, sortedElements, outputContracts, modelInfo, response);
    }
    else {
        let bundleId = '';
        for (let i = 0; i < sortedElements.length; i++) {
            if (sortedElements[i].nodeName === modelInfo.name) {
                bundleId = sortedElements[i].bundleId;
                break;
            }
        }
        console.log('----------------------------------------------------------------------------------------------');
        response.status(200).send({
            id: bundleId,
            name: modelInfo.name,
            bpmn: modelInfo.bpmn,
            solidity: modelInfo.solidity
        });
    }
};
/////////////////////////////////////////////////////////////////////
let instanceStateFor = (currentIndex, nestedContracts, bpmnModel, workitems, serviceTasks, res) => {
    let contractAddress = nestedContracts[currentIndex];
    let bundleId = web3.toAscii(processRegistryContract.bundleFor.call(contractAddress)).toString().substr(0, 24);
    procModelData_1.repoSchema.find({ _id: bundleId }, (err, repoData) => {
        if (err) {
            console.log('ERROR ', err);
            return [];
        }
        else {
            
            let contractModel = web3.eth.contract(JSON.parse(repoData[0].abi));
            let contractInstance = contractModel.at(contractAddress);                
            let worklistAddress = contractInstance.getWorklistAddress.call();            
            //console.log('WorklistAddress ====', worklistAddress);
            let worklistInstance;
            if (worklistAddress.toString() !== '0x0000000000000000000000000000000000000000')                
                worklistInstance = web3.eth.contract(JSON.parse(repoData[0].worklistAbi)).at(worklistAddress);
            //console.log(workitems.length);
            let dictionary = repoData[0].indexToElement;
            let startedActivities = contractInstance.startedActivities.call().toString(2).split('').reverse();
            //console.log(startedActivities);
            for (let index = 0; index < startedActivities.length; index++) {
                //console.log(dictionary[index]);
                if (startedActivities[index] === '1' || (dictionary[index] && dictionary[index].type === 'EventTime')) {
                    if (dictionary[index].type === 'Workitem' || dictionary[index].type === 'EventTime') {
                        let reqInd = worklistInstance.workItemsFor.call(index, contractAddress).toString(2).split('').reverse();
                        
                        for (let i = 0; i < reqInd.length; i++) {
                            if (reqInd[i] === '1' && taskLeadbyTimer.indexOf(dictionary[index].id) <0 ) {                            
                                let notFound = true;
                                for (let j = 0; j < workitems.length; j++) {
                                    if (workitems[j].elementId === dictionary[index].id && workitems[j].bundleId === bundleId) {
                                        workitems[j].hrefs.push(`/workitems/${worklistAddress}/${i}`);
                                        workitems[j].pCases.push(worklistInstance.processInstanceFor.call(i));
                                        notFound = false;
                                        break;
                                    }
                                }
                                if (notFound) {
                                    workitems.push({
                                        elementId: dictionary[index].id,
                                        elementName: dictionary[index].name,
                                        input: findParameters(repoData[0].worklistAbi, dictionary[index].name),
                                        bundleId: bundleId,
                                        processAddress: contractAddress,
                                        pCases: [contractAddress],
                                        hrefs: [`/workitems/${worklistAddress}/${i}`]
                                    });
                                }
                            }
                            else if (reqInd[i] === '1' && taskLeadbyTimer.indexOf(dictionary[index].id) >=0 ) {
                                let notFound = true;
                                for (let j = 0; j < workitems.length; j++) {
                                    if (workitems[j].elementId === dictionary[index].id && workitems[j].bundleId === bundleId) {
                                        workitems[j].hrefs.push(`/workitems/${worklistAddress}/${i}`);
                                        workitems[j].pCases.push(worklistInstance.processInstanceFor.call(i));
                                        notFound = false;
                                        break;
                                    }
                                }
                                if (notFound) {
                                    if (!LeadTimerNodeCompleted.get(dictionary[index].id)) {                                    
                                    workitems.push({
                                        elementId: dictionary[index].id,
                                        elementName: dictionary[index].name,
                                        input: findParameters(repoData[0].worklistAbi, timerCheckFunctionName),
                                        bundleId: bundleId,
                                        processAddress: contractAddress,
                                        pCases: [contractAddress],
                                        hrefs: [`/workitems/${worklistAddress}/${i}`]
                                    });
                                    break;
                                    } else {
                                        workitems.push({
                                            elementId: dictionary[index].id,
                                            elementName: dictionary[index].name,
                                            input: findParameters(repoData[0].worklistAbi, dictionary[index].name),
                                            bundleId: bundleId,
                                            processAddress: contractAddress,
                                            pCases: [contractAddress],
                                            hrefs: [`/workitems/${worklistAddress}/${i}`]
                                        });  
                                    }
                                }
                            }
                            else if ((reqInd[i] === '0') && dictionary[index].type === 'EventTime') {
                                let notFound = true;
                                for (let j = 0; j < workitems.length; j++) {
                                    if (workitems[j].elementId === dictionary[index].id && workitems[j].bundleId === bundleId) {
                                        workitems[j].hrefs.push(`/workitems/${worklistAddress}/${i}`);
                                        workitems[j].pCases.push(worklistInstance.processInstanceFor.call(i));
                                        notFound = false;
                                        break;
                                    }
                                }
                                if (notFound) {
                                    workitems.push({
                                        elementId: dictionary[index].id,
                                        elementName: dictionary[index].name,
                                        input: findParameters(repoData[0].worklistAbi, handlingTimerEvent),
                                        bundleId: bundleId,
                                        processAddress: contractAddress,
                                        pCases: [contractAddress],
                                        hrefs: [`/workitems/${worklistAddress}/${i}`]
                                    });
                                }
                            }
                        }
                    }
                    else if (dictionary[index].type === 'Service') {
                        // PENDING
                    }
                    else if (dictionary[index].type === 'Separate-Instance') {
                        let startedInstances = contractInstance.startedInstanceIndexFor.call(index).toString(2).split('').reverse();
                        let allInstances = contractInstance.allInstanceAddresses.call();
                        for (let i = 0; i < startedInstances.length; i++)
                            if (startedInstances[i] === '1')
                                nestedContracts.push(allInstances[i]);
                    }
                }
                
            }
            if (currentIndex + 1 < nestedContracts.length)
                instanceStateFor(currentIndex + 1, nestedContracts, bpmnModel, workitems, serviceTasks, res);
            else {
                if (workitems.length == 0 && serviceTasks.length == 0)
                    console.log('No started elements ...');
                else {
                    workitems.forEach(elem => {
                        console.log("Element ID: ", elem.elementId);
                        console.log("Element Name: ", elem.elementName);
                        console.log("Input Parameters: ", elem.input);
                        console.log("bundleId: ", elem.bundleId);
                        console.log("pCases: ", elem.pCases);
                        console.log("hrefs: ", elem.hrefs);
                        console.log("...............................................................");
                    });
                }
                console.log('----------------------------------------------------------------------------------------------');
                res.status(200).send({ bpmn: bpmnModel, workitems: workitems, serviceTasks: serviceTasks });
            }
        }
    });
};
let findParameters = (contractAbi, functionName) => {
    let jsonAbi = JSON.parse(contractAbi);
    let candidates = [];
    jsonAbi.forEach(element => {
        if (element.name === functionName) {
            candidates = element.inputs;
        }
    });
    let res = [];
    candidates.forEach(element => {
        if (element.name && element.name !== 'workitemId')
            res.push(element);
    });
    return res;
};

function saveTransactionRepo(result, repoSchemaData, functionName) {
    // Saving transaction inside repo
    let numberBlock = web3.eth.getTransactionReceipt(result).blockNumber;
    let timeOfBlock = web3.eth.getBlock(numberBlock).timestamp;
    let txTime = new Date(timeOfBlock * 1000).toLocaleString();
    procModelData_5.repoTxSchema.create({
        rootProcessID: repoSchemaData[0]._id.toString(),
        transactionName: functionName,
        transactionHash: result,
        blockNumber: numberBlock.toString(),
        timeExecution: txTime,
    }, (err, repoTxData) => {
        if (err) {
            console.log('Error - Unable to save transaction inside repository ', err);
        }
        else {
            let idTxAsString = repoTxData._id.toString();
            //repoSchemaData[0].txIDList.push(repoTxData._id.toString());
            procModelData_1.repoSchema.findOneAndUpdate(
                { _id: repoSchemaData[0]._id }, 
                { $push: { txIDList: idTxAsString  } },
               function (error, success) {
                     if (error) {
                         console.log('Error occures while updating tx ID list: ',error);
                     } else {
                         console.log('Successfull operation while updating tx ID list: ',idTxAsString);
                     }
                 });

            console.log(`Transaction of ${functionName} updated in repository with id ${idTxAsString}`);

        }
    });
}


async function outputTransactionRepo (idTx) {   
   
    try {
        let outputTx = [];
        /* return new Promise( (resolve, reject) => {
            procModelData_5.repoTxSchema.find({_id: idTx}, (err, repoTxData) => {
                 if (err) {
                    return reject(err);
                 }                 
                 outputTx.push({
                    txID : idTx,
                    transactionHash : repoTxData[0].transactionHash,
                    transactionName : repoTxData[0].transactionName,
                    blockNo : repoTxData[0].blockNumber,            
                    timeExecution : repoTxData[0].timeExecution 
                 });
                 resolve(outputTx);
             });
         }); */


    // try {
    const transactionDetails = await procModelData_5.repoTxSchema.findOne({_id:idTx}).lean();;
    //transactionDetails.map(tx => tx.timeExecution).sort();
    //console.log(transactionDetails);
  if (transactionDetails !=null) {
        // let outputTx = [];
        // let txName = transactionDetails[0].transactionName;
        // let txBlockNumber = transactionDetails[0].blockNumber;
        // let txTimeExecution = transactionDetails[0].timeExecution; 
        //outputTx.push([idTx, repoTxData[0].transactionHash, txName, parentProcessName, txBlockNumber, txTimeExecution]);          
        outputTx.push({                
            txID : idTx,
            transactionHash : transactionDetails.transactionHash,
            transactionName : transactionDetails.transactionName,
            blockNo : transactionDetails.blockNumber,            
            timeExecution : transactionDetails.timeExecution
        });
        return  outputTx;
        
    }
    else {
            console.log("Error: Transaction NOT Found");
            console.log('----------------------------------------------------------------------------------------------');
            //res.status(400).send('Transaction NOT Found');
            return [];
        }
      

    } catch(err) {
            console.log("Error : Transaction NOT Found");
            console.log(err);         
            console.log('----------------------------------------------------------------------------------------------');
            return;
        }
        
    
    //return myList;
}
function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
async function fillProcessList(idTxList) {
    let resultList = [];
    try {
        for await (const idTx of idTxList) {
           // console.log(idTx);
            let outputTx =  await outputTransactionRepo(idTx);            
            resultList.push(outputTx);
        };
        /* const promises = idTxList.map(outputTransactionRepo);
        resultList = await Promise.all(promises)
        console.log(`All async tasks complete!`) */
        return resultList; 
      } catch (err) {
          console.log ('Error while filing process List '+err);
        // Do something about the error.
        return [];
      }
    
    
        
 }

function checkTransactionRepo(idTx) {
    let txIdExist = false;
    
    procModelData_5.repoTxSchema.find({_id: idTx}, (err, repoTxData) => {
        if (!err && repoTxData && repoTxData.length > 0) {            
            console.log(`Success: Transaction ${idTx} Found inside repositor`);
            txIdExist = true;
        }
        else {
            console.log("Error: Transaction NOT Found inside repository "+err);
            console.log('----------------------------------------------------------------------------------------------');
            
        }
    });
    return txIdExist;
}

exports.default = models;
//# sourceMappingURL=models.controller.js.map