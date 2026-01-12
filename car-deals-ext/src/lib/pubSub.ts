export type Event = 'newTab';
export type Subscriber = {
    id: number;
    callback: Function
}
export interface EventMap {
    'newTab': { tabId: number }
}

export class PubSub {
    private events: Record<string, Subscriber[]> = {};
    private subscriptionId: number = 0;

    constructor() {
        this.events = {};
        this.subscriptionId = 0;
    }

    subscribe(event: Event, callback: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push({ id: this.subscriptionId, callback });
        return this.subscriptionId++;
    }

    unsubscribe(event: Event, subscriptionId: number) {
        if (!this.events[event]) {
            console.log("No such event to unsubscribe: ", event);
            return
        };
        this.events[event] = this.events[event].filter((callback) => callback.id !== subscriptionId);

    }

    publish(event: Event, data: EventMap) {
        if (!this.events[event]) return;
        this.events[event].forEach(sub => sub.callback(data));
    }
}