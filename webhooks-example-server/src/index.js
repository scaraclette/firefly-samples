const express = require('express')
const app = express()
const axios = require('axios');
const port = 3000
// const bodyParser = require('body-parser');
app.use(express.json())

console.log('Set up subscription TODO!');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
    console.log(req);
    console.log(res);

    res.send('POST request to homepage');
})

app.post('/firefly-webhooks', (req, res) => {
    // Setup subscription
    // axios.post(`http://localhost:5000/api/v1/namespaces/default/subscriptions`, {
    //     "transport": "webhooks",
    //     "name": "subscription_1",
    //     "options": {
    //         "url": "http://host.docker.internal:3000/firefly-webhook"
    //     }
    // }).then(response=> {res.send(response)});

    // 
    console.log('got a broadcast!!!');
    console.log({requestBody: req.body});
    // console.log(req);
    // console.log(req.body);
    // console.log(res)
    res.sendStatus(200);
})

console.log('here...');

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  axios.post(`http://localhost:5000/api/v1/namespaces/default/subscriptions`, {
        "transport": "webhooks",
        "name": "random_2",
        "options": {
            "url": "http://localhost:3000/firefly-webhooks"
        }
    }).then(response=> {console.log(response)});
})