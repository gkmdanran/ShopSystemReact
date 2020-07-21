import React, { Component } from 'react';
import { Breadcrumb ,Table,Space,Button,Pagination,Input,message,Popconfirm,Tag,Modal,Form,Cascader } from 'antd';
import { EditOutlined,DeleteOutlined,PlusOutlined,QuestionCircleOutlined,CheckCircleFilled,CloseCircleFilled } from '@ant-design/icons';
import {Link} from "react-router-dom"
import "./Categories.css"
import { request } from '../../network/request';
class Categories extends Component {
  editformRef = React.createRef();
  formRef = React.createRef();
    state={
        categoriesList:[],
        pagesize:5,
        pagenum:1,
        total:0,
        editVisible:false,
        addVisible:false,
        infos:{},
        selectList:[]
    }
    columns = [
         {
           title: '分类名称',
           dataIndex: 'cat_name',
           key: 'cat_name',
           ellipsis:true
         },
         {
           title: '是否有效',
           dataIndex: 'cat_deleted',
           key: 'cat_deleted',
           render: (text, record) => (
               text===false?<CheckCircleFilled style={{color:'lightgreen'}}/>:<CloseCircleFilled style={{color:'red'}}/>
           )
         },
         {
           title: '排序',
           dataIndex: 'cat_level',
           key: 'cat_level',
           render:(text)=>{
            return text===0?<Tag color="blue">一级</Tag>:text===1?<Tag color="green">二级</Tag>:<Tag color="magenta">三级</Tag>
            }   
         },

         {
           title: '操作',
           key: 'action',
           render: (text, record) => (
             <Space size="middle">
    
              <Button type="primary" shape="round" icon={<EditOutlined />} size="small" onClick={()=>this.showEdit(record)}/>
              <Popconfirm title="删除的用户不能恢复，确定删除吗?" okText="确认" cancelText="取消" onConfirm={()=>this.sureDel(record.cat_id)} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                <Button type="danger" shape="round" icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
              
             </Space>
           ),
         },
      ]
    getCategoriesList=()=>{
        request({
            url:`categories?pagenum=${this.state.pagenum}&pagesize=${this.state.pagesize}`,
            
        }).then(res=>{
            this.setState({categoriesList:res.data.result,total:res.data.total})
        })
    }
    sureDel=(id)=>{
        request({
          url:`categories/${id}`,
          method:"delete"
        }).then(res=>{
          if(res.meta.status!==200)
          return  message.warning(res.meta.msg,0.8);
          this.getCategoriesList()
          message.success("删除分类成功",0.8);
    
        }
        )
    }
    onShowSizeChange=(current, pageSizes)=> {
        // console.log(current,pageSizes)
        this.setState({pagesize:pageSizes},()=>this.getCategoriesList())
    }
    onChange=(pageNumber)=> {
        if(pageNumber===0){
          pageNumber=1
        }
        this.setState({pagenum:pageNumber},()=>this.getCategoriesList())
    }
    showEdit(record){
       request({
         url:`categories/${record.cat_id}`
       }).then(res=>{
         if(res.meta.status===200){
          this.setState({editVisible:true,infos:res.data},()=>{
            if(this.editformRef.current){
              this.editformRef.current.resetFields();
            }
          })
         }
       })
    }
    editOk=async ()=>{
      try {
        var values = await this.editformRef.current.validateFields();
        request({
          url:`categories/${this.state.infos.cat_id}`,
          method:"put",
          data:values
        }).then(res=>{
        //  console.log(res)
         if(res.meta.status===200){
           message.success("修改分类成功",0.8);
           this.setState({editVisible:false})
           this.getCategoriesList()
         }
         else{
           this.setState({editVisible:false})
           message.warning(res.meta.msg,0.8);
         }
        })
     } catch (errorInfo) {}
    //  console.log(values)
     
    }
    addCat=()=>{
      if(this.formRef.current)
        this.formRef.current.resetFields();
      request({
        url:`categories`
      }).then(res=>{
        this.setState({addVisible:true,selectList:res.data})
      })
      
    }
    addOk=async ()=>{
      var cat_pid
      var cat_level
      try {
        var values = await this.formRef.current.validateFields();
       
        if(values.cat_pid===undefined||values.cat_pid.length===0){
          cat_pid=0
          cat_level=0
        }
        else{
          cat_level=values.cat_pid.length
          cat_pid=values.cat_pid[values.cat_pid.length-1]
        }
        request({
          url:"categories",
          method:'post',
          data:{
            cat_pid,
            cat_level,
            cat_name:values.cat_name
          }
        }).then(res=>{
          if(res.meta.status===201){
            message.success("添加分类成功",0.8);
            this.setState({addVisible:false})
            this.getCategoriesList()
          }
          else{
            this.setState({addVisible:false})
            message.warning(res.meta.msg,0.8);
          }
        })
     } catch (errorInfo) {}
    }
    // changeSelect=(value)=>{
    //   console.log(value);
    // }
    componentDidMount(){
        this.getCategoriesList()
    }
    render() {
        return (
            <div className="categories">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item><Link to="/homepage/home">首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item >商品管理</Breadcrumb.Item>
                    <Breadcrumb.Item >商品分类</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <Button type="primary" icon={<PlusOutlined /> } size="middle" onClick={this.addCat}>
                        添加分类
                    </Button>
                    <Table columns={this.columns} dataSource={this.state.categoriesList} rowKey={"cat_id"} pagination={false}/>
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
                <div className="add">
                  <Modal
                      title="添加分类"
                      visible={this.state.addVisible}
                        onOk={this.addOk}
                        onCancel={()=>{ this.setState({addVisible: false})}}
                        okText="确认" 
                        cancelText="取消"
                      >
                        
                        <Form   ref={this.formRef} labelCol= { {span: 4} } wrapperCol={ {span: 20} }>
                          <Form.Item label="分类名称" name="cat_name" rules={[
                              {
                                required: true,
                                message: '请输入分类名称',
                              },
                            ]}>
                            <Input />
                          </Form.Item>
                          <Form.Item label="父级分类" name="cat_pid" >
                              <Cascader 
                              options={this.state.selectList} 
                              // onChange={this.changeSelect}
                              fieldNames={{ label: 'cat_name', value: 'cat_id', }}
                              style={{"width":200}} 
                              changeOnSelect
                              placeholder="请选择父级分类" />
                          </Form.Item>
                          
                        </Form>
                    </Modal>
                </div>
                <div className="edit">
                  <Modal
                    title="编辑分类"
                    visible={this.state.editVisible}
                      onOk={this.editOk}
                      onCancel={()=>{ this.setState({editVisible: false})}}
                      okText="确认" 
                      cancelText="取消"
                    >
                      <Form  initialValues={this.state.infos} ref={this.editformRef}>
                        <Form.Item label="分类名称" name="cat_name" rules={[
                            {
                              required: true,
                              message: '请输入分类名称',
                            },
                          ]}>
                          <Input />
                        </Form.Item>
                        
                      </Form>
                  </Modal>
                </div>
            </div>
        );
    }
}

export default Categories;