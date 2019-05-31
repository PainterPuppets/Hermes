import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Modal, Input, Empty, Button } from 'antd';
import styled from 'styled-components';
import CommonStore from 'store/CommonStore'

import ScrollableArea from './ScrollableArea';
import UserAvatar from '../components/UserAvatar';
import searchEmpty from '../icons/search.svg';
import _ from 'lodash'
import './styles.less'



const StyledInput = styled.div`
  .ant-input{
    box-shadow: 0 2px 5px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.1);
    height: 70px;
    background-color: #72767d;
    color: #fff;
    border-radius: 5px;
    border: none;
    padding: 0px 18px;
    font-size: 22px;
  }
`;

const StyledUserList = styled.div`
  min-height: 220px;
  position: relative;
  margin: 10px 0px;
`;

const StyledUserItem = styled.div`
  margin: 0px;
  padding: 10px 10px;
  height: auto;
  border-radius: 5px;

  display: flex;
  align-items: center;
  font-size: 0.95em;

  color: #fff;
  cursor: pointer;
  border-radius: 3px;
  user-select: none;

  &.active,
  &:hover {
    background-color: rgba(32,34,37,.6);
  }
  .username {
    color: #b9bbbe;
    font-size: 1.2rem;
  }
`;


@observer
class UserProfileModal extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <Modal
        visible={CommonStore.profileModalVisible}
        centered
        title={null}
        footer={null}
        closable={false}
        onCancel={CommonStore.closeProfileModal}
      >
        <Button
          type="primary"
          className="logout-btn"
          onClick={CommonStore.logout}
        >
          Logout
        </Button>
      </Modal>
    );
  }
}

export default UserProfileModal;
