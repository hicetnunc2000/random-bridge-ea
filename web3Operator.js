require('dotenv').config();

// load web3 dependencies

const Web3 = require('web3')
const BigNumber = require('big-number')

const { vrf_abi } = require('./abi')

// load web3 constants

const vrf_address = process.env.VRF_SOL_ADDRESS // 0xa267a7bc091af818fff5c792a8f23766af21946d
const web3 = new Web3(process.env.INFURA_NODE);

const signer = web3.eth.accounts.privateKeyToAccount(process.env.ETHEREUM_PRIVATE_KEY)

web3.eth.accounts.wallet.add(signer);

console.log([signer, vrf_address])

const vrf = new web3.eth.Contract(vrf_abi, vrf_address)

const web3Operator = async (drand, tz) => {

    const vrf_tx = vrf.methods.getRandomNumber(drand)

    await vrf_tx.send({

        from: signer.address,
        gas: await vrf_tx.estimateGas(),

    }).once('transactionHash', async txhash => {

        console.log(`VRF operation ...`);
        console.log(txhash);

        await vrf.methods.randomResult().call().then(async res => {

            await tz(res)
            //calls tz
        }
        )
    });

}

module.exports = { web3Operator }