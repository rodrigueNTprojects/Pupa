import * as mongoose from 'mongoose';

export let repoSchema = mongoose.model('ProcessRepo', {
  rootProcessID: String,
  rootProcessName: String,
  bpmnModel: String,
  solidityCode: String,
  abi: String,
  bytecode: String,
  indexToElement: [mongoose.Schema.Types.Mixed],
  worklistAbi: String,
  txIDList: [String],
});

export let registrySchema = mongoose.model('RegistryRepo', {
  address: String,
  solidityCode: String,
  abi: String,
  bytecode: String,
});

export let policySchema = mongoose.model('PolicyRepo', {
  address: String,
  model: String,
  solidityCode: String,
  abi: String,
  bytecode: String,
  indexToRole: [String],
  accessControlAbi: String,
  accessControlBytecode: String,
});

export let roleTaskSchema = mongoose.model('RoleTaskRepo', {
  address: String,
  solidityCode: String,
  abi: String,
  bytecode: String,
});

export let repoTxSchema = mongoose.model('TransactionRepo', {
  rootProcessID: String,
  transactionName: String,
  transactionHash: String,
  blockNumber: String,
  timeExecution: String,  
});
