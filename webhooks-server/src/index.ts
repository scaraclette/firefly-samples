import express from 'express';
import {Request, Response} from 'express';
import { FireFly } from './firefly';
import { SubscribeFireflyPost } from './types/firefly';
const app = express();
const port = 8080;
const firefly1 = new FireFly(5000);

app.use(express.json());


// TODO: Potential save subscription name and ids to map


app.get('/', (req: any, res) => {
    // TODO: go to different endpoints
    res.send('HOME');
});

// TODO: endpoint to subscribe to firefly
// Takes in name and designates it to URL 
app.post('/subscribe-firefly', async (req: Request, res: Response) => {
    // TODO: accept subscription name to subscribe
    let requestBody: SubscribeFireflyPost = req.body;
    console.log(requestBody);

    // Send subscription request
    let subscribe = await firefly1.subscribeWebhook(requestBody);
    console.log(subscribe);

    res.sendStatus(200);
});

// TODO: endpoint to unsubscribe to firefly
app.post('/unsubscribe-firefly', (req: any, res) => {
    // Accept subscription name
    // TODO: delete with endpoint /
});

// TODO: endpoint to register webhook URI
app.post('/webhook-firefly', (req: any, res) => {

});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});