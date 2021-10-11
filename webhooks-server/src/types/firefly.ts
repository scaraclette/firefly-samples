export interface SubscribeFireflyPost {
    namespace?: String;
    subscriptionName: String;
}

export interface SubscribeFireflyEndpoint {
    name: String;
    options: {
        url: String;
    };
    transport: String;
}