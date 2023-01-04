const express = require('express');
const app = express();
const {logger} = require("./logger");
const _ = require('lodash')
require('dotenv').config();
const cors = require('cors');
process.title = 'simple_service_mesh_recommendations'

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());
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
const food = ['Cheese', 'Fruit', 'Nuts', 'Pastry'];
const clothes = ['Shoes', 'Shirts', 'Socks', 'Cool Hats'];
const music = ['Rolling Stones', 'Beatles', 'Foo Fighters', 'Temptations'];

const foodRec = `Buy some more excellent ${_.sample(food)}`;
const clothesRec = `Buy some more ${_.sample(clothes)}`;
const musicRec = `Buy another album by ${_.sample(music)}`;

const category = process.env.RECOMMENDATION_CATEGORY || 'general';

const getRecommendation = () =>{
    const rec = {category: 'general', recommendation: `Buy more of something, anything!` }
    switch (category.toLowerCase()) {
        case 'general':
            return rec;
        case 'food':
            return {category: category.toLowerCase(), recommendation: foodRec};
        case 'clothes':
            return {category: category.toLowerCase(), recommendation: clothesRec};
        case 'music':
            return {category: category.toLowerCase(), recommendation: musicRec};
}
}

app.get('/', async(req, res) => {
    res.status(200).send(getRecommendation());
});

app.get('/', async(req, res) => {
    res.status(200).send({message: 'Hello from Recommendations'});
});

server = app.listen(port, () => {
    logger.info(`Recommendation service is running on port ${port} at ${new Date()}`);
});

const shutdown = () => {
    server.close()
}

module.exports = {server, shutdown};
