import React from 'react';
import { observer } from 'mobx-react';
import {
  Form, Icon, Input, Button, message
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import AuthStore from 'store/AuthStore';
import './style.less';

interface IProps extends FormComponentProps {
  onSuccess?: Function;
}

@observer
class SignupForm extends React.Component<IProps, {}> {
  static defaultProps: IProps;

  handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        AuthStore.signup(values.username, values.email, values.password).then(() => {
          message.success('注册成功');
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
        }).catch((err) => {
          message.error(err.response.data.detail);
        });
      }
    });
  }


  compareToFirstPassword = (rule: any, value: any, callback: { (arg0: string): void; (): void; }) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致！');
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="sigin-form">
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              { type: 'email', message: '请输入正确的邮箱' },
              { required: true, message: '请输入邮箱!' }
            ],
          })(
            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('confirm', {
            rules: [
              { required: true, message: '请确认你的密码!' },
              { validator: this.compareToFirstPassword }
            ],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="signup-form-button">
            注册
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({})(SignupForm);
