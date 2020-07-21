import React, { Component } from 'react';
import {Link} from "react-router-dom"
import './Rights.css';

import {request} from "../../network/request"
import { Breadcrumb,Table, Tag } from 'antd';
class Rights extends Component {
    state={
        rightsList:[],
        currentIndex:1,  //初始化的下标
    }
    columns = [
        {
            title:'序号',
            render:(text,record,index)=>{
                //生成序号
              return(
                <span>{(this.state.currentIndex-1)*10+(index+1)}</span>
              )
            },
          },
 
        {
          title: '权限名称',
          dataIndex: 'authName',
          key: 'authName',
        },
        {
            title: '路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '权限等级',
            dataIndex: 'level',
            key: 'level',
            render:(text)=>{
                return text==='0'?<Tag color="blue">一级</Tag>:text==='1'?<Tag color="green">二级</Tag>:<Tag color="magenta">三级</Tag>
            }
        },
     ]
    componentDidMount(){
        request({
            url:"rights/list"
        }).then(res=>{
            // console.log(res)
            this.setState({rightsList:res.data})
        })
    }
    render() {
        return (
            <div className="rights">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item><Link to="/homepage/home">首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item >权限管理</Breadcrumb.Item>
                    <Breadcrumb.Item >权限列表</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                <Table columns={this.columns} dataSource={this.state.rightsList} rowKey={"id"} pagination={false}/>
                </div>
            </div>
        );
    }
}

export default Rights;