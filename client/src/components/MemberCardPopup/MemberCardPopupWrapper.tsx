import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

import MemberCard from './MemberCard';

const fadeInAnimation = ({ direction }: { direction: 'left' | 'right' }) => keyframes`
  from {
    opacity: 0;
    transform: translateX(
      ${{ left: '15%', right: '-15%' }[direction || 'left']}
    );
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const StyledMemberCardPopupWrapper = styled.div<{ position?: { x: any; y: any; }, direction: 'left' | 'right' }>`
  position: absolute;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(32, 34, 37, 0.6);
  z-index: 1000;

  top: ${props => props.position && props.position.y}px;
  left: ${props => props.position && props.position.x}px;

  animation: ${props => fadeInAnimation} ease-in 0.1s forwards;
`;

const MemberCardPopupWrapper = ({ direction, position, member, guildRolesList, onClose }: any) => {
  const node = useRef<HTMLDivElement>(null);

  const handleDocumentClick = (e: any) => {
    if (!node.current) {
      return;
    }
    if (node.current.contains(e.target)) {
      return;
    }

    onClose();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick, false);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick, false);
    };
  }, []);

  return (
    <StyledMemberCardPopupWrapper ref={node} direction={direction} position={position}>
      <MemberCard member={member} guildRolesList={guildRolesList} />
    </StyledMemberCardPopupWrapper>
  );
};

export default MemberCardPopupWrapper;
