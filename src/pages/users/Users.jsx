import React,{Component} from 'react';
import {Link} from "react-router-dom"
import './Users.css';
import {request} from "../../network/request"

import { Breadcrumb ,Table,Space,Button,Switch,Pagination,Input,message,Popconfirm,Modal,Form,Select } from 'antd';
import { EditOutlined,DeleteOutlined,EyeOutlined,PlusOutlined,QuestionCircleOutlined } from '@ant-design/icons';
const { Search } = Input;
const { Option } = Select;
class Users extends Component {
  
  formRef = React.createRef();
  editformRef = React.createRef();
  state={
    userList:[],
    roleList:[],
    size:5,
    num:1,
    query:"",
    total:0,
    addVisible:false,
    editVisible:false,
    roleVisible:false,
    infos:{},
    currentIndex:1,  //初始化的下标
    selectValue:''
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
       title: '姓名',
       dataIndex: 'username',
       key: 'username',
     },
     {
       title: '邮箱',
       dataIndex: 'email',
       key: 'email',
     },
     {
       title: '电话',
       dataIndex: 'mobile',
       key: 'mobile',
     },
     {
       title: '角色',
       dataIndex: 'role_name',
       key: 'role_name',
     },
     {
       title: '状态',
       dataIndex: 'mg_state',
       key: 'mg_state',
       render: (text, record) => (
         <Switch checked={record.mg_state}  onChange={()=>this.changeStatus(text,record.id)} />
       ),
     },
     {
       title: '操作',
       key: 'action',
       render: (text, record) => (
         <Space size="middle">

          <Button type="primary" shape="round" icon={<EditOutlined />} size="small" onClick={()=>this.showEdit(record)}/>
          <Popconfirm title="删除的用户不能恢复，确定删除吗?" okText="确认" cancelText="取消" onConfirm={()=>this.sureDel(record.id)} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
            <Button type="danger" shape="round" icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
          <Button type="ghost" shape="round" icon={<EyeOutlined />} size="small" onClick={()=>this.showRole(record)}/>
         </Space>
       ),
     },
  ]
  rules={
    "userName":[
      { required: true, message: '请输入用户名', whitespace:false},
    ],
    "password":[
      { required: true, message: '请输入用密码', whitespace:true},
    ],
    "email":[
      { required: true, message: '请输入用邮箱', },
      {pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ,message: '邮箱格式不正确'}
    ],
    "phone":[
      { required: true, message: '请输入用电话', },
      {pattern: /^1[34578]\d{9}$/,message: '手机号格式不正确'}
    ],
  }
  getUserList=()=>{
     request({
       url:`users?query=${this.state.query}&pagesize=${this.state.size}}&pagenum=${this.state.num}`,
     }).then(res=>{
      //  console.log(res.data)
      this.setState({userList:res.data.users,total:res.data.total})
     })
  }
  onShowSizeChange=(current, pageSizes)=> {
    // console.log(current,pageSizes)
    this.setState({size:pageSizes},()=>this.getUserList())
  }
  onChange=(pageNumber)=> {
    if(pageNumber===0){
      pageNumber=1
    }
    this.setState({num:pageNumber},()=>this.getUserList())
  }
  searchUser=(value)=>{
    
    this.setState({query:value},()=>this.getUserList())
  }
  changeStatus=(checked,id)=>{
   
    request({
      url:`users/${id}/state/${!checked}`,
      method:"put"
    }).then(res=>{
      if(res.meta.status===200){
        this.getUserList()
        message.success("修改用户状态成功",0.8);
      } 
    })
  }
  sureDel=(id)=>{
    console.log(id)
    request({
      url:`users/${id}`,
      method:"delete"
    }).then(res=>{
      if(res.meta.status!==200)
      return  message.warning(res.meta.msg,0.8);
      this.getUserList()
      message.success("删除用户成功",0.8);
      
    })
  }
  addUser=()=>{
    if(this.formRef.current)
      this.formRef.current.resetFields();
    this.setState({addVisible:true})
  }
  addOk=async () => {
    try {
       var values = await this.formRef.current.validateFields();
       request({
        url:`users`,
        method:"post",
        data:values
      }).then(res=>{
        // console.log(res)
        if(res.meta.status===201){
          message.success("添加用户成功",0.8);
          this.setState({addVisible:false})
          this.getUserList()
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
      request({
        url:`users/${this.state.infos.id}`,
        method:"put",
        data:values
      }).then(res=>{
      //  console.log(res)
       if(res.meta.status===200){
         message.success("修改用户成功",0.8);
         this.setState({editVisible:false})
         this.getUserList()
       }
       else{
         this.setState({editVisible:false})
         message.warning(res.meta.msg,0.8);
       }
      })
   } catch (errorInfo) {}
  //  console.log(values)
   
  }
  showEdit=(infos)=>{
      
    this.setState({editVisible: true,infos:infos},()=>{
      if(this.editformRef.current){
        this.editformRef.current.resetFields();
      }
    })
    
    
    // console.log(infos)
  }
  showRole=(record)=>{
      // this.setState({selectValue:''},()=>console.log(this.state.selectValue))
      request({
        url:"roles"
      }).then(res=>{
        this.setState({roleVisible:true,infos:record,roleList:res.data},()=>console.log(this.state.roleList))
      })
  }
  selectChange=(value)=>{
    console.log(1)
    this.setState({selectValue:value})
  }
  roleOk=()=>{
    if(this.state.selectValue!==''){
      request({
        url:`users/${this.state.infos.id}/role`,
        method:"put",
        data:{rid:this.state.selectValue}
      }).then(res=>{
        if(res.meta.status===200){
          this.getUserList()
          this.setState({roleVisible:false})
          message.success("设置角色成功",0.8);
        }
        else{
          message.warning(res.meta.msg,0.8);
        }
      })
    }
    else{
      message.warning("请选择角色",0.8);
    }
    
  }
  componentDidMount(){
    this.getUserList()
  }
  render() {
   return (
    <div className="users">
      <Breadcrumb separator=">">
        <Breadcrumb.Item><Link to="/homepage/home">首页</Link></Breadcrumb.Item>
        <Breadcrumb.Item >用户管理</Breadcrumb.Item>
        <Breadcrumb.Item >用户列表</Breadcrumb.Item>
      </Breadcrumb>
      <div className="card">
      <Search
        placeholder="请输入姓名..."
        onSearch={value => this.searchUser(value)}
        style={{ width: 200 }}
        allowClear
      /><Button type="primary" icon={<PlusOutlined /> } size="middle" onClick={this.addUser}>
          添加用户
        </Button>
        <Table columns={this.columns} dataSource={this.state.userList} rowKey={"id"} pagination={false}/>
        <div className="pag">
        <Pagination 
          showQuickJumper 
          showSizeChanger 
          showTotal={total => `共 ${total} 条`}
          defaultCurrent={this.state.num} 
          defaultPageSize={this.state.size}
          total={this.state.total}  
          onShowSizeChange={this.onShowSizeChange}  
          onChange={this.onChange}
          pageSizeOptions={[1,2,5]}
        />
        </div>
        
      </div>
      <div className="add">
        <Modal
        title="添加用户"
        visible={this.state.addVisible}
          onOk={this.addOk}
          onCancel={()=>{ this.setState({addVisible: false})}}
          okText="确认" 
          cancelText="取消"
        >
          <Form  ref={this.formRef} >
            <Form.Item label="姓名" name="username" rules={this.rules['userName']}>
              <Input />
            </Form.Item>
            <Form.Item label="密码" name="password" rules={this.rules['password']}>
              <Input />
            </Form.Item>
            <Form.Item label="邮箱" name="email" rules={this.rules['email']}>
              <Input />
            </Form.Item>
            <Form.Item label="电话" name="mobile" rules={this.rules['phone']}>
              <Input />
            </Form.Item>
           
          </Form>
        </Modal>
      </div>
      <div className="edit">
        <Modal
        title="编辑用户"
        visible={this.state.editVisible}
          onOk={this.editOk}
          onCancel={()=>{ this.setState({editVisible: false})}}
          okText="确认" 
          cancelText="取消"
        >
          <Form  initialValues={this.state.infos} ref={this.editformRef}>
            <Form.Item label="姓名" name="username" rules={this.rules['userName']}>
              <Input disabled/>
            </Form.Item>
            <Form.Item label="邮箱" name="email" rules={this.rules['email']}>
              <Input />
            </Form.Item>
            <Form.Item label="电话" name="mobile" rules={this.rules['phone']}>
              <Input />
            </Form.Item>
           
          </Form>
        </Modal>
      </div>
      <div className="addrole">
        <Modal
        title="分配角色"
        visible={this.state.roleVisible}
          onOk={this.roleOk}
          onCancel={()=>{ this.setState({roleVisible: false})}}
          okText="确认" 
          cancelText="取消"
        >
          
          <p><span>当前的用户：</span><span>{this.state.infos.username}</span></p>
          <p><span>当前的角色：</span><span>{this.state.infos.role_name}</span></p>
          <div>
            <span>分配新角色：</span>
            <Select style={{ width: 150 }} onChange={this.selectChange}>
                {
                  this.state.roleList.map(x=> <Option value={x.id} key={x.id} >{x.roleName}</Option>)
                }
            </Select>
          </div>
        </Modal>
      </div>
    </div>

   );
 
  }
}

export default Users;
