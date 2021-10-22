import express from 'express';
import {Request, Response} from 'express';
import { FireFly } from './firefly';

const app= express();
const port = 8080;

const firefly1: FireFly = new FireFly(5000);
const subscriptionName: String = 'webhook_server_subscription';

app.use(express.json());

app.get('/', (req: any, res) => {
    res.send('Endpoints\nGET /subscribe-firefly\nGET /unsubscribe-firefly\nPOST /webhook-firefly');
});

// Endpoint to subscribe to firefly
app.get('/subscribe-firefly', async (req: Request, res: Response) => {
    let subscribe = await firefly1.subscribeWebhook(subscriptionName);
    if (subscribe === undefined) {
        res.status(500).send('Error occurred or subscription already created!');
        return;
    }
    
    res.status(200).send(`Subscription created!`);
});

// Endpoint to unsubscribe to firefly
app.get('/unsubscribe-firefly', async (req: Request, res: Response) => {
    // Get subscription list
    let subscriptionList = await firefly1.getSubscriptions();
    if (subscriptionList === undefined) {
        res.status(500).send("Error getting subscription list");
        return;
    }

    // Find subscription
    let subscription = subscriptionList.find((obj: { name: string; }) => obj.name === subscriptionName);
    if (subscription === undefined) {
        res.status(404).send(`Subscription ${subscriptionName} was never created!`);
        return;
    }

    // Unsubscribe from the subscription ID
    await firefly1.unsubscribeWebhook(subscription["id"]);

    res.status(200).send(`Successfuly unsubscribed ${subscriptionName}`);
});

// Endpoint to receive firefly webhook
app.post('/webhook-firefly', (req: Request, res: Response) => {
    console.log(req.body);
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});