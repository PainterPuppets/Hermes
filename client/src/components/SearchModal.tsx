import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Modal, Input, Empty, Icon } from 'antd';
import styled from 'styled-components';
import CommonStore from 'store/CommonStore';
import UIStore from 'store/UIStore';

import ScrollableArea from './ScrollableArea';
import UserAvatar from '../components/UserAvatar';
import searchEmpty from '../icons/search.svg';
import _ from 'lodash'

// import './style.less';


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
class SearchModal extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: ''
    }
  }
  
  onFilter = _.debounce(() => {
    if (this.state.value === '') {
      return;
    }
    CommonStore.searchUser(this.state.value);
  }, 300);

  onChange = (e:any) => {
    this.setState({ value: e.target.value }, () => {
      if(this.state.value !== '') {
        this.onFilter();
      }
    })
  }

  onSelectUser = (user: any) => {
    UIStore.onClickUser(user);
    CommonStore.closeSearchModal();
  }

  render() {
    return (
      <Modal
        visible={CommonStore.searchModalVisible}
        centered
        title={null}
        footer={null}
        closable={false}
        onCancel={CommonStore.closeSearchModal}
      >
        <StyledInput>
          <Input
            value={this.state.value}
            onChange={this.onChange}
            autoFocus
            placeholder="Search User From Username"
          />
        </StyledInput>
        {CommonStore.searchValue.length === 0 ?
          <Empty
            image={searchEmpty}
            imageStyle={{
              height: 240,
              padding: 40,
              userSelect: 'none',
            }}
            description={<span></span>}
          /> :
          <StyledUserList>
            <ScrollableArea>
              {CommonStore.searchValue.map((user: any) => (
                <StyledUserItem key={user.id} onClick={() => this.onSelectUser(user)}>
                  <UserAvatar className="avatar-wrapper" avatarUrl={user.avatar_url} />
                  <span className="username">{user.username}</span>
                </StyledUserItem>
              ))}
            </ScrollableArea>
          </StyledUserList>
        }
      </Modal>
    );
  }
}

export default SearchModal;
