import { action, observable } from 'mobx';
import BaseProvider from '../utils/BaseProvider';
import { DefaultAvatar } from '../constant';
import _ from 'lodash';

class AuthStore {
  @observable initialize = true;
  @observable isAuthenticated = false;
  @observable user = {
    id: 0,
    username: '',
    email: '',
    avatarUrl: DefaultAvatar,
    isSuperuser: false,
  }

  constructor() {
    this.getUser();
  }


  @action update(user: any) {
    this.isAuthenticated = user.is_authenticated;
    this.user.id = user.id;
    this.user.username = user.username;
    this.user.email = user.email;
    this.user.isSuperuser = user.is_superuser;
    if (user.avatar_url) { this.user.avatarUrl = user.avatar_url }
  }

  @action getUser() {
    return BaseProvider.get('/api/user/').then((res) => {
      this.update(res.data);
      BaseProvider.refreshCSRFToken();
    }).finally(() => {
      this.initialize = false;
    });
  }

  @action login(username: string, password: string, remember: boolean) {
    return BaseProvider.post('/api/user/login/', {
      username, password, remember
    }).then((res) => {
      BaseProvider.refreshCSRFToken();
      this.update(res.data);
      this.initialize = false;
    });
  }

  @action changePassword(oldPassword: string, password: string, confirmPassword: boolean) {
    return BaseProvider.post('/api/auth/change_password/', {
      oldPassword, password, confirmPassword
    });
  }

  @action logout() {
    return BaseProvider.post('/api/user/logout/');
  }

  @action signup(username: string, email: string, password: string) {
    return BaseProvider.post('/api/user/signup/', {
      username, email, password
    });
  }

  @action uploadAvatar = (avatar: Blob) => {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return BaseProvider.post('/api/user/upload_avatar/', formData, config).then((res) => {
      this.update(res.data);
    });
  }

  @action changeProfile = (username = this.user.username) => {
    return BaseProvider.post('/api/auth/change_profile',{
      username,
    }).then((res) => {
      this.update(res.data);
    });
  }

  @action reset() {
    this.initialize = false;
    this.isAuthenticated = false;
    this.user = {
      id: 0,
      username: '',
      email: '',
      avatarUrl: DefaultAvatar,
      isSuperuser: false,
    }
    BaseProvider.refreshCSRFToken();
  }
}

const store = new AuthStore();

export default store;
