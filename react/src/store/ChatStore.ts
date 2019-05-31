import { action, computed, observable } from 'mobx';
import BaseProvider from '../utils/BaseProvider';
import WebSocketStore from './WebSocketStore';
import AuthStore from './AuthStore';
import { IDirectMessage } from '../constant/Interface';

class ChatStore {
  @observable initialize = true;
  @observable directMessages: any[] = [];

  @action init = () => {
    return this.getDirectMessages();
  }

  @action getDirectMessages = () => {
    return BaseProvider.get('/api/chat/directs/').then((res: any) => {
      this.directMessages = res.data;
    }).finally(() => {
      this.initialize = false;
    });

  }

  @action reset() {
    this.initialize = true;
    this.directMessages = [];
  }
}

const store = new ChatStore();

export default store;