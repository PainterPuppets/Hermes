import { action, computed, observable } from 'mobx';
import RealtimeMessageStore from './RealtimeMessageStore';

import AuthStore from './AuthStore';

class CommonStore {

  @computed get initialized() {
    return !AuthStore.initialize && !RealtimeMessageStore.initialize;
  }

  @action initApp = () => {
    RealtimeMessageStore.init()
  }

  @action logout = () => {
    return AuthStore.logout().then(() => {
    }); 
  }
}

const store = new CommonStore();

export default store;
