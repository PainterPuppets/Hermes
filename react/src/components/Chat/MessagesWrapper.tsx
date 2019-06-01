import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';

import { MemberMessageGroup, Message } from './MemberMessage';
import WelcomeChannelMessage from './WelcomeChannelMessage';
import ScrollableArea from '../ScrollableArea';
import MemberCardPopup from '../MemberCardPopup';

import { IMessage } from '../../constant/Interface';
import data from '../../data';

const StyledMessagesWrapper = styled.div`
  flex: 1 1 auto;
  position: relative;
`;

const createMessageGroup = (groupId: any, guild: any, member: any, time: any, onMemberClick: any, messages: any) => (
  <MemberMessageGroup
    key={groupId}
    guild={guild}
    member={member}
    time={time}
    onMemberClick={onMemberClick}
  >
    {messages}
  </MemberMessageGroup>
);


const MessagesWrapper = ({ channelName, guild, messages }: any) => {
// class MessagesWrapper extends React.Component<any, any> {
  const bottomElement = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!bottomElement.current) {
      return;
    }

    bottomElement.current.scrollIntoView({ behavior: 'smooth' });
  });

  const handleMemberClick = (element: any, member: any) => {
    const { target } = element;
    const targetRect = target.getBoundingClientRect();
    MemberCardPopup.show({
      direction: 'left',
      position: { x: targetRect.left + targetRect.width + 10, y: targetRect.top },
      member
    });
  };

  let lastUserId = messages.length > 0 ? messages[0].userId : null;
  const groupsComponents: any[] = [];
  let messagesComponents: any[] = [];
  let headingGroupMessage: IMessage | null = null;

  const closeMessageGroupAndClearMessages = () => {
    if (!headingGroupMessage) {
      return;
    }

    const userId = headingGroupMessage.user.id;
    const guildMembers = guild ? guild.members : [];
    const guildMember = guildMembers.find((m: { userId: any; }) => m.userId === userId);
    const member = {
      ...headingGroupMessage.user,
      roles: guildMember ? guildMember.roles : null
    };

    const currentGroupId = headingGroupMessage.id;
    groupsComponents.push(
      createMessageGroup(
        currentGroupId,
        guild,
        member,
        headingGroupMessage.time,
        handleMemberClick,
        messagesComponents
      )
    );
    messagesComponents = [];
  };

  messages.forEach((message: IMessage, index: number) => {
    const { user } = message;

    if (user.id !== lastUserId && messagesComponents.length > 0) {
      closeMessageGroupAndClearMessages();
    }

    if (messagesComponents.length === 0) {
      headingGroupMessage = message;
    }
    messagesComponents.push(<Message key={message.id}>{message.content}</Message>);
    lastUserId = message.user.id;

    if (index + 1 === messages.length) {
      closeMessageGroupAndClearMessages();
    }
  });

  return (
    <StyledMessagesWrapper>
      <ScrollableArea>
        <WelcomeChannelMessage channelName={channelName} />
        {groupsComponents}
        <div ref={bottomElement} />
      </ScrollableArea>
    </StyledMessagesWrapper>
  );
};

export default MessagesWrapper;
