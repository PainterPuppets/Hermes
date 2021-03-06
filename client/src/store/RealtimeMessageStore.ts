import { action, computed, observable } from 'mobx';
import WebSocketStore from './WebSocketStore';
import AuthStore from './AuthStore';
import ChatStore from './ChatStore';

class RealtimeMessageStore {
  @observable initialize = true;


  @action init = async () => {
    await WebSocketStore.subscribe(`message-receive#${AuthStore.user.id}`, (msg: any) => { 
      console.log('receive new message!')
      console.log(msg);
      if (msg.data.user.id === AuthStore.user.id) {
        console.log('duplicate self message!')
        return;
      }
      ChatStore.receiveNewMessage(msg.data);
    });

    this.initialize = false
  }
  
  @action reset() {
    this.initialize = true;
  }
}

const store = new RealtimeMessageStore();

export default store;
