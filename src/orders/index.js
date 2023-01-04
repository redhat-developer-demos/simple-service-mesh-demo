const express = require('express');
const app = express();
const {logger} = require("./logger");
const _ = require('lodash')
const axios = require("axios");
const https = require("https");
const {v4: uuidv4} = require('uuid');
require('dotenv').config();
const cors = require('cors');
process.title = 'simple_service_mesh_orders'

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors());

const orders = [];

//Get URLs of external services

const validateService = async (service, url) => {
    const response = await axios.get(url)
        .then(function (response) {
            console.log(response);
            return response.status;
        })
        .catch(function (error) {
            //console.log(error);
            throw new Error(`${service} is not active. Error message: ${error.message}`);
        })
}

if (!process.env.PAYMENTS_URL) throw new Error('No value defined for the required environment variable PAYMENTS_URL');
if (!process.env.RECOMMENDATIONS_URL) throw new Error('No value defined for the required environment variable RECOMMENDATIONS_URL');

validateService('Payments', process.env.PAYMENTS_URL);
validateService('Recommendations', process.env.RECOMMENDATIONS_URL);

const port = process.env.SERVER_PORT || 8080;
/**
 * Converts the request.rawHeaders array into a JSON object
 *
 * @param arr
 * @returns {{}} a JSON object that reports the raw header information
 * in the request
 */
const parseRawHeader = (arr) => {
    let obj = {};
    let currentKey = '';
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 == 0) {
            //this is the key
            currentKey = arr[i];
            obj[currentKey] = '';
        } else {
            obj[currentKey] = arr[i]
        }
    }
    return obj;
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    const rawHeadersJson = parseRawHeader(req.rawHeaders);
    logger.info(JSON.stringify({requestInfo: rawHeadersJson}));
    next();
});

app.get('/:id', async (req, res) => {
    let order = _.find(orders, (obj) => {
        if (obj.id === req.params.id) return true;
    });
    res.status(200).send(order);
});

app.get('/', async (req, res) => {
    res.status(200).send(orders);
});

const validatePostData = (data) => {
    const errors = [];
    if(!data.creditCard) errors.push("Missing credit card data\n");
    if(!data.product) errors.push("Missing product data\n");
    if(!data.customer) errors.push("Missing customer data\n");

    if(errors.length > 0){
        throw new Error(`There are problems with the order's data: ${JSON.stringify(errors)}`)
    }
}
app.post('/', async (req, res) => {
    const data = req.body;
    try {
        validatePostData(data);
    } catch (e) {
        res.status(422).send({status: 422, message: e.message});
        return;
    }

    //post to payments
    const config = {timeout: 5000};
    const paymentResult = await axios.post(process.env.PAYMENTS_URL, data,config )
        .catch(e => {
            logger.error(e.message)
        });
    // get recommendation
    const recommendation = await axios.get(process.env.RECOMMENDATIONS_URL)
        .catch(e => {
            logger.error(e.message)
        });
    let result = {};
    try {
        result = {payment: paymentResult.data.payment, recommendation: recommendation.data}
    } catch (e) {
        logger.error(e.message);
        res.status(500).send({status: 500, message: e});
        return;
    }
    result.id = uuidv4();
    orders.push(result);
    logger.info(`Posting ${JSON.stringify(result)}`);
    res.status(200).send({status: 200, order: result});
});

server = app.listen(port, () => {
    logger.info(`Payments service is running on port ${port} at ${new Date()}`);
});

const shutdown = () => {
    server.close()
}

module.exports = {server, shutdown};
