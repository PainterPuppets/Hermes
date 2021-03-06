import React from 'react';
import styled from 'styled-components';
import { Badge } from 'antd';
import colors from '../../utils/colors';
import DiscordIcon from '../../icons/Discord';

const StyledGuildIcon = styled.a<{ selected: boolean, icon: string }>`
  margin-top: 10px;
  width: 50px;
  height: 50px;

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  background: ${props => (props.selected ? colors.primary : colors.grayNormal)};
  background-image: ${props => props.icon && `url(${props.icon})`};
  background-size: cover;
  background-position: center;
  border-radius: ${props => (props.selected ? '15px' : '50%')};

  transition: 0.3s ease;
  text-decoration: none;
  color: #fff;
  user-select: none;

  &.add {
    background: transparent;
    border: 1px dashed ${colors.addGuildBorder};
    color: ${colors.addGuildBorder};

    font-weight: 400;
    font-size: 2.1em;

    :hover,
    :focus,
    :active {
      border-color: hsla(0, 0%, 100%, 0.75);
      color: hsla(0, 0%, 100%, 0.75);
    }
  }

  :hover:not(.add),
  :focus:not(.add),
  :active:not(.add) {
    background-color: ${colors.primary};
    color: hsla(0, 0%, 100%, 0.75);
    border-radius: 15px;
  }

  ::before {
    content: ' ';
    display: ${props => (props.selected ? 'block' : 'none')};
    width: 10px;
    height: 40px;
    position: absolute;
    left: -15px;
    border-radius: 20px;
    background: #fff;
  }
`;

const StyledBadge = styled(Badge)`
  color: #fff !important;
  .ant-badge-count {
    box-shadow: none;
    text-align: center;
    background: #f04747;
    transform: translate(0px, 45px);
  }
`

const HomeIcon = styled(DiscordIcon)`
  color: ${colors.homeIcon};
  width: 100%;
  height: 100%;
  padding: 5px;
`;

const GuildIcon = ({ name, icon, selected, isHome, isAdd, onClick, unReadCount,  ...props }: any) => {
  let content = name;
  if (isHome) {
    content = <HomeIcon />;
  }
  if (isAdd) {
    content = '+';
  }

  return (
    <StyledBadge count={unReadCount || 0} overflowCount={99}>
      <StyledGuildIcon
        selected={selected}
        icon={icon}
        onClick={onClick}
        className={isAdd ? 'add' : ''}
        {...props}
      >
        {!icon ? content : ''}
      </StyledGuildIcon>
    </StyledBadge>
  );
};

export default GuildIcon;
