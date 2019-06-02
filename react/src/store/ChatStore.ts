import { action, computed, observable, toJS } from 'mobx';
import BaseProvider from '../utils/BaseProvider';
import WebSocketStore from './WebSocketStore';
import UIStore from './UIStore';
import AuthStore from './AuthStore';
import { IDirectChannel, IUser, IMessage, IMessageGroup } from '../constant/Interface';

class ChatStore {
  @observable initialize = true;
  @observable directChannels: IDirectChannel[] = [];

  @action init = () => {
    return this.getdirectChannels();
  }

  @action getDirectId = (target: IUser) => {
    return `direct#${AuthStore.user.id}-${target.id}`
  }
  
  @action getDirectCannel = (id: string) => {
    const regex = /direct#(\w*)-(\w*)/
    const result = regex.exec(id);
    if (!result) {
      return null;
    }
  
    const alias = `direct#${result[2]}-${result[1]}`
    const index = this.directChannels.findIndex(channel => channel.id === id || channel.id === alias);
    if (index === -1) {
      return null;
    }
    return this.directChannels[index];
  }

  @computed get groupMessage() {
    let channel = this.getDirectCannel(UIStore.currentChannelId);
    if (!channel || !channel.messages) {
      return [];
    }

    console.log('groupMessage')
  
    let messages = channel.messages;
    const groups: IMessageGroup[] = [];
    let currentValue: any = {};

    messages.map((message, index) => {
      if (index === 0) {
        currentValue.user = message.user;
        currentValue.messages = [message]
        return;
      }
  
      if (message.user.id !== currentValue.user.id) {
        groups.push(currentValue);
        currentValue = {};
        currentValue.user = message.user;
        currentValue.messages = [message]
        return;
      }

      currentValue.messages.push(message)
    })

    if (currentValue.user) {
      groups.push(currentValue);
      currentValue = {};
    }
  
    return groups
  }

  @action getOrCreateDirectCannelFromId = (id: string, user?: IUser) => {
    const channel = this.getDirectCannel(id);
    if (channel) {
      return channel;
    }
    const newChannel: IDirectChannel = { id, target: (user || ({} as IUser)), messages: [] } as IDirectChannel
    this.directChannels.unshift(newChannel);
    this.syncDirect(id);
    return this.directChannels[0];
  }

  @action getOrCreateDirectCannel = (target: IUser) => {
    const id = this.getDirectId(target);
    const channel = this.getDirectCannel(id);
    if (channel) {
      return channel;
    }
    const newChannel: IDirectChannel = { id, target, messages: [] } as IDirectChannel
    this.directChannels.unshift(newChannel);
    this.syncDirect(id);
    return this.directChannels[0];
  }

  @action receiveNewMessage = (msg: any) => {
    let channel = this.getOrCreateDirectCannelFromId(msg.channel_id, msg.user);
    channel.messages.push(msg);
  }

  @action syncDirect = (id: string) => {
    return BaseProvider.get(`/api/chat/direct/${encodeURIComponent(id)}/`).then((res: any) => {
    }).catch(err => {
      if(err.response.status === 404) {
        return;
      }
      console.log(err.response)
    });
  }

  @action sendMessage = (id: string, content: string) => {
    if (!id) {
      return;
    }
  
    return BaseProvider.post(`/api/chat/message/${encodeURIComponent(id)}/`, { content }).then((res) => {
      console.log('send success')
      console.log(res.data)
      let channel = this.getDirectCannel(id);
      if (!channel) {
        return;
      }
      channel.messages.push(res.data);
    });
  }

  @action getdirectChannels = () => {
    return BaseProvider.get('/api/chat/directs/').then((res: any) => {
      this.directChannels = res.data;
    }).finally(() => {
      this.initialize = false;
    });
  }


  @action reset() {
    this.initialize = true;
    this.directChannels = [];
  }
}

const store = new ChatStore();

export default store;