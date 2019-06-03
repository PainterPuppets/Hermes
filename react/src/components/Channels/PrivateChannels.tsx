import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { Badge } from 'antd';

import ChatStore from 'store/ChatStore';
import UIStore from 'store/UIStore';
import UserAvatar from '../../components/UserAvatar';
import ActivityIcon from '../../icons/Activity';
import LibraryIcon from '../../icons/Library';
import StoreIcon from '../../icons/Store';
import PersonWavingIcon from '../../icons/PersonWaving';
import closeIconUrl from '../../icons/close.svg';

import colors from '../../utils/colors';
import data from '../../data';

const StyledPrivateChannels = styled.div`
  margin: 20px 0 8px;

  .header {
    margin-top: 12px;
    padding: 9px 20px;

    font-size: 0.77em;
    text-transform: uppercase;
    color: #fff;
    opacity: 0.3;
  }
`;

const StyledChannel = styled.div<{ smallHeight?: boolean }>`
  padding: 8px;
  margin: 1px 0 1px 8px;
  height: ${props => (props.smallHeight ? 40 : 42)}px;

  display: flex;
  align-items: center;
  font-size: 0.95em;

  color: #fff;
  cursor: pointer;
  border-radius: 3px;
  user-select: none;

  &.active {
    background-color: ${colors.privateChannelSelectedBackground};

    .avatar-wrapper .status {
      border-color: rgb(68, 72, 78);
    }
  }

  :hover .close {
    display: block;
  }

  :hover:not(.active) {
    background-color: ${colors.grayLight};

    .avatar-wrapper .status {
      border-color: ${colors.grayLight};
    }
  }

  &.active,
  &:hover {
    svg,
    span {
      opacity: 1;
      color: #fff;
    }
  }

  svg {
    margin-right: 18px;
    width: 24px;
    height: 24px;
    opacity: 0.6;
  }

  .avatar-wrapper {
    margin-right: 0px;
  }

  .username {
    color: ${colors.channelName};
    margin-left: 12px;
    flex: 1 1 auto;
  }

  .close {
    border: 0;
    width: 18px;
    height: 18px;
    display: none;
    justify-self: flex-end;

    background: url(${closeIconUrl}) 50% no-repeat;
    background-size: 18px 18px;
    opacity: 0.3;
    cursor: pointer;
  }
`;

const StyledBadge = styled(Badge)`
  color: #fff !important;
  .ant-badge-count {
    box-shadow: none;
    text-align: center;
    background: #f04747;
  }
`

const PrivateChannels = observer(({ onChannelClick }: any) => {

  const handleChannelClick = (id: any) => {
    onChannelClick(null, id);
    ChatStore.readChannelMessage(id);
  }

  return (
  <StyledPrivateChannels>
    {/* <StyledChannel>
      <ActivityIcon />
      <span>Activity</span>
    </StyledChannel>
    <StyledChannel>
      <LibraryIcon />
      <span>Library</span>
    </StyledChannel>
    <StyledChannel>
      <StoreIcon />
      <span>Store</span>
    </StyledChannel> */}
    <StyledChannel
      onClick={UIStore.onClickHome}
      className={UIStore.selectedPrivateChannelId ? '' : 'active'}
    >
      <PersonWavingIcon />
      <span>Home</span>
    </StyledChannel>

    <div className="header">Direct Messages</div>

    {ChatStore.directChannels.map(directChannel => {
      const user = directChannel.target;

      return (
        <StyledChannel
          key={directChannel.id}
          className={directChannel.id === UIStore.selectedPrivateChannelId ? 'active' : ''}
          onClick={() => handleChannelClick(directChannel.id)}
          smallHeight
        >
          <UserAvatar className="avatar-wrapper" avatarUrl={user.avatar_url} status={false}/>
          <span className="username">{user.username}</span>
          {/* <button className="close" /> */}
          <StyledBadge count={directChannel.unreadCount || 0} overflowCount={99}/>
        </StyledChannel>
      );
    })}
  </StyledPrivateChannels>
)});

export default PrivateChannels;
