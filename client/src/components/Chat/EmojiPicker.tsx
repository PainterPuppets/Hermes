import React from 'react';
import { observer } from 'mobx-react';
import onClickOutside from 'react-onclickoutside';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

@observer
class CommentEmojiPicker extends React.Component<any, any> {
  handleClickOutside=() => {
    this.props.onClickOutside();
  }

  render() {
    const { visible, className, onClickOutside } = this.props;
  
    return (
      <div className={className}>
        <Picker 
          style={{ 
            visibility: visible ? 'visible' : 'hidden',
            opacity: visible ? 1 : 0,
            transition: 'all .2s'
          }} 
          {...this.props}
        />
      </div>
    )
  }
}

export default onClickOutside(CommentEmojiPicker);
