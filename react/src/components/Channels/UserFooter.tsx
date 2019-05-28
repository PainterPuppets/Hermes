import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';

import UserAvatar from '../UserAvatar';
import UnmuteIcon from '../../icons/Unmute';
import HeadphonesIcon from '../../icons/Headphones';
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

export default () => {
  const user = data.users[data.userId];

  return (
    <StyledUserFooter>
      <UserAvatar className="avatar-wrapper" avatarUrl={user.avatar} fadeHover />

      <div className="content">
        <div className="username">{user.username}teste</div>
        <div className="tag">#{user.tag}</div>
      </div>

      <div className="buttons">
        <Tooltip title="Unmute" placement="top">
          <StyledIconButton>
            <UnmuteIcon />
          </StyledIconButton>
        </Tooltip>

        <Tooltip title="Deafen" placement="top">
          <StyledIconButton>
            <HeadphonesIcon />
          </StyledIconButton>
        </Tooltip>

        <Tooltip title="User Settings" placement="top">
          <StyledIconButton>
            <GearIcon />
          </StyledIconButton>
        </Tooltip>
      </div>
    </StyledUserFooter>
  );
};
