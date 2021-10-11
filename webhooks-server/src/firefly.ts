import axios, { AxiosInstance } from "axios";
import { SubscribeFireflyPost, SubscribeFireflyEndpoint } from "./types/firefly";

export class FireFly {
    private rest: AxiosInstance;
    private url: String = 'http://localhost:8080/webhook-firefly';
    private transport: String = 'webhooks';

    constructor(port: number) {
        this.rest = axios.create({ baseURL: `http://localhost:${port}/api/v1` });
    }

    async subscribeWebhook(data: SubscribeFireflyPost): Promise<any> {
        let namespace = data.namespace ?? 'default';
        let subscriptionInformation: SubscribeFireflyEndpoint = {
            name: data.subscriptionName,
            options: {
                url: this.url
            },
            transport: this.transport
        }
        console.log(`SUBSCRIPTION INFORMATION: ${JSON.stringify(subscriptionInformation)}`);
        try {
            const res = await this.rest.post(`/namespaces/${namespace}/subscriptions`, subscriptionInformation); 
            return res.data;
        } catch (err) {
            console.error(err.message);
            return undefined;
        }
    }
}