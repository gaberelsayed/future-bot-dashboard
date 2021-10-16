import '../../App.scss';
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import {
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {isMobile} from "react-device-detect";
import Logo_Light from '../../assets/img/brand/Logo_Dark.svg';
import Logo_Dark from '../../assets/img/brand/Logo_Light.svg';
import ar from '../../language/ar.json';


const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userapi: null,
      read_before: false,
      selected_guild: null,
      loading: false,
      loading_home: true,
      ar : ar,
      loading_login: false,
      loginapi: false
    };
    this.save_data = this.save_data.bind(this);
  }

  loading = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-folding sk-folding-cube"><div className="sk-cube1 sk-cube"></div><div className="sk-cube2 sk-cube"></div><div className="sk-cube4 sk-cube"></div><div className="sk-cube3 sk-cube"></div></div></div>;

  async componentWillMount () {
     if (this.check_login() !== false) {await this.get_user();} else {this.setState({loading_home:false})}
  }
  
  openlink(url) {
    return axios.get(url, {withCredentials: true});
  }

  async get_user() {
    this.openlink("https://fbot.gg/api/1/get_user")
      .then(res => {
        res.data.language = "ar";
        this.setState({"userapi": res.data,loading_home:false});
        if (res.data.theme === 'light'){require("../../App-light.scss");}
      }).catch(error => {this.setState({loading_home:false})});
    return this.state.userapi;
  }

  toast_not(type,text) {
    if (type === 'sucss'){
      return toast.success(text, {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }else if (type === 'deng'){
      return toast.error(text, {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }else{
      return toast.info(text, {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  }

  loginbut() {
    var Login_Windows = window.open("https://fbot.gg/login", "Login Into Discord", "width=500,height=500");
    this.setState({
        loading_login: true
    }, () => {
        var timer = setInterval(async () => {
            try{
              if (await this.check_login() === true && await this.get_user() !== null) {
                if (Login_Windows !== null && Login_Windows.closed !== true){
                  Login_Windows.close();
                }
              }
              if((Login_Windows === null || Login_Windows.closed) && (this.state.userapi !== null)) {
                  clearInterval(timer);
                  this.setState({loading_login:false});
              }
            }catch(e){}
        }, 2500);
    });
  }
  
  logout() {
    this.openlink("https://fbot.gg/api/1/logout")
      .catch(error => {
        if (error.response && error.response.status === 301) {
          this.setState({'loginapi': false,'userapi': null,loading_login:false});
        }
      });
    return this.state.loginapi;
  }
  
  async check_login() {
    this.openlink("https://fbot.gg/api/1/logined")
      .catch(error => {
        if (error.response && error.response.status === 301) {
          this.setState({'loginapi': true});
        } else {
          this.setState({'loginapi': false});
        }
      });
    return this.state.loginapi;
  }

  check(typeapi) {
    if (typeapi === "login"){
      this.loginbut();
    } else {
      this.logout();
    }
  }

  async select_guild(guild) {
    this.setState({loading: true});
    await axios.post('https://fbot.gg/api/1/get_guild',{guild_id:guild.id},{headers: {'Content-Type': 'application/json'},withCredentials: true})
        .then(res => {
          res.data.owner = guild.owner;
          res.data.plus = guild.plus;
          res.data.permissions = guild.permissions;
          res.data.channels.forEach((channel, index) => {
            if(channel.type === 0){
              res.data.channels[index].name = "# "+res.data.channels[index].name
            }else if (channel.type === 2){
              res.data.channels[index].name = "🔊 "+res.data.channels[index].name
            }else{
              res.data.channels[index].name = "📚 "+res.data.channels[index].name
            }
            res.data.channels[index].value = res.data.channels[index].id;
            res.data.channels[index].label = res.data.channels[index].name;
          })
          res.data.channels.forEach((channel, index) => {
            if(channel.type !== 4 && channel.parent_id !== null){
              res.data.channels.forEach((cata, ind) => {
                if (cata.type === 4 && cata.id === channel.parent_id){
                  res.data.channels[index].name = res.data.channels[index].name+" ("+res.data.channels[ind].name+")";
                  res.data.channels[index].label = res.data.channels[index].label+" ("+res.data.channels[ind].name+")";
                  return;
                }
              })
          }})
          res.data.roles.forEach((role, index) => {
            res.data.roles[index].value = res.data.roles[index].id;
            res.data.roles[index].label = res.data.roles[index].name;
          })
          res.data.roles.sort(function(a, b) { return b.position > a.position; });
          res.data.channels.sort(function(a, b) { return a.position > b.position; });
          this.setState({'selected_guild': res.data});
        }).catch(error => {
          if (error.response && error.response.status === 404) {
            window.open("https://discordapp.com/oauth2/authorize?&client_id=615277259879743491&scope=bot&permissions=8&guild_id="+guild.id+"&response_type=code&redirect_uri=http://fbot.gg/loading", "Login Into Discord", "width=500,height=500")
          } else if(error.response && error.response.status === 403){
            this.toast_not('info',this.state[this.state.userapi ? this.state.userapi.language : 'ar'].save_change.no_permission_to_edit);
          }
        });
    this.setState({loading: false});
  }
  
  async reset_guild() {
    this.setState({'selected_guild': null});
  }
  
  async change_theme() {
    this.openlink("https://fbot.gg/api/1/change_theme")
      .catch(error => {
        if (error.response && error.response.status === 301) {
          const edit_theme = this.state.userapi;
          if (this.state.userapi.theme === 'dark'){
            edit_theme['theme'] = 'light';
          } else {
            edit_theme['theme'] = 'dark';
          }
          this.setState({'userapi': edit_theme});
          window.location.reload();
        }
      });
  }

  async read_notif() {
    if (!this.state.read_before){
      this.openlink("https://fbot.gg/api/1/read_notif")
        .catch(error => {
          if (error.response && error.response.status === 301) {
            const edit_notif = this.state.userapi;
            for (var i = 0; i < edit_notif['notif'].length; i++) {
                if (edit_notif['notif'][i]['readed'] === 0){edit_notif['notif'][i]['readed'] = 2;}
            }
            this.setState({'userapi': edit_notif});
            this.setState({'read_before': true});
          }
        });
    }
  }
  
  async save_data(type,data) {
    return await axios.post('https://fbot.gg/api/1/'+type, data,{headers: {'Content-Type': 'application/json'},withCredentials: true})
    .then(res => {
      this.toast_not('sucss',this.state[this.state.userapi ? this.state.userapi.language : 'ar'].save_change.success_save);
      return true;
    }).catch(error => {return false});
  }
  
  async get_data(type) {
    return await axios.post('https://fbot.gg/api/1/'+type, {guild_id:this.state.selected_guild.id},{headers: {'Content-Type': 'application/json'},withCredentials: true})
    .then(res => {
      return res;
    }).catch(error => {return false});
  }

  render() {
    const containerStyle = {
      zIndex: 1999,
      fontSize:18
    };
    if(this.state.loading_home !== false){
      return (<div className="app">{this.loading()}</div>)
    }
    if (this.state.selected_guild !== null) {
      return (
        <div className="app">
          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader language={this.state[this.state.userapi.language]} toast_not={(type,text) => this.toast_not(type,text)} selected_guild={this.state.selected_guild} logo={this.state.userapi === null ? Logo_Dark : this.state.userapi.theme === 'dark' ? Logo_Dark : Logo_Light} change_theme={() => this.change_theme()} read_notif={() => this.read_notif()} logout={() => this.logout()} userapi={this.state.userapi} loading_login={this.state.loading_login} loginbut={() => this.loginbut()} reset_guild={() => this.reset_guild()} {...this.props}/>
            </Suspense>
          </AppHeader>
          <div className="app-body">
            <AppSidebar compact={true} fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense>
              <AppSidebarNav language={this.state[this.state.userapi.language]} navConfig={navigation} {...this.props} />
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <ToastContainer position="top-right" autoClose={3000} pauseOnFocusLoss={false} style={containerStyle}/>
              <AppBreadcrumb appRoutes={routes}/>
              <Container fluid>
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.main ? (null) : (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => (
                            <route.component toast_not={(type,text) => this.toast_not(type,text)} language={this.state[this.state.userapi.language]} isMobile={isMobile} userapi={this.state.userapi} selected_guild={this.state.selected_guild} dashboard={true} save_data = {(type,data) => this.save_data(type,data)} get_data={(type) => this.get_data(type)} {...props} />
                          )} />
                      );
                    })}
                    <Redirect from="/" to="/dashboard/main" />
                  </Switch>
                </Suspense>
              </Container>
            </main>
          </div>
          <AppFooter>
            <Suspense fallback={this.loading()}>
              <DefaultFooter />
            </Suspense>
          </AppFooter>
        </div>
      );
    } else {
      return (
        <div className="app">
          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader language={this.state[this.state.userapi ? this.state.userapi.language : 'ar']} toast_not={(type,text) => this.toast_not(type,text)} selected_guild={this.state.selected_guild} logo={this.state.userapi === null ? Logo_Dark : this.state.userapi.theme === 'dark' ? Logo_Dark : Logo_Light} change_theme={() => this.change_theme()} read_notif={() => this.read_notif()} logout={() => this.logout()} userapi={this.state.userapi} loading_login={this.state.loading_login} loginbut={() => this.loginbut()} reset_guild={() => this.reset_guild()} {...this.props}/>
            </Suspense>
          </AppHeader>
              <ToastContainer position="top-right" autoClose={3000} pauseOnFocusLoss={false} style={containerStyle}/>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.main || (route.profile && this.state.userapi) ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component toast_not={(type,text) => this.toast_not(type,text)} language={this.state[this.state.userapi ? this.state.userapi.language : 'ar']} loading_guild={this.state.loading} userapi={this.state.userapi} save_data = {(type,data) => this.save_data(type,data)} select_guild={(guild) => this.select_guild(guild)} {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/" />
                </Switch>
              </Suspense>
        </div>
      );
    }
  }
}

export default DefaultLayout;
