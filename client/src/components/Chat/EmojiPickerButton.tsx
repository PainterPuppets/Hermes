import React, { useState } from 'react';
import styled from 'styled-components';
import emojiSprite from '../../icons/emojiSprite.png';
import EmojiPicker from './EmojiPicker';

const EMOJIS_COUNT = 50;
const EMOJIS_COLUMNS = 11;
const ITEM_SIZE = 22;

const StyledEmojiPickerButton = styled.span`
  background: 0;
  padding: 0;
  margin: 0;
  border: 0;
  outline: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 44px;
  flex: 0 0 auto;

  :hover .sprite {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.275);
  }

  .sprite {
    width: 22px;
    height: 22px;

    background-image: url(${emojiSprite});
    background-repeat: no-repeat;
    background-size: 242px 110px;

    transition: filter 0.1s ease-in-out, opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
    filter: grayscale(100%);
    opacity: 0.3;
  }
`;

const StyledEmojiPicker = styled(EmojiPicker)`
  position: absolute;
  bottom: calc(100% + 10px);
  right: 0px;
`;

const EmojiPickerButton = ({ onEmojiSelect }: any) => {
  const [index, setIndex] = useState(0);
  const [emojipicker, setEmojipicker] = useState(false);

  const pickRandomIndex = () => {
    setIndex(Math.floor(Math.random() * EMOJIS_COUNT));
  };

  const handleEmojiSelect = (emoji: any) => {
    setEmojipicker(false)
    onEmojiSelect(emoji);
  }

  const x = (index % EMOJIS_COLUMNS) * ITEM_SIZE;
  const y = Math.floor(index / EMOJIS_COLUMNS) * ITEM_SIZE;
  const backgroundPosition = `-${x}px -${y}px`;

  return (
    <React.Fragment>
      <StyledEmojiPickerButton onMouseEnter={pickRandomIndex} onClick={() => setEmojipicker(true)}>
        <div className="sprite" style={{ backgroundPosition }} />
      </StyledEmojiPickerButton>
  
      <StyledEmojiPicker
        className="hermes-emoji-picker"
        title="Emoji"
        set='emojione'
        onClick={handleEmojiSelect}
        onClickOutside={() => setEmojipicker(false)}
        visible={emojipicker}
      />
    </React.Fragment>
  );
};

export default EmojiPickerButton;
