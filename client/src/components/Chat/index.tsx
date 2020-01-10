import React, { useState } from 'react';
import styled from 'styled-components';
import { Empty } from 'antd';
import ChatStore from 'store/ChatStore';
import UIStore from 'store/UIStore';
import ContentHeader from '../ContentHeader';
import HeaderActionBar from './HeaderActionBar';
import ChannelName from '../ChannelName';
import MessagesWrapper from './MessagesWrapper';
import NewMessageWrapper from './NewMessageWrapper';
import MembersList from './MembersList';
import MemberCardPopup from '../MemberCardPopup';

import constants from '../../utils/constants';
import colors from '../../utils/colors';
import HomeEmpty from '../../icons/HomeEmpty.svg';

const StyledEmpty = styled.div` 
  height: 100%;
  .ant-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    user-select: none;
    .ant-empty-image {
      height: 240px;
      padding: 40px;
    }
    .ant-empty-description {
      color: #72767d;
    }
  }
`;

const StyledChat = styled.div`
  background: ${colors.grayLight};

  display: flex;
  flex-direction: column;

  .content-wrapper {
    display: flex;
    height: 100%;
  }

  .messages-container {
    flex: 1 1 auto;

    display: flex;
    flex-direction: column;
  }
`;

const Chat = ({ className, isPrivate, channelName, guild, messages }: any) => {
  const [membersListVisible, setMembersListVisible] = useState(true);

  const toggleMembersListVisible = () => {
    setMembersListVisible(!membersListVisible);
  };

  const handleMemberListMemberClick = (element: any, member: any) => {
    const guildMember = guild.members.find((m: any) => m.userId === member.id);
    const memberWithRoles = {
      ...member,
      roles: guildMember ? guildMember.roles : null
    };

    const { currentTarget: target } = element;
    const targetRect = target.getBoundingClientRect();
    MemberCardPopup.show({
      direction: 'right',
      position: { x: targetRect.left - constants.memberCardWidth, y: targetRect.top },
      member: memberWithRoles
    });
  };

  return (
    <StyledChat className={className}>
      <ContentHeader
        content={<ChannelName name={channelName || 'Home'} isHeader isUser={isPrivate} textColor="#fff" />}
        rightContent={
          <HeaderActionBar
            isPrivate={isPrivate}
            isMembersListActive={membersListVisible}
            onMembersToggleClick={toggleMembersListVisible}
          />
        }
      />

      {channelName ? 
        <div className="content-wrapper">
          <div className="messages-container">
            <MessagesWrapper
              guild={guild}
              messages={messages}
              channelName={channelName}
              isPrivate={isPrivate}
            />
            <NewMessageWrapper
              channelName={channelName}
              isPrivate={isPrivate}
              onSend={(type: number, content?: string, file?: Blob) => ChatStore.sendMessage(UIStore.currentChannelId, type, content, file)}
            />
          </div>

          {!isPrivate && membersListVisible && (
            <MembersList
              guildRolesList={guild.roles}
              members={guild.members}
              onMemberClick={handleMemberListMemberClick}
            />
          )}
        </div> :
        <StyledEmpty>
          <Empty
            image={HomeEmpty}
            description={<span>左边选择一个频道来开始聊天</span>}
          />
        </StyledEmpty>
      }
    </StyledChat>
  );
};

export default Chat;
