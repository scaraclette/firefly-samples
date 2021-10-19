import express from 'express';
import {Request, Response} from 'express';
import { FireFly } from './firefly';
const app = express();
const port = 8080;
const firefly1 = new FireFly(5000);

app.use(express.json());


app.get('/', (req: any, res) => {
    // TODO: go to different endpoints
    res.send('Endpoints\nGET /subscribe-firefly\nGET /unsubscribe-firefly\nPOST /webhook-firefly');
});

// TODO: endpoint to subscribe to firefly
// Takes in name and designates it to URL 
app.get('/subscribe-firefly', async (req: Request, res: Response) => {
    // Subscribe to firefly
    let subscribe = await firefly1.subscribeWebhook();
    if (subscribe === undefined) {
        res.status(500).send("Subscription already created!");
        return;
    }
    console.log(`New subscription created: ${JSON.stringify(subscribe, null, 2)}`);
    res.status(200).send("Subscription created!");
});

// TODO: endpoint to unsubscribe to firefly
app.get('/unsubscribe-firefly', async (req: Request, res: Response) => {
    // Get subscription list
    let subscriptionList = await firefly1.getSubscriptions();
    if (subscriptionList === undefined) {
        res.status(500).send("Error getting subscription list");
        return;
    }
    console.log(`Subscription list: ${JSON.stringify(subscriptionList, null, 2)}`);

    let toUnsubscribe = subscriptionList.find((obj: { name: string; }) => obj.name === "test_1");
    if (toUnsubscribe === undefined) {
        res.status(404).send("No subscription created!");
        return;
    }
    // TODO
    console.log(`Subscription to remove: ${JSON.stringify(toUnsubscribe, null, 2)}`);

    res.status(200).send("TODO: unsubscribe");
});

// TODO: endpoint to register webhook URI
app.post('/webhook-firefly', (req: Request, res: Response) => {
    console.log(req.body);
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});