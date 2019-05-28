import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';
import colors from '../../utils/colors';
import GuildIcon from './GuildIcon';
import OnlineFriendsCounter from './OnlineFriendsCounter';
import ScrollableArea from '../ScrollableArea';

import data from '../../data';

const StyledNavbar = styled.div`
  width: 70px;
  background: ${colors.grayDarker};
  position: relative;
  flex-shrink: 0;
  padding-bottom: 8px;

  .content {
    padding-bottom: 8px;

    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const GuildSeparator = styled.div`
  height: 2px;
  width: 30px;
  background: ${colors.separator};
`;

const Navbar = ({ onHomeClick, onGuildClick, selectedGuildId }: any) => (
  <StyledNavbar>
    <ScrollableArea invisible>
      <div className="content">
        <Tooltip placement="right" title={"Home"}>
          <GuildIcon isHome={true} selected={!selectedGuildId} onClick={onHomeClick} />
        </Tooltip>
        <OnlineFriendsCounter online={data.friendsOnlineCount} />

        <GuildSeparator />

        {data.guilds.map(guild => (
          <Tooltip key={guild.id} title={guild.name} placement="right">
            <GuildIcon
              name={guild.initials}
              icon={guild.icon}
              selected={selectedGuildId === guild.id}
              onClick={() => onGuildClick(guild.id)}
            />
          </Tooltip>
        ))}

        <Tooltip title="Add a Server" placement="right">
          <GuildIcon isAdd={true} />
        </Tooltip>
      </div>
    </ScrollableArea>
  </StyledNavbar>
);

export default Navbar;
