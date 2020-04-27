import { action, observable } from "mobx";
import Centrifuge from 'centrifuge';
import BaseProvider from '../utils/BaseProvider';

class WebSocketStore {
  @observable connected = false;
  @observable initial = false;
  @observable env = 'hermes-';

  @observable centrifuge?: Centrifuge;
  @observable subscriptions: {
    [channel: string]: Centrifuge.Subscription,
  } = {};

  @action getWebsocketClient = () => {
    if (this.centrifuge) {
      return this.centrifuge;
    }
    console.log()

    return BaseProvider.get('/api/realtime/config/').then((res) => {
      console.log(res)
      this.centrifuge = new Centrifuge(`ws://${window.document.domain}/websocket/connection/websocket`);
      this.centrifuge.setToken(res.data.token)
      this.centrifuge.on('connect', context => {
        console.log('connect !')
        console.log(context)
        this.connected = true;
        this.initial = true;
      });
      this.centrifuge.on('disconnect', (context) => {
        console.log('disconnect !?')
        console.log(context)
        this.connected = false;
      });
      this.centrifuge.connect();

      return this.centrifuge;
    });
  }

  @action _getChannelName = (text: string) => {
    return this.env + text;
  }

  @action subscribe = async (channelName: string, callBack?: (...args: any[]) => void) => {
    const client = await this.getWebsocketClient();
    const internalChannelName = this._getChannelName(channelName);
    console.log('subscribe new channel' + internalChannelName)
    if (this.subscriptions[internalChannelName]) {
      return this.subscriptions[internalChannelName];
    }
    const subscription = await client.subscribe(internalChannelName, callBack);
    this.subscriptions[internalChannelName] = subscription;

    return subscription;
  }

  @action unsubscribe = async (channelName: string) => {
    const internalChannelName = this._getChannelName(channelName);
    const subscription = this.subscriptions[internalChannelName];
    if (!subscription) return;
    subscription.unsubscribe();
    delete this.subscriptions[internalChannelName];
  }

  @action getSubscription = (channelName: string) => {
    const internalChannelName = this._getChannelName(channelName);
    const subscription = this.subscriptions[internalChannelName];
    if (!subscription) {
      return this.subscribe(internalChannelName);
    }

    return subscription;
  }

  @action connect = async () => {
    const client = await this.getWebsocketClient();

    return new Promise((res) => {
      client.connect();
      client.on('connect', res);
    });
  }


  @action disconnect = async () => {
    const client = await this.getWebsocketClient();
    client.disconnect();
  }

  
  @action reset() {
    this.disconnect().then(() => {
      this.connected = false;
      this.initial = false;
      this.env = 'hermes-';
      this.centrifuge = undefined;
      this.subscriptions = {};
    });
  }

}

export default new WebSocketStore();
