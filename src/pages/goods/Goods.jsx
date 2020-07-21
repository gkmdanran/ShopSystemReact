import React, { Component } from 'react';
import {Link} from "react-router-dom"
import { Breadcrumb ,Table,Space,Button,Pagination,Input,message,Popconfirm} from 'antd';
import { EditOutlined,DeleteOutlined,PlusOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import './Goods.css';
import { request } from '../../network/request';
import dateFormat from '../../utils/dateFormat';
const { Search } = Input;


class Goods extends Component {
  state={
    goodsList:[],
    pagesize:5,
    pagenum:1,
    query:'',
    total:0
  }
  columns = [
    {
      title:'序号',
      width:80,
      render:(text,record,index)=>{
          //生成序号
        return(
          <span>{(index+1)}</span>
        )
      },
    },
     {
       title: '商品名称',
       dataIndex: 'goods_name',
       key: 'goods_name',
       ellipsis:true
     },
     {
       title: '商品价格（元）',
       dataIndex: 'goods_price',
       key: 'goods_price',
       width:150
     },
     {
       title: '商品重量',
       dataIndex: 'goods_weight',
       key: 'goods_weight',
       width:100
     },
     {
       title: '创建时间',
       dataIndex: 'add_time',
       key: 'add_time',
       width:180,
       render:(text)=>{
         return <span>{dateFormat(text)}</span>
       }
     },
     
     
     {
       title: '操作',
       key: 'action',
       width:200,
       render: (text, record) => (
         <Space size="middle">

          <Button type="primary" shape="round" icon={<EditOutlined />} size="small" />
          <Popconfirm title="删除的用户不能恢复，确定删除吗?" okText="确认" cancelText="取消" onConfirm={()=>this.sureDel(record.goods_id)} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
            <Button type="danger" shape="round" icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
          
         </Space>
       ),
     },
  ]
  getGoodsList=()=>{
    request({
      url:`goods?query=${this.state.query}&pagesize=${this.state.pagesize}&pagenum=${this.state.pagenum}`
    }).then(res=>{
      this.setState({goodsList:res.data.goods,total:res.data.total},()=>console.log(this.state))
    })
  }
  onShowSizeChange=(current, pageSizes)=> {
    // console.log(current,pageSizes)
    this.setState({pagesize:pageSizes},()=>this.getGoodsList())
  }
  onChange=(pageNumber)=> {
    if(pageNumber===0){
      pageNumber=1
    }
    this.setState({pagenum:pageNumber},()=>this.getGoodsList())
  }
  sureDel=(id)=>{
    request({
      url:`goods/${id}`,
      method:"delete"
    }).then(res=>{
      if(res.meta.status!==200)
      return  message.warning(res.meta.msg,0.8);
      this.getGoodsList()
      message.success("删除商品成功",0.8);

    }
    )
  }
  searchGoods=(value)=>{
    
    this.setState({query:value},()=>this.getGoodsList())
  }
  toAdd=()=>{
    this.props.history.push("/homepage/goods/addgoods")
  }
  componentDidMount(){
   this.getGoodsList()
  }
  render() {
    return (
      <div className="goods">
         <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to="/homepage/home">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item >商品管理</Breadcrumb.Item>
          <Breadcrumb.Item >商品列表</Breadcrumb.Item>
        </Breadcrumb>
        <div className="card">
          <Search
            placeholder="请输入商品名..."
            onSearch={value => this.searchGoods(value)}
            style={{ width: 200 }}
            allowClear
          /><Button type="primary" icon={<PlusOutlined /> } size="middle" onClick={this.toAdd}>
              添加商品
            </Button>
            <Table columns={this.columns} dataSource={this.state.goodsList} rowKey={"goods_id"} pagination={false}/>
            <div className="pag">
              <Pagination 
                showQuickJumper 
                showSizeChanger 
                showTotal={total => `共 ${total} 条`}
                defaultCurrent={this.state.pagenum} 
                defaultPageSize={this.state.pagesize}
                total={this.state.total}  
                onShowSizeChange={this.onShowSizeChange}  
                onChange={this.onChange}
                pageSizeOptions={[1,2,5]}
              />
            </div>
            
        </div>
      </div>
    
    );
  }
}

export default Goods;