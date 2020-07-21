import React, { Component } from 'react';
import "./Roles.css"
import {Link} from "react-router-dom"
import { Breadcrumb ,Table,Space,Button,Input,message,Popconfirm,Modal,Form,Tag,Row,Col,Tree} from 'antd';
import { EditOutlined,DeleteOutlined,SettingOutlined,PlusOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import { request } from '../../network/request';
class Roles extends Component {
    formRef = React.createRef();
    editformRef = React.createRef();
    state={
        rolesList:[],
        tableList:[],
        addVisible:false,
        roleVisible:false,
        editVisible:false,
        infos:{},
        rightsList:[]
    }
    columns = [
        {
            title:'序号',
            render:(text,record,index)=>{
                //生成序号
              return(
                <span>{(index+1)}</span>
              )
            },
          },
         {
           title: '角色名称',
           dataIndex: 'roleName',
           key: 'roleName',
         },
         {
            title: '角色描述',
            dataIndex: 'roleDesc',
            key: 'roleDesc',
          },
         {
           title: '操作',
           key: 'action',
           render: (text, record) => (
             <Space size="middle">
    
              <Button type="primary" shape="round" icon={<EditOutlined />} size="small" onClick={()=>this.showEdit(record.id)}/>
              <Popconfirm title="删除的角色不能恢复，确定删除吗?" okText="确认" cancelText="取消" onConfirm={()=>this.sureDel(record.id)} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                <Button type="danger" shape="round" icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
              <Button type="ghost" shape="round" icon={<SettingOutlined />} size="small" onClick={()=>this.showRole(record.id)}/>
             </Space>
           ),
         },
    ]
     layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      };
      
    rules={
        "roleName":[
          { required: true, message: '请输入用户名', whitespace:false},
        ],
    }
    showEdit=(id)=>{
        console.log(id)
        request({
            url:`roles/${id}`
        }).then(res=>{
            this.setState({editVisible: true,infos:res.data},()=>{
                if(this.editformRef.current){
                    this.editformRef.current.resetFields();
                }
            })
        })
       
        
        
        // console.log(infos)
    }
    sureDel=(id)=>{
       
        request({
          url:`roles/${id}`,
          method:"delete"
        }).then(res=>{
          if(res.meta.status!==200)
          return  message.warning(res.meta.msg,0.8);
          this.getRolesList()
          message.success("删除角色成功",0.8);
          
        })
    }
    getRolesList=()=>{
        request({
            url:"roles"
        }).then(res=>{
            var list=[]
            for(let x of res.data){
                list.push({id:x.id,roleName:x.roleName,roleDesc:x.roleDesc,child:x.children})
            }
            this.setState({rolesList:res.data,tableList:list},()=>console.log(this.state.tableList))
        })
    }
    addRole=()=>{
        if(this.formRef.current)
            this.formRef.current.resetFields();
        this.setState({addVisible: true})
    }
    addOk=async () => {
        try {
           var values = await this.formRef.current.validateFields();
           if(values.roleDesc===undefined||values.roleDesc.trim()==="")
            values.roleDesc="暂无描述"
            console.log(values)
           request({
            url:`roles`,
            method:"post",
            data:values
          }).then(res=>{
            // console.log(res)
            if(res.meta.status===201){
              message.success("添加角色成功",0.8);
              this.setState({addVisible:false})
              this.getRolesList()
            }
            else{
              this.setState({addVisible:false})
              message.warning(res.meta.msg,0.8);
            }
          })
        } catch (errorInfo) {}
        // console.log(values)
     
      };
    editOk=async ()=>{
        try {
          var values = await this.editformRef.current.validateFields();
          if(values.roleDesc===undefined||values.roleDesc.trim()==="")
          values.roleDesc="暂无描述"
          request({
            url:`roles/${this.state.infos.roleId}`,
            method:"put",
            data:values
          }).then(res=>{
           console.log(res)
           if(res.meta.status===200){
             message.success("修改角色成功",0.8);
             this.setState({editVisible:false})
             this.getRolesList()
           }
           else{
             this.setState({editVisible:false})
             message.warning(res.meta.msg,0.8);
           }
          })
       } catch (errorInfo) {}
      //  console.log(values)
       
    }
    delTag(role,rightId){
      // console.log(roleId,rightId)
      request({
        url:`roles/${role.id}/rights/${rightId}`,
        method:'delete'
      }).then(res=>{
        if(res.meta.status!==200)
          return  message.warning(res.meta.msg,0.8);
        role.child=res.data
        this.setState({tableList:this.state.tableList})
        message.success("删除权限成功",0.8);
      })
    }
    showRole(id){
      request({
        url:"rights/tree"
      }).then(res=>{
        if(res.meta.status===200){
          this.setState({roleVisible: true,rolesList:res.data},()=>console.log(this.state.rolesList))
        }
      })
     
    }
    componentDidMount(){
        this.getRolesList()
    }
    render() {
        return (
            <div className="roles">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item><Link to="/homepage/home">首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item >权限管理</Breadcrumb.Item>
                    <Breadcrumb.Item >角色列表</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <Button type="primary" icon={<PlusOutlined /> } size="middle" onClick={this.addRole}>
                    添加角色
                    </Button>
                    <Table columns={this.columns} 
                        dataSource={this.state.tableList} 
                        rowKey={"id"} 
                        pagination={false}
                        expandable={{
                            
                          expandedRowRender: record => record.child.map((x,i)=>{   
                            return (
                              <Row className={['bdbottom',i===0?'bdtop':'',"vcenter"]} key={x.id}>
                                <Col  span={5}>
                                  <Tag color="blue"  closable onClose={()=>this.delTag(record,x.id)}>{x.authName}</Tag>
                                </Col>
                                <Col span={19}>
                                  {
                                    x.children.map((y,j)=>{
                                      return  (
                                        <Row className={['bdbottom',j===0?'bdtop':'',"vcenter"]}  key={y.id}>
                                          <Col span={6}>
                                            <Tag color="green" closable onClose={()=>this.delTag(record,y.id)}>{y.authName}</Tag>
                                          </Col>
                                          <Col span={18}>
                                            {
                                              y.children.map((z,k)=>{
                                                return <Tag color="magenta" key={z.id} closable onClose={()=>this.delTag(record,z.id)}>{z.authName}</Tag>
                                              })
                                            }
                                          </Col>
                                        </Row>
                                      )
                                    })
                                  }
                                </Col>
                                
                              </Row>)
                          })
                          }}
                    />
                </div>
                <div className="add">
                    <Modal
                    title="添加角色"
                    visible={this.state.addVisible}
                    onOk={this.addOk}
                    onCancel={()=>{ this.setState({addVisible: false})}}
                    okText="确认" 
                    cancelText="取消"
                    >
                    <Form  ref={this.formRef} {...this.layout}>
                        <Form.Item label="角色名称" name="roleName" rules={this.rules['roleName']} >
                        <Input />
                        </Form.Item>
                        <Form.Item label="角色描述" name="roleDesc" >
                        <Input />
                        </Form.Item>
                    </Form>
                    </Modal>
                </div>
                <div className="edit">
                    <Modal
                    title="编辑角色"
                    visible={this.state.editVisible}
                    onOk={this.editOk}
                    onCancel={()=>{ this.setState({editVisible: false})}}
                    okText="确认" 
                    cancelText="取消"
                    >
                    <Form  initialValues={this.state.infos} ref={this.editformRef} {...this.layout}>
                        <Form.Item label="角色名称" name="roleName" rules={this.rules['roleName']} >
                        <Input />
                        </Form.Item>
                        <Form.Item label="角色描述" name="roleDesc" >
                        <Input />
                        </Form.Item>
                    </Form>
                    </Modal>
                </div>
                <div className="addrole">
                    <Modal
                    title="分配权限"
                    visible={this.state.roleVisible}
                    // onOk={this.editOk}
                    onCancel={()=>{ this.setState({roleVisible: false})}}
                    okText="确认" 
                    cancelText="取消"
                    >
                      <Tree
                        checkable
                        treeData={this.state.rolesList}
                      />
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Roles;