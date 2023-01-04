'use strict';
const supertest = require('supertest');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;
const {logger} = require("../logger");
const {server, shutdown} = require('../index');
const fs = require("fs");
const path = require("path");

describe('API Tests: ', () => {
    after(() => {
        shutdown();
    });
    beforeEach( async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("----------------------");
    });

    const changeEnvFile = async(category) => {
        setTimeout(async () => {
            await fs.promises.writeFile(path.resolve(__dirname, '../.env'), `RECOMMENDATION_CATEGORY=${category.toUpperCase()}`)
                .catch(e => {
                    logger.error(e.message)
                    throw e;
                });
        }, 1000);
    };


    it('Can access GET food rec', async () => {
        await changeEnvFile('food');
        await supertest(server)
            .get('/')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body).to.be.an('object');
                expect(res.body.category).to.eq('food');
                console.log(res.body);
            })
    });

});
