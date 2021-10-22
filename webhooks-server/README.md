# Webhook Subscription Example

This sample contains a simple server to receive webhooks messages.

## Setup
To run the application, you will require a 2-party FireFly system running
locally on ports 5000-5001. The easiest way to set this up is with the
[FireFly CLI](https://github.com/hyperledger/firefly-cli):

```
ff init data-transfer 2
ff start data-transfer
```

## Running
Once the Firefly stack is ready, setup and run the server with:
```
npm install
npm start
```

## Server Endpoints
For this server, the webhook subscription is called `firefly_webhook_subscription`. Subscriptions can be created or deleted by calling this server's endpoints. 

For server to subscribe to Firefly, run the following curl command:
```
curl --location --request GET 'http://localhost:8080/subscribe-firefly'
```

For server to unsubscribe to Firefly, run the following curl command:
```
curl --location --request GET 'http://localhost:8080/unsubscribe-firefly'
```

## Testing Webhooks
When the server create a webhook subscription, any broadcasted message to the default namespaces gets sent to this server's `/webhook-firefly` endpoint.

Test the webhook by creating a broadcast message from one of the nodes after a subscription is created.
An example is the following curl command:
```
curl --location --request POST 'http://localhost:5000/api/v1/namespaces/default/messages/broadcast' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": [
        {"value":"Some value 1"},
        {"value":"Some value 2"}
    ]
}'
```
The expected behavior would be the data getting broadcast will also be sent to the registered webhook endpoint.