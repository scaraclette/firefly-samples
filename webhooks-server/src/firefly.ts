import axios, { AxiosInstance } from "axios";
import { SubscribeFirefly } from "./types/firefly";

export class FireFly {
    private rest: AxiosInstance;
    private url: String = 'http://localhost:8080/webhook-firefly';
    private transport: String = 'webhooks';
    private namespace: String = 'default';
    private subscriptionName: String = 'subscription_test';

    constructor(port: number) {
        this.rest = axios.create({ baseURL: `http://localhost:${port}/api/v1` });
    }

    async subscribeWebhook(): Promise<any> {
        let newSubscriptionRequest: SubscribeFirefly = {
            name: this.subscriptionName,
            options: {
                url: this.url
            },
            transport: this.transport
        }
        try {
            const res = await this.rest.post(`/namespaces/${this.namespace}/subscriptions`, newSubscriptionRequest); 
            return res.data;
        } catch (err) {
            console.error(err.message);
            return undefined;
        }
    }

    async getSubscriptions(): Promise<any> {
        try {
            const res = await this.rest.get(`/namespaces/${this.namespace}/subscriptions`);
            return res.data;
        } catch (err) {
            console.error(err.message);
            return undefined;
        }
    }
}