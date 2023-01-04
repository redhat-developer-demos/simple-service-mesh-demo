# Payments

## Environment Variables

`SERVER_PORT`, the port on which the service listens for request. Defaults to 8080, if not set.

`PAYMENTS_URL`, URL that describes the location of the **Payments** service on the network. This service will error and not start when the environment variable is not set.

`RECOMMENDATIONS_URL`, URL that describes the location of the **Recommendations** service on the network. This service will error and not start when the environment variable is not set.


## Submission Example

```json
{
  "customer": {
    "id": 3,
    "firstName": "Aglae",
    "lastName": "Heller",
    "email": "Aglae_Heller38@gmail.com"
  },
  "product": {
    "id": 2,
    "category": "Food",
    "description": "Brie Cheese",
    "price": 39.99
  },
  "creditCard": {
    "number": "6767-8196-4877-7940-326",
    "expirationDate": "2023-09-08T01:14:59.686Z",
    "cvv": "851",
    "cardHolder": {
      "id": 3,
      "firstName": "Aglae",
      "lastName": "Heller",
      "email": "Aglae_Heller38@gmail.com"
    }
  },
  "purchaseDate": 1669844628249
}
```
## Response

```json
{
  "customer": {
    "id": 4,
    "firstName": "Nancy",
    "lastName": "Nice",
    "email": "nancy.nice@meshymesh.io"
  },
  "product": {
    "id": 2,
    "category": "Food",
    "description": "Brie Cheese",
    "price": 39.99
  },
  "purchaseDate": 1669391851363,
  "id": "158dfbf8-30ba-4729-86c6-36138f1d62da"
}
```
