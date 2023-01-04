'use strict';
const supertest = require('supertest');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;
const _ = require('lodash')
const {faker} = require('@faker-js/faker');

const {server,shutdown} = require('../index');

const getProducts = () =>{
    const products = [];
    let id = 1;
    let category = 'Music';
    let description = 'The Greatest Hits of Beethoven';
    let price = 9.99;
    products.push({id, category, description, price});

    id = 2;
    category = 'Food';
    description = 'Brie Cheese';
    price = 39.99;
    products.push({id, category, description, price});

    id = 2;
    category = 'Clothes';
    description = 'Silk Pajamas';
    price = 159.99;
    products.push({id, category, description, price});

    return products;
}

const getCustomers = () =>{
    const customers = [];
    let id = 1;
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let email = faker.internet.email(firstName,lastName);
    customers.push({id, firstName, lastName, email});

    id = 2;
    firstName = faker.name.firstName();
    lastName = faker.name.lastName();
    email = faker.internet.email(firstName,lastName);
    customers.push({id, firstName, lastName, email});

    id = 3;
    firstName = faker.name.firstName();
    lastName = faker.name.lastName();
    email = faker.internet.email(firstName,lastName);
    customers.push({id, firstName, lastName, email});

    id = 4;
    firstName = faker.name.firstName();
    lastName = faker.name.lastName();
    email = faker.internet.email(firstName,lastName);
    customers.push({id, firstName, lastName, email});

    return customers;
}

const getCreditCard = (customer) => {
    return {
        number: faker.finance.creditCardNumber(),
        expirationDate: faker.date.future(3),
        cvv: faker.finance.creditCardCVV(),
        cardHolder: customer
    };
}

const getOrder = () => {
    const product = _.sample(getProducts());
    const customer = _.sample(getCustomers());
    const creditCard = getCreditCard(customer)
    const purchaseDate = Date.now();

    return {customer, product, creditCard, purchaseDate}
}

describe('Orders Tests: ', () => {
    after( () => {
        shutdown();
    });

    it('Can access GET items', async () => {
        for (let i = 0; i < 10; i++) {
            const order = getOrder();
            await supertest(server)
                .post('/')
                .set('Accept', 'application/json')
                .send(order)
                .then((res) => {
                    console.log(res)
                })
        }
        await supertest(server)
            .get(`/`)
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.eq(10)
                console.log(res.body);
            });
    });

    it('Can access GET item by id', async () => {
        const payloads = []
        for(let i = 0; i<10;i++){
            const payload = getOrder();
            await supertest(server)
                .post('/')
                .set('Accept', 'application/json')
                .send(payload)
                .then((res) => {
                    console.log(res.body);
                    payloads.push(res.body)
                })
        }
        const data  = _.sample(payloads)

        await supertest(server)
            .get(`/${data.order.id}`)
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body).to.be.an('object');
                expect(res.body.id).to.be.eq(data.order.id);
                console.log(res.body);
            })

    });

    it('Can access POST item', async () => {
        const payload = getOrder();
        await supertest(server)
            .post('/')
            .set('Accept', 'application/json')
            .send(payload)
            .then((res) => {
                expect(res.body).to.be.an('object');
                expect(res.body.order.payment.customer.firstName).to.eq(payload.customer.firstName);
                expect(res.body.order.payment.product.description).to.eq(payload.product.description);
                expect(res.body.order.id).to.be.a('string');
                expect(res.body.order.recommendation).to.be.an('object');
                expect(res.body.status).to.eq(200);
                console.log(res.body);
            })
    });
});
