import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';
import { observer } from 'mobx-react';

import UserAvatar from '../UserAvatar';
import CommonStore from 'store/CommonStore';
import AuthStore from 'store/AuthStore';
import UnmuteIcon from '../../icons/Unmute';
import MuteIcon from '../../icons/Mute';
import HeadphonesIcon from '../../icons/Headphones';
import UnDeafenIcon from '../../icons/UnDeafen';
import GearIcon from '../../icons/Gear';

import colors from '../../utils/colors';
import data from '../../data';

const StyledUserFooter = styled.div`
  margin-bottom: 1px;
  padding: 0 10px;
  height: 52px;
  display: flex;
  align-items: center;

  color: #fff;
  background: ${colors.channelsUserFooterBackground};
  font-weight: 400;

  .avatar-wrapper {
    cursor: pointer;
  }

  .content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .username {
    font-size: 0.85em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tag {
    font-size: 0.73em;
    opacity: 0.4;
  }

  .buttons {
    display: flex;
    margin-left : auto;
    flex: 0 1 auto;
  }
`;

const StyledIconButton = styled.button`
  margin: 0;
  padding: 0;
  outline: none;
  width: 32px;
  height: 32px;

  cursor: pointer;
  background: none;
  border: 0;
  border-radius: 3px;

  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background: rgba(24, 25, 28, 0.3);
  }

  svg {
    width: 18px;
    height: 18px;
    color: #fff;
    opacity: 0.6;

    :hover {
      opacity: 0.8;
    }
  }
`;

export default observer(() => {
  return (
    <StyledUserFooter>
      <UserAvatar onClick={CommonStore.openProfileModal} className="avatar-wrapper" avatarUrl={AuthStore.user.avatarUrl} fadeHover />

      <div className="content">
        <div className="username">{AuthStore.user.username}</div>
        <div className="tag">#{AuthStore.user.id}</div>
      </div>

      <div className="buttons">
        {CommonStore.mute ? 
          <Tooltip title="Unmute" placement="top">
            <StyledIconButton onClick={CommonStore.onUnMute}>
              <UnmuteIcon />
            </StyledIconButton>
          </Tooltip> :
          <Tooltip title="Mute" placement="top">
            <StyledIconButton onClick={CommonStore.onMute}>
              <MuteIcon />
            </StyledIconButton>
          </Tooltip>
        }

        {CommonStore.deafen ? 
          <Tooltip title="Undeafen" placement="top">
            <StyledIconButton onClick={CommonStore.onUnDeafen}>
              <UnDeafenIcon />
            </StyledIconButton>
          </Tooltip> :    
          <Tooltip title="Deafen" placement="top">
            <StyledIconButton onClick={CommonStore.onDeafen}>
              <HeadphonesIcon />
            </StyledIconButton>
          </Tooltip> 
        }

        <Tooltip title="User Settings" placement="top">
          <StyledIconButton onClick={CommonStore.openProfileModal}>
            <GearIcon />
          </StyledIconButton>
        </Tooltip>
      </div>
    </StyledUserFooter>
  );
});
