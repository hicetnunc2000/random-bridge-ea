require('dotenv').config();

const { Validator } = require('@chainlink/external-adapter')
const { tezosOperator } = require('./tezosOperator')
const axios = require('axios')
const bigInt = require('big-integer')

const customParams = {}

const crossChain = async (input, callback) => {

    // initialize validator

    const validator = new Validator(callback, input, customParams)
    const jobRunId = validator.validated.id

    // verify runlog requests?

    // latest round from drand.love

    await axios.get('https://api.drand.sh/public/latest')
        .then(res => {

            tezosOperator(bigInt(res.data.randomness, 16).toString())

        })

    callback(200, {
        "jobRunID": jobRunId,
        "data": ""
    })

}

module.exports.random_bridge = (event, context, callback) => {
    crossChain(JSON.parse(event.body), (statusCode, data) => {
        callback(null, {
            statusCode: statusCode,
            body: JSON.stringify(data),
            isBase64Encoded: false
        })
    })
}

