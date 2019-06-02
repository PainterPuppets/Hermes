import { action, observable } from "mobx";
import Centrifuge from 'centrifuge';
import SockJS from 'sockjs-client';
import BaseProvider from '../utils/BaseProvider';

class WebSocketStore {
  @observable connected = false;
  @observable initial = false;
  @observable env = 'hermes-';

  @observable _centrifuge = null;
  @observable _subscriptions = {};

  @action getWebsocketClient = () => {
    if (this._centrifuge !== null) {
      return this._centrifuge;
    }

    return BaseProvider.get('/api/realtime/config/').then((res) => {
      console.log(res)
      this.env = res.data.env;
      this._centrifuge = new Centrifuge({
        url: res.data.url,
        user: `${res.data.user}`,
        timestamp: res.data.timestamp,
        token: res.data.token,
        sockJS: SockJS
      });

      this._centrifuge.on('connect', () => {
        this.connected = true;
        this.initial = true;
      });

      this._centrifuge.on('disconnect', () => {
        this.connected = false;
      });

      this._centrifuge.connect();

      return this._centrifuge;
    });
  }

  @action _getChannelName = (text) => {
    return this.env + text;
  }

  @action subscribe = async (channelName, callBack) => {
    const client = await this.getWebsocketClient();
    const internalChannelName = this._getChannelName(channelName);
    if (this._subscriptions[internalChannelName]) {
      return this._subscriptions[internalChannelName];
    }
    const subscription = await client.subscribe(internalChannelName, callBack);
    console.log(this.env)
    console.log('subscribe ' + internalChannelName + ' success')
    this._subscriptions[internalChannelName] = subscription;

    return subscription;
  }

  @action unsubscribe = async (channelName) => {
    const internalChannelName = this._getChannelName(channelName);
    const subscription = this._subscriptions[internalChannelName];
    if (!subscription) return;
    subscription.unsubscribe();
    delete this._subscriptions[internalChannelName];
  }

  @action getSubscription = (channelName) => {
    const internalChannelName = this._getChannelName(channelName);
    const subscription = this._subscriptions[internalChannelName];
    if (!subscription) {
      return this.subscribe(internalChannelName);
    }

    return subscription;
  }

  @action connect = async () => {
    const client = await this.getWebsocketClient();

    return new Promise((res, rej) => {
      client.connect();
      client.on('connect', res);
      client._config.onTransportClose = rej;
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
      this._centrifuge = null;
      this._subscriptions = {};
    });
  }

}

export default new WebSocketStore();
