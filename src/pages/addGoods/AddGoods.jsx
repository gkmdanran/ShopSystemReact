import React, { Component } from 'react';
import { Breadcrumb ,Alert,Steps,Tabs,Form,Input,Cascader} from 'antd';
import {Link} from "react-router-dom"
import "./AddGoods.css"
import { request } from '../../network/request';
const { Step } = Steps;
const { TabPane } = Tabs;

class AddGoods extends Component {
    formRef = React.createRef();
    state={
        currentKey:0,
        selectList:[],       
    }
    rules={
        'goods_cat':[
            {
              required: true,
              message: '请选择所属分类',
            },
            () => ({
              validator(rule, value) {
                  
                if (value.length===3||value.length===0) {
                  return Promise.resolve();
                }
                return Promise.reject('请选择第三级分类');
              },
            }),
          ],
        'goods_name':[{required: true,message: '请填写商品名称'},],
        'goods_price':[
            {required: true,message: '请填写商品价格'},
            () => ({
                validator(rule, value) {
                    if (value===''&&(value-'')>=0) {
                        return Promise.resolve();
                    }
                    return Promise.reject('请输入正确数值');
                },
            })
        ],
        'goods_number':[{required: true,message: '请填写商品数量'},() => ({
            validator(rule, value) {
                if (value===''&&(value-'')>=0) {
                    return Promise.resolve();
                }
                return Promise.reject('请输入正确数值');
            },
        })],
        'goods_weight':[{required: true,message: '请填写商品重量'},() => ({
            validator(rule, value) {
                if (value===''&&(value-'')>=0) {
                    return Promise.resolve();
                }
                return Promise.reject('请输入正确数值');
            },
        })],
    }

    changeTabs=(key)=>{
       
        this.setState({currentKey:key-1})
    }
    componentDidMount(){
        request({
            url:`categories`
          }).then(res=>{
            this.setState({selectList:res.data})
          })
    }
    changeSelect=(value)=>{
        if(value.length!==3){
            console.log(1)
        }        
    }
    render() {
        return (
            <div className="AddGoods">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item><Link to="/homepage/home">首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item >商品管理</Breadcrumb.Item>
                    <Breadcrumb.Item ><Link to="/homepage/goods">商品列表</Link></Breadcrumb.Item>
                    <Breadcrumb.Item >添加商品</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                <Alert message="添加商品信息" type="info" showIcon />
                <Steps size="small" current={this.state.currentKey}>
                    <Step title="基本信息" />
                    <Step title="商品参数" />
                    <Step title="商品属性" />
                    <Step title="商品图片" />
                    <Step title="商品内容" />
                    <Step title="完成" />
                </Steps>
                <Form   ref={this.formRef} labelCol= { {span: 2} } wrapperCol={ {span: 6} } >
                    <Tabs tabPosition="left" onChange={this.changeTabs} >
                        <TabPane tab="基本信息" key="1">
                            <Form.Item label="商品名称" name="goods_name"  rules={this.rules['goods_name']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="商品价格" name="goods_price"  rules={this.rules['goods_price']}>
                                <Input type="number"/>
                            </Form.Item>
                            <Form.Item label="商品重量" name="goods_weight"  rules={this.rules['goods_weight']}>
                                <Input type="number"/>
                            </Form.Item>
                            <Form.Item label="商品数量" name="goods_number"  rules={this.rules['goods_number']}>
                                <Input type="number"/>
                            </Form.Item>
                            <Form.Item label="父级分类" name="goods_cat" 
                            rules={this.rules['goods_cat']}>
                              <Cascader 
                              options={this.state.selectList} 
                              onChange={this.changeSelect}
                              fieldNames={{ label: 'cat_name', value: 'cat_id', }}
                              style={{"width":200}} 
                              placeholder="请选择父级分类" 
                              />
                          </Form.Item>
                        </TabPane>
                        <TabPane tab="商品参数" key="2">
                            Content of Tab 2
                        </TabPane>
                        <TabPane tab="商品属性" key="3">
                            Content of Tab 3
                        </TabPane>
                        <TabPane tab="商品图片" key="4">
                            Content of Tab 4
                        </TabPane>
                        <TabPane tab="商品内容" key="5">
                            Content of Tab 5
                        </TabPane>
                        
                    </Tabs>
                </Form>
                </div>
            </div>
        );
    }
}

export default AddGoods;