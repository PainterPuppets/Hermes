import { action, computed, observable } from 'mobx';
import data from '../data';
import { IChannel, IUser } from '../constant/Interface';
import ChatStore from './ChatStore';


class UIStore {
  @observable currentArea: string = 'HOME';
  @observable selectedGuildId: number | null = null;
  @observable selectedChannelsId: { [guildId: number]: number; } = {};
  @observable selectedPrivateChannelId: number | string | null = null;
  @observable currentChannelId = '';


  @computed get isPrivate() {
    return !this.selectedGuildId;
  }

  @action onClickHome = () => {
    this.currentArea = 'HOME';
    this.selectedGuildId = null;
    this.selectedPrivateChannelId = null;
    this.currentChannelId = '';
  }

  @action onClickUser = (target: IUser) => {
    const channel = ChatStore.getOrCreateDirectCannel(target);
    this.currentArea = 'HOME';
    this.selectedGuildId = null;
    this.selectedPrivateChannelId = channel.id;
    this.currentChannelId = channel.id;
  }

  @computed get selectedGuild() {
    return data.guilds.find(g => g.id === this.selectedGuildId);
  };

  @computed get guildSelectedChannel() {
    const guild = this.selectedGuild;
    if (!guild) return undefined;

    const categoriesChannels = guild.categories.map(c => c.channels);
    // Here we could use flat() to merge the channels but it is still experimental
    const channels = ([] as IChannel[]).concat(...categoriesChannels);

    const id = this.selectedChannelsId[guild.id] || guild.welcomeChannelId;
    return channels.find((channel: { id: any; }) => channel.id === id);
  };

  @computed get selectedChannelData() {
    if (this.currentArea === 'HOME') {
      const dm = ChatStore.directChannels.find(dm => dm.id === this.selectedPrivateChannelId);
      if (!dm) {
        return {
          id: 0,
          name: "",
          messages: []
        };
      }

      return {
        id: this.selectedPrivateChannelId,
        name: dm.target.username,
        messages: dm ? dm.messages : []
      };
    }
    if (this.currentArea === 'CHAT') {
      const channel = this.guildSelectedChannel;
      if (!channel) {
        return {

        }
      }
      return {
        id: channel.id,
        name: channel.name,
        messages: channel.messages || []
      };
    }

    return {
      id: 0,
      name: "",
      messages: []
    };
  };

  @action handleHomeClick = () => {
    this.selectedGuildId = null;
    this.currentArea = 'HOME';
  };

  @action handleGuildClick = (guildId: any) => {
    this.selectedGuildId = guildId;
    this.currentArea = 'CHAT';
  };

  @action handleChannelClick = (guildId: any, channelId: any) => {
    const { currentArea } = this;
    if (currentArea === 'HOME') {
      this.selectedPrivateChannelId = channelId
      this.currentChannelId = channelId;
    }
    if (currentArea === 'CHAT') {
      this.selectedChannelsId = {
        ...this.selectedChannelsId,
        [guildId]: channelId
      }
    }
  };

  @action reset = () => {
    this.currentArea = 'HOME';
    this.selectedGuildId = null;
    this.selectedChannelsId = {};
    this.selectedPrivateChannelId = null;
    this.currentChannelId = '';
  }
}

const store = new UIStore();

export default store;
