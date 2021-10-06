import express from "express";
const app = express();
const port = 8080;

app.use(express.json());

// TODO: Potential save subscription name and ids to map

app.get('/', (req, res) => {
    // TODO: go to different endpoints
});

// TODO: endpoint to subscribe to firefly
// Takes in name and designates it to URL 
app.post('/subscribe-firefly', (req, res) => {
    // TODO: accept subscription name to subscribe
});

// TODO: endpoint to unsubscribe to firefly
app.post('/unsubscribe-firefly', (req, res) => {
    // Accept subscription name
});

// TODO: endpoint to register webhook URI
app.post('/webhook-firefly', (req, res) => {

});

app.listen(port, () => {

});