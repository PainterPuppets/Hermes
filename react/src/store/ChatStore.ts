import { action, computed, observable } from 'mobx';
import BaseProvider from '../utils/BaseProvider';
import WebSocketStore from './WebSocketStore';
import AuthStore from './AuthStore';
import { IDirectChannel, IUser, IMessage } from '../constant/Interface';

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

  @action syncDirect = (id: string) => {
    return BaseProvider.get(`/api/chat/direct/${encodeURIComponent(id)}/`).then((res: any) => {
    }).catch(err => {
      if(err.response.status === 404) {
        return;
      }
      console.log(err.response)
    });
  }

  @action sendMessage = (content: string, id: string) => {
    return BaseProvider.post(`/api/chat/message/${id}/`, { content });
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