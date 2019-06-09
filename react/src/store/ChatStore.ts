import { action, computed, observable, toJS } from 'mobx';
import BaseProvider from '../utils/BaseProvider';
import WebSocketStore from './WebSocketStore';
import UIStore from './UIStore';
import AuthStore from './AuthStore';
import { IDirectChannel, IUser, IMessage, IMessageGroup } from '../constant/Interface';

class ChatStore {
  @observable initialize = true;
  @observable _directChannels: IDirectChannel[] = [];

  @computed get directChannels () {
    // this._directChannels.map(channel => channel.unreadCount = channel.messages.filter(message => message.is_received === false).length);
    // console.log(this._directChannels);
    return this._directChannels;
  }

  @computed get unReadCount () {
    let count = 0;
    this._directChannels.map(channel => count += (channel.unreadCount || 0));
    return count
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
    const index = this._directChannels.findIndex(channel => channel.id === id || channel.id === alias);
    if (index === -1) {
      return null;
    }
    return this._directChannels[index];
  }


  @action getOrCreateDirectCannelFromId = (id: string, user?: IUser) => {
    const channel = this.getDirectCannel(id);
    if (channel) {
      return channel;
    }
    const newChannel: IDirectChannel = { id, target: (user || ({} as IUser)), messages: [] } as IDirectChannel
    this._directChannels.unshift(newChannel);
    this.syncDirect(id);
    return this._directChannels[0];
  }

  @action getOrCreateDirectCannel = (target: IUser) => {
    const id = this.getDirectId(target);
    const channel = this.getDirectCannel(id);
    if (channel) {
      return channel;
    }
    const newChannel: IDirectChannel = { id, target, messages: [] } as IDirectChannel
    this._directChannels.unshift(newChannel);
    this.syncDirect(id);
    return this._directChannels[0];
  }

  @action receiveNewMessage = (msg: any) => {
    let channel = this.getOrCreateDirectCannelFromId(msg.channel_id, msg.user);
    channel.messages.push(msg);

    if (UIStore.currentChannelId === channel.id) {
      this.readChannelMessage(channel.id);
    } else {
      channel.unreadCount = (channel.unreadCount || 0) + 1;
    }
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

  @action sendMessage = (id: string, type: number, content?: string, file?: Blob) => {
    if (!id) {
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type.toString());

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      return BaseProvider.post(`/api/chat/message/${encodeURIComponent(id)}/`, formData, config).then((res) => {
        console.log('send success')
        console.log(res.data)
        let channel = this.getDirectCannel(id);
        if (!channel) {
          return;
        }
        channel.messages.push(res.data);
      });
    }
    
  
    return BaseProvider.post(`/api/chat/message/${encodeURIComponent(id)}/`, { 
        content,
        file,
        type
      }).then((res) => {
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
      res.data.map((channel: any) => channel.unreadCount = channel.messages.filter((message: any) => message.is_received === false).length);
      this._directChannels = res.data;
    }).finally(() => {
      this.initialize = false;
    });
  }

  @action readChannelMessage = (id: string) => {
    let channel = this.getDirectCannel(id);
    if (!channel || !channel.unreadCount) {
      return Promise.resolve();
    }
    let fullback = channel.unreadCount;
    channel.unreadCount = 0;
    return BaseProvider.post(`/api/chat/direct_read/${encodeURIComponent(id)}/`).catch(err => {
      if (!channel) {
        return;
      }
      channel.unreadCount = fullback;
    });
  }


  @action reset() {
    this.initialize = true;
    this._directChannels = [];
  }
}

const store = new ChatStore();

export default store;