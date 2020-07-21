import React from 'react';
import { Form, Input, Button, message,Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "./Login.css"
import homebackground from"../../../src/logo.svg"

import {request} from "../../network/request"
const Login=(props)=> {
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  const onFinish = values => {
    
    request({
      method: "post",
      url:'login',
      params:values
    }).then(res=>{
     
      if(res.meta.status!==200){
        onReset()
        return message.warning(res.meta.msg,0.8);
      }
      message.success("登录成功",0.8);
      window.sessionStorage.setItem("token", res.data.token);
      props.history.push("./homepage")
    }
      
    )
   
  };

  return (
    <div className="login">
      <div className="infos">
        <div className="logo">
          <img src={homebackground} alt=""/>
        </div>
        <Form
          name="normal_login"
          className="login-form"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item >
          <Row>
              <Col span={5} offset={6}>
                <Button type="primary" htmlType="submit" >
                  登录
                </Button>
              </Col>
              <Col span={5} offset={2}>
                <Button htmlType="button" onClick={onReset} >
                  重置
                </Button>
              </Col>
          </Row>
            
            
          </Form.Item>
        </Form>
      </div>
      
    </div>
  );
}




export default Login;