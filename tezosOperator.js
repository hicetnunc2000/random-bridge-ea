require('dotenv').config();

// loads tezos client dependencies

const {
    registerFetch,
    registerLogger,
    Signer,
    TezosMessageUtils,
    TezosConseilClient,
    OperationKindType,
    TezosNodeReader,
    TezosNodeWriter,
    TezosParameterFormat
  } = require('conseiljs')
  
  const {
    KeyStoreUtils,
    SoftSigner
  } = require('conseiljs-softsigner')
  
  const fetch = require('node-fetch')
  const log = require('loglevel')
  const logger = log.getLogger('conseiljs')

// initialize logger

logger.setLevel('debug', false)
registerLogger(logger)
registerFetch(fetch)

// initialize tezos client variables

const tezosNode = process.env.TEZOS_NODE
const conseilServer = { url: process.env.CONSEIL_SERVER, apiKey: process.env.API_KEY, network: process.env.NETWORK }
const networkBlockTime = 30 + 1
const address = process.env.KT_ADDRESS

function clearRPCOperationGroupHash(hash) {
  return hash.replace(/\"/g, '').replace(/\n/, '');
}

// tezos operator

const tezosOperator = async (seed) => {
      
    // michelson parameter

    let parameter = `(Right "${seed}")`
    
    const keystore = await KeyStoreUtils.restoreIdentityFromSecretKey(process.env.SECRET_KEY)
    const signer = await SoftSigner.createSigner(TezosMessageUtils.writeKeyWithHint(keystore.secretKey, 'edsk'), -1)

    console.log(`~~ invokeContract`)
    const fee = Number((await TezosConseilClient.getFeeStatistics(conseilServer, conseilServer.network, OperationKindType.Transaction))[0]['high'])
    console.log(fee)
    let storageResult = await TezosNodeReader.getContractStorage(tezosNode, address)
    console.log(`~~ initial storage: ${JSON.stringify(storageResult)}`)

    const { gas, storageCost } = await TezosNodeWriter.testContractInvocationOperation(tezosNode, 'main', keystore, address, 10000, fee, 1000, 100000, '', parameter, TezosParameterFormat.Michelson)
    console.log(storageCost)
    const freight = storageCost
    console.log(`~~ cost: ${JSON.stringify(await TezosNodeWriter.testContractInvocationOperation(tezosNode, 'main', keystore, address, 10000, fee, 1000, 100000, '', parameter, TezosParameterFormat.Michelson))}`)
    const nodeResult = await TezosNodeWriter.sendContractInvocationOperation(tezosNode, signer, keystore, address, 0, fee, 1000, 100000, '', parameter, TezosParameterFormat.Michelson)

    const groupid = clearRPCOperationGroupHash(nodeResult.operationGroupID)
    console.log(`~~ Injected transaction(invocation) operation with ${groupid}`)

    return groupid

    // reference from cyptonomic/conseiljs lab

}

module.exports = { tezosOperator }

