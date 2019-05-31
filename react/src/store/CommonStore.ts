import { action, computed, observable } from 'mobx';
import BaseProvider from '../utils/BaseProvider';
import RealtimeMessageStore from './RealtimeMessageStore';
import ChatStore from './ChatStore';
import WebSocketStore from './WebSocketStore';
import AuthStore from './AuthStore';

class CommonStore {
  @observable searchLoading = false;
  @observable searchValue = [];
  @observable searchModalVisible = false;

  @observable profileModalVisible = false;

  @computed get initialized() {
    return !AuthStore.initialize && !RealtimeMessageStore.initialize && !ChatStore.initialize;
  }

  @action initApp = () => {
    RealtimeMessageStore.init()
    ChatStore.init()
  }

  @action resetApp = () => {
    AuthStore.reset();
    ChatStore.reset();
    RealtimeMessageStore.reset();
    WebSocketStore.reset();
    this.reset();
  }

  @action logout = () => {
    return AuthStore.logout().then(() => {
      this.resetApp();
    }); 
  }

  @action searchUser = (username: string) => {
    if(this.searchLoading) {
      return Promise.resolve();
    }
    this.searchLoading = true;
    return BaseProvider.get(`/api/user/search/?username=${username}`).then((res: any) => {
      this.searchValue = res.data;
      console.log(res.data)
    }).finally(() => {
      this.searchLoading = false;
    });
  }

  @action openSearchModal = () => {
    this.searchModalVisible = true;
  }

  @action closeSearchModal = () => {
    this.searchModalVisible = false;
  }
  
  @action openProfileModal = () => {
    console.log('openProfileModal')
    this.profileModalVisible = true;
  }

  @action closeProfileModal = () => {
    this.profileModalVisible = false;
  }

  @action reset = () => {
    this.searchLoading = false;
    this.searchValue = [];
    this.searchModalVisible = false;
    this.profileModalVisible = false;
  }
}

const store = new CommonStore();

export default store;
