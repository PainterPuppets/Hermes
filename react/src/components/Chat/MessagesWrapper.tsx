import React, { useLayoutEffect, useRef, Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

import ChatStore from 'store/ChatStore';

import { MemberMessageGroup, Message } from './MemberMessage';
import WelcomeChannelMessage from './WelcomeChannelMessage';
import ScrollableArea from '../ScrollableArea';
import MemberCardPopup from '../MemberCardPopup';

import { IMessage, IUser } from '../../constant/Interface';
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


@observer
class MessagesWrapper extends Component<any, any> {
  bottomElement: HTMLDivElement | null;
  constructor(props: any) {
    super(props);
    this.bottomElement = null;
  }

  onScroll = () => {
    if (!this.bottomElement) {
      return;
    }

    this.bottomElement.scrollIntoView({ behavior: 'smooth' });
  }

  componentDidMount() {
    this.onScroll();
  }

  componentDidUpdate() {
    this.onScroll();
  }

  handleMemberClick = (element: any, member: any) => {
    const { target } = element;
    const targetRect = target.getBoundingClientRect();
    MemberCardPopup.show({
      direction: 'left',
      position: { x: targetRect.left + targetRect.width + 10, y: targetRect.top },
      member
    });
  };

  render() {
    return (
      <StyledMessagesWrapper>
        <ScrollableArea>
          <WelcomeChannelMessage channelName={this.props.channelName} />
          {ChatStore.groupMessage.map((group) => (
            <MemberMessageGroup
              key={group.messages[0].id}
              guild={this.props.guild}
              member={group.user}
              time={group.messages[0].time}
              onMemberClick={this.handleMemberClick}
            >
              {group.messages.map(message => <Message key={message.id}>{message.content}</Message>)}
            </MemberMessageGroup>
          ))}
          <div ref={(e) => this.bottomElement = e} />
        </ScrollableArea>
      </StyledMessagesWrapper>
    )
  }
}

export default MessagesWrapper;
