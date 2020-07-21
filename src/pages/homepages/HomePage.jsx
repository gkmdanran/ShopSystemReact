import React,{useEffect,useState} from 'react';
import "./HomePage.css"
import {request} from "../../network/request"
import { Layout , Menu} from 'antd';
import {UserOutlined,EditFilled,ShoppingFilled,FileTextFilled,FundFilled,AppstoreOutlined} from '@ant-design/icons';
import Goods from "../goods/Goods"
import Users from "../users/Users"
import Rights from "../rights/Rights"
import Roles from "../roles/Roles"
import Home from "../Home/Home"
import Categories from "../categories/Categories"
import AddGoods from "../addGoods/AddGoods"
import {Route,Redirect,Switch} from "react-router-dom"
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const HomePage=(props)=> {
  const icons={
    125:<UserOutlined/>,
    103:<EditFilled/>,
    101:<ShoppingFilled/>,
    102:<FileTextFilled/>,
    145:<FundFilled/>
  }
  const [menuList,setMenuList]=useState([])
  const [collapsed,setCollapsed]=useState(false)
  
  const getMenuList=()=>{
    request({
      url:'menus',
    }).then(res=>{
      // const menuList=res.data
      setMenuList(res.data)
     
    })
  }
  const onCollapse = collapsed => {
    setCollapsed(collapsed)
  };
  const toPages=(path)=>{
    props.history.push("/homepage/"+path)
  }
  const LoginOut=()=>{
    window.sessionStorage.clear()
    props.history.push("/login")
  }
  useEffect(()=>{
    getMenuList()
    // eslint-disable-next-line 
  },[])
  
  return (
    <div className="homepage">
      <Layout>  
          <Header>
            <div className="title">电商后台管理系统</div>
            <div className="out"><button onClick={()=>{LoginOut()}}>退出</button></div>
          </Header>  
        <Layout>
          <Sider  collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              {
                menuList.map((item)=><SubMenu key={item.id} icon={icons[item.id]} title={item.authName}>
                  {
                    item.children.map((x,i)=><Menu.Item key={x.id}  icon={<AppstoreOutlined />} onClick={()=>{toPages(x.path)}}>{x.authName}</Menu.Item>)
                   
                  }
                </SubMenu>)
              }
            </Menu>
          </Sider>
              
          <Content> 
            
          <Switch>
              <Redirect from="/homepage" to="/homepage/home" exact/>
              <Route path="/homepage/goods" component={Goods} exact></Route>
              <Route path="/homepage/home" component={Home} exact></Route>
              <Route path="/homepage/users" component={Users} exact></Route>
              <Route path="/homepage/rights" component={Rights} exact></Route>
              <Route path="/homepage/roles" component={Roles} exact></Route>
              <Route path="/homepage/categories" component={Categories} exact></Route>
              <Route path="/homepage/goods/addgoods" component={AddGoods} exact></Route>
          </Switch>
            
              
          </Content>
          
        </Layout>
      </Layout>
     
    </div>
  );
}

export default HomePage;
