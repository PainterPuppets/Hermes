import React from 'react';
import styled from 'styled-components';
import DiscordIcon from '../icons/Discord';

const StyledLoading = styled.div`
  height: 100%;
  width: 100%;
//   flex: 0 0 auto;
//   padding: 0 8px 0 12px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), 0 2px 0 rgba(0, 0, 0, 0.06);
//   color: #fff;
//   z-index: 99;
`;

const Loading = () => (
  <StyledLoading>
    <DiscordIcon />
  </StyledLoading>
);

export default Loading;
