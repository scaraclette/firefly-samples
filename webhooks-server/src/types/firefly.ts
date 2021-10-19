export interface SubscribeFireflyPost {
    namespace?: String;
    subscriptionName: String;
}

export interface SubscribeFirefly {
    name: String;
    options: {
        url: String;
    };
    transport: String;
}