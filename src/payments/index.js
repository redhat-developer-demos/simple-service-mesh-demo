const express = require('express');
const app = express();
const {logger} = require("./logger");
const _ = require('lodash')
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
require('dotenv').config();
process.title = 'simple_service_mesh_payments'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());
const payments = [];
/**
 * Converts the request.rawHeaders array into a JSON object
 *
 * @param arr
 * @returns {{}} a JSON object that reports the raw header information
 * in the request
 */
const parseRawHeader = (arr)=> {
    let obj = {};
    let currentKey='';
    for(let i=0; i < arr.length; i++){
        if (i % 2 == 0){
            //this is the key
            currentKey = arr[i];
            obj[currentKey]='';
        }else
        {
            obj[currentKey]=arr[i]
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

const port = process.env.SERVER_PORT || 8080;


app.get('/:id', async(req, res) => {
    let payment = _.find(payments, (obj) => {
        if (obj.id === req.params.id )return true;
    });
    res.status(200).send(payment);
});

app.get('/', async(req, res) => {
    res.status(200).send(payments);
});

/**
 * Poor man's data validation. If only I had more time...
 * @param data
 */
const validatePostData = (data) => {
    logger.info(`validating ${JSON.stringify(data)}`)
    const errors = [];
    if(!data.creditCard) errors.push("Missing credit card data");
    if(!data.product) errors.push("Missing product data");
    if(!data.customer) errors.push("Missing customer data");

    if(errors.length > 0){
        throw new Error(`There are problems with the order's data: ${JSON.stringify(errors)}`)
    }
}

app.post('/', async(req, res) => {
    const data = req.body;
    try {
        validatePostData(data);
    } catch (e) {
        res.status(422).send({status: 422, message: e.message, data: JSON.stringify(data) });
        return;
    }
    data.id = uuidv4();
    data.creditCard.authorizationCode = uuidv4();
    payments.push(data);
    logger.info(`Posting ${JSON.stringify(data)}`);

    res.status(200).send({status: 200, payment: data});
});

server = app.listen(port, () => {
    logger.info(`Payments service is running on port ${port} at ${new Date()}`);
});

const shutdown = () => {
    server.close()
}

module.exports = {server, shutdown};
