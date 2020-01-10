import React, { useLayoutEffect, useRef, Component } from 'react';
import { observer } from 'mobx-react';
import { Icon } from 'antd';
import styled from 'styled-components';

import ChatStore from 'store/ChatStore';

import { MemberMessageGroup, Message } from './MemberMessage';
import WelcomeChannelMessage from './WelcomeChannelMessage';
import ScrollableArea from '../ScrollableArea';
import MemberCardPopup from '../MemberCardPopup';
import  { MessageType } from '../../constant';
import colors from '../../utils/colors';

import { IMessage, IUser } from '../../constant/Interface';
import data from '../../data';

const StyledMessagesWrapper = styled.div`
  flex: 1 1 auto;
  position: relative;
`;

const StyledFileMessage = styled.a`
  &:focus {
    text-decoration: none;
  }
  .message-file {
    margin-top: 10px;
    border: 1px solid rgba(47,49,54,.6);
    background-color: rgba(47,49,54,.3);
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    max-width: 520px;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    @media screen and (max-width: 767px) {
      min-width: 72%;
    }
    .message-file-icon {
      color: ${colors.primary};
      font-size: 2rem;
      margin-right: 15px;
    }
    .message-file-download {    
      color: rgba(114,118,125,.6);
      font-size: 1.5rem;
    }
    .message-file-main {
      font-size: 14px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .message-file-size {
        color: #72767d;
        font-size: 12px;
      }
    }
  }
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


const getfilesize = (size: number) => {
	if (!size)
		return "";

	var num = 1024.00; //byte

	if (size < num)
		return size + " byte";
	if (size < Math.pow(num, 2))
		return (size / num).toFixed(2) + " KB"; //kb
	if (size < Math.pow(num, 3))
		return (size / Math.pow(num, 2)).toFixed(2) + " MB"; //M
	if (size < Math.pow(num, 4))
		return (size / Math.pow(num, 3)).toFixed(2) + " GB"; //G
	return (size / Math.pow(num, 4)).toFixed(2) + " TB"; //T
}

export const FileMessage = ({ name, size, url }: any) => (
  <StyledFileMessage target="view_window" href={url} download={name}>
      <div className="message-file">
        <Icon className="message-file-icon" type="file"/>
        <div className="message-file-main">
          <div className="message-file-name">{name}</div>
          <div className="message-file-size">{getfilesize(size)}</div>
        </div>
        <Icon className="message-file-download" type="download"/>
      </div>
  </StyledFileMessage>
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
    console.log(ChatStore.groupMessage)
    return (
      <StyledMessagesWrapper>
        <ScrollableArea>
          <WelcomeChannelMessage channelName={this.props.channelName} />
          {ChatStore.groupMessage.length !== 0 && ChatStore.groupMessage.map((group) => (
            <MemberMessageGroup
              key={group.messages[0].id}
              guild={this.props.guild}
              member={group.user}
              time={group.messages[0].time}
              onMemberClick={this.handleMemberClick}
            >
              {group.messages.map(message => 
                <Message key={message.id}>
                  {message.type === MessageType.TEXT &&
                    message.content
                  }
                  {message.type === MessageType.IMAGE &&
                    <img 
                      style={{ 
                        marginTop: '10px',
                        maxWidth: '200px', 
                        borderRadius: '5px'
                      }} 
                      src={message.file.url}
                    />
                  }
                  {message.type === MessageType.FILE &&
                    <FileMessage name={message.file.name} size={message.file.size} url={message.file.url}/>
                  }

                </Message>
              )}
            </MemberMessageGroup>
          ))}
          <div ref={(e) => this.bottomElement = e} />
        </ScrollableArea>
      </StyledMessagesWrapper>
    )
  }
}

export default MessagesWrapper;
