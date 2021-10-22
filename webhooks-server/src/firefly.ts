import axios, { AxiosInstance } from "axios";

export interface SubscribeFirefly {
    name: String;
    options: {
        url: String;
    };
    transport: String;
}

export class FireFly {
    private rest: AxiosInstance;
    private url: String = 'http://localhost:8080/webhook-firefly';
    private transport: String = 'webhooks';
    private namespace: String = 'default';

    constructor(port: number) {
        this.rest = axios.create({ baseURL: `http://localhost:${port}/api/v1` });
    }

    async subscribeWebhook(subscriptionName: String): Promise<any> {
        let newSubscriptionRequest: SubscribeFirefly = {
            name: subscriptionName,
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

    async unsubscribeWebhook(subscriptionId: String): Promise<any> {
        try {
            const res = await this.rest.delete(`/namespaces/${this.namespace}/subscriptions/${subscriptionId}`); 
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