import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import  { MessageType } from '../../constant';
import { Input, Upload } from 'antd';

import AttachButton from './AttachButton';
import NewMessageButtons from './NewMessageButtons';

const { TextArea } = Input;

const StyledNewMessageForm = styled.form`
  border-radius: 5px;
  background: rgba(114, 118, 125, 0.3);
  display: flex;
  align-items: center;
`;

const StyledDivider = styled.div`
  margin: 0 0;
  width: 1px;
  height: 34px;
  background-color: hsla(0, 0%, 100%, 0.1);
`;

const StyledTextarea = styled.div`
  width: 100%;
  .ant-input {
    margin: 2px 2px 2px 0;
    background: 0;
    border: 0;
    outline: 0;
    color: hsla(0, 0%, 100%, 0.7);
    font-size: 0.9375rem;
    letter-spacing: -0.025rem;
    line-height: 1.25rem;
    max-height: 144px;
    min-height: 20px;
    padding: 10px;
    resize: none;
    width: 100%;
    &:focus {
      box-shadow: none;
    }

    &::-webkit-input-placeholder {
      user-select: none;
      color: #949494;
    }
    &:-moz-placeholder {
      user-select: none;
      color: #949494;
    }
    &:-ms-input-placeholder {
      user-select: none;
      color: #949494;
    }
  }
`;

@observer
class NewMessageForm extends Component<any, any> {
  textArea: any;
  constructor(props: any) {
    super(props);
    this.state = {
      value: '',
    }
  }

  onPressEnter = (event: any) => {
    event && event.preventDefault();
    if (this.state.value === '') {
      return;
    }
    this.props.onSend(MessageType.TEXT, this.state.value)
    this.setState({
      value: '',
    })
  }

  handleEmojiSelect = (emoji: any) => {
    this.setState({ value: this.state.value + emoji.native });
    this.textArea.focus();
  }

  
  beforeUpload = (file: Blob) => {
    let type = MessageType.FILE
  
    const imageFileTypes = ["image/png", "image/jpeg", "image/gif"];
    if (imageFileTypes.indexOf(file.type) > -1) {
      type = MessageType.IMAGE
    }
  
    this.props.onSend(type, '', file);
    return false;
  }

  render() {
    return (
    <StyledNewMessageForm>
      <Upload
        name="file"
        className={`file-uploader ${this.props.className}`}
        showUploadList={false}
        multiple={false}
        beforeUpload={this.beforeUpload}
      >
        <AttachButton />
      </Upload>

      <StyledDivider />

      <StyledTextarea>
        <TextArea
          ref={(e) => this.textArea = e}
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
          className="scrollbar-tiny"
          placeholder={`Message ${(this.props.isPrivate ? '@' : '#') + this.props.channelName}`}
          autosize={{ minRows: 1, maxRows: 6 }}
          onPressEnter={this.onPressEnter}
        />
      </StyledTextarea>

      <NewMessageButtons onEmojiSelect={this.handleEmojiSelect}/>
    </StyledNewMessageForm>
    )
  }
}
// const NewMessageForm = ({ channelName, isPrivate }: any) => (
//   <StyledNewMessageForm>
//     <AttachButton />

//     <StyledDivider />

//     <StyledTextarea>
//       <TextArea
//         className="scrollbar-tiny"
//         placeholder={`Message ${(isPrivate ? '@' : '#') + channelName}`}
//         autosize={{ minRows: 1, maxRows: 6 }}
//         onPressEnter={}
//       />
//     </StyledTextarea>

//     <NewMessageButtons />
//   </StyledNewMessageForm>
// );

export default NewMessageForm;
