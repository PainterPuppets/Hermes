import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  Form, Icon, Input, Button, Checkbox, message
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import AuthStore from 'store/AuthStore';
import './style.less';

interface Props extends FormComponentProps {
  onRegistration: Function;
  onSuccess?: Function;
  loading?: boolean;
  username?: string;
}

@observer
class LoginForm extends Component<Props, {}> {
  static defaultProps: Props;

  handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        AuthStore.login(values.userName, values.password, values.remember).then(() => {
          message.success('登录成功');
          if(this.props.onSuccess) {
            this.props.onSuccess();
          }
        }).catch((err) => {
          console.log(err)
          message.error(err.response.data.detail);
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入你的用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入你的密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住我</Checkbox>
          )}
          {/* <a className="login-form-forgot" href="">忘记密码</a> */}
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          或者 <span className="clickable-text" onClick={() => this.props.onRegistration()}>立刻注册！</span>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({})(LoginForm);
