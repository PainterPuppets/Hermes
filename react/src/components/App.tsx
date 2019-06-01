import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import UIStore from 'store/UIStore';
import CommonStore from 'store/CommonStore';
import colors from '../utils/colors';
import ScrollbarStyles from './ScrollbarStyles';
import GlobalStyle from './GlobalStyle';
import Navbar from './Navbar';
import Channels from './Channels';
import Chat from './Chat';
import MemberCardPopup from './MemberCardPopup';
import { IChannel } from '../constant/Interface';
import Loading from './Loading';
import SearchModal from './SearchModal';
import UserProfileModal from './UserProfileModal';

import data from '../data';


interface IState {
  currentArea: string,
  selectedGuildId: number | null,
  selectedChannelsId: { [guildId: number]: number; },
  selectedPrivateChannelId: number

}

const StyledApp = styled.div`
  background-color: ${colors.grayLight};
  border-color: ${colors.grayLight};
  display: flex;
  height: 100%;
  min-height: 100%;
  width: 100%;

  .app-content {
    flex: 1 1 auto;
  }
`;

@observer
class App extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    CommonStore.initApp();
  }

  render() {
    if (!CommonStore.initialized) {
      return (
        <StyledApp>
          <Loading />
        </StyledApp>)
    }

    return (
      <StyledApp>
        <GlobalStyle />
        <ScrollbarStyles />

        <Navbar
          onHomeClick={UIStore.handleHomeClick}
          onGuildClick={UIStore.handleGuildClick}
          selectedGuildId={UIStore.selectedGuildId}
        />
        <Channels
          showPrivateChannels={UIStore.isPrivate}
          guild={UIStore.selectedGuild}
          selectedChannelId={UIStore.selectedChannelData.id}
          onChannelClick={UIStore.handleChannelClick}
        />
        <Chat
          className="app-content"
          isPrivate={UIStore.isPrivate}
          channelName={UIStore.selectedChannelData.name}
          guild={UIStore.selectedGuild}
          messages={UIStore.selectedChannelData.messages}
        />
        <MemberCardPopup
          guildRolesList={UIStore.selectedGuild ? UIStore.selectedGuild.roles : []}
          ref={node => {
            MemberCardPopup.instance = MemberCardPopup.instance || node;
          }}
        />
        <SearchModal />
        <UserProfileModal />
      </StyledApp>
    );
  }
}

export default App;
