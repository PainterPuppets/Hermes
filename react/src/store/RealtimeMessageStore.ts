import { action, computed, observable } from 'mobx';
import WebSocketStore from './WebSocketStore';
import AuthStore from './AuthStore';

class RealtimeMessageStore {
  @observable initialize = true;


  @action init = async () => {
    await WebSocketStore.subscribe(`message-recieve#${AuthStore.user.id}`, (data: any) => { console.log(data) });
    this.initialize = false
  }
}

const store = new RealtimeMessageStore();

export default store;