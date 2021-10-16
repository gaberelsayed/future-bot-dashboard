import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Badge, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Progress } from 'reactstrap';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import 'ladda/dist/ladda-themeless.min.css';
import {MobileView} from "react-device-detect";
import { AppSwitch } from '@coreui/react';
import { generateCustomPlaceholderURL } from 'react-placeholder-image';

const propTypes = {
  notif: PropTypes.bool,
  accnt: PropTypes.bool,
  login: PropTypes.bool,
  tasks: PropTypes.bool,
};
const defaultProps = {
  notif: false,
  accnt: false,
  login: false,
  tasks: false,
};

class DefaultHeaderDropdown extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggle_but = this.toggle_but.bind(this);
    this.state = {
      expRight: false,
      dropdownOpen: false
    };
  }
  
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  toggle_but(name) {
    console.log(this.state[name])
    this.setState({
      [name]: !this.state[name],
      progress: 0.5
    })
  }

  dropNotif() {
    return (
      <Dropdown nav className="d-md-down-none" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle onClick={() => this.props.read_notif()} nav>
          <i className="icon-bell"></i>{this.props.user_notif.filter(item => item.readed === 0).length !== 0 ? <Badge pill color="danger">{this.props.user_notif.filter(item => item.readed === 0).length}</Badge> : null}
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header tag="div" className="text-center"><strong>{this.props.language.titles.notification.replace("[count]",this.props.user_notif.filter(item => item.readed === 0 || item.readed === 2).length)}</strong></DropdownItem>
          {this.props.user_notif.filter(item => item.readed === 0 || item.readed === 2).length !== 0 ?
            this.props.user_notif.map((notif_id,idx) => { if (notif_id['readed'] !== 1) {
              return (
                <DropdownItem key={idx}>
                  <div className="text-uppercase mb-1">
                    <strong><b><i className={notif_id['icon']}></i> {notif_id['msg_'+this.props.userapi.language]}</b></strong>
                  </div>
                  <small className="text-muted"><i className="fa fa-calendar-check-o"></i> rwar{notif_id['time']}</small>
                </DropdownItem>
              );} else{return (null);}
              
            })
          : <DropdownItem><i className="fa fa-thumbs-up"></i> {this.props.language.titles.no_notification}</DropdownItem>}
        </DropdownMenu>
      </Dropdown>
    );
  }

  dropAccnt(ty) {
    if(ty === true){
        return <LaddaButton className="btn btn-success btn-ladda" loading={this.props.loading_login} onClick={() => this.props.loginbut()} data-color="green" data-style={EXPAND_RIGHT}>{this.props.language.titles.login}</LaddaButton>
    }
    return (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <img src={this.props.user_avatar ? "https://cdn.discordapp.com/avatars/"+this.props.user_id+"/"+this.props.user_avatar+".jpg" : generateCustomPlaceholderURL(250, 250, {backgroundColor: '#262b2f',textColor: '#ffffff',text: this.props.userapi.username.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')})} alt={this.props.user_id} className="img-avatar"/>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header tag="div" className="text-center"><strong>{this.props.language.titles.account}</strong></DropdownItem>
          <MobileView>
              <DropdownItem href="#/" onClick={this.props.reset_guild}><i className="icon-home" ></i> {this.props.language.titles.home}</DropdownItem>
          </MobileView>
          <DropdownItem href="#/Profile"><i className="fa fa-address-card-o" ></i> {this.props.language.titles.profile}</DropdownItem>
          {this.props.admin.is === true &&
            <DropdownItem href="#/Cp"><i className="fa fa-pencil-square-o" ></i> CP</DropdownItem>
          }
          <div className="dropdown-item"><i className="fa fa-moon-o"></i>{this.props.language.titles.dark} <AppSwitch className={'float-right'} onClick={() => this.props.change_theme()} variant={'pill'} label color={'primary'} checked={this.props.user_theme === 'dark' ? true : false} size={'sm'}/></div>
          <MobileView>
              <DropdownItem onClick={this.props.upload_centre}><i className="fa fa-upload" ></i> {this.props.language.titles.upload}</DropdownItem>
              <DropdownItem onClick={this.props.embed_centre}><i className="fa fa-code" ></i> {this.props.language.titles.embed_creator}</DropdownItem>
              <DropdownItem onClick={() => window.open("https://discord.gg/y8GyPdf", '_blank')}><i className="fa fa-question-circle" ></i> {this.props.language.titles.support}</DropdownItem>
          </MobileView>
          <DropdownItem divider />
          <DropdownItem onClick={() => {this.props.onLogout()}}><i className="fa fa-lock"></i> {this.props.language.titles.logout}</DropdownItem>
          {/*<DropdownItem><i className="fa fa-lock"></i> Logout</DropdownItem>*/}
        </DropdownMenu>
      </Dropdown>
    );
  }

  dropTasks() {
    return (
      <Dropdown nav className="d-md-down-none" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav>
          <i className="icon-list"></i><Badge pill color="warning">{this.props.user_tasks.length}</Badge>
        </DropdownToggle>
        <DropdownMenu right className="dropdown-menu-lg">
          <DropdownItem header tag="div" className="text-center"><strong>{this.props.language.titles.tasks.replace("[count]",this.props.user_tasks.length)}</strong></DropdownItem>
          {this.props.user_tasks.map((task_id,idx) => {
            return (
              <DropdownItem key={idx}>
                <div className="small mb-1"><strong>{task_id[this.props.userapi.language]}</strong><span
                  className="float-right"><strong>{task_id['percent_now']}%</strong></span></div>
                <Progress className="progress-xs" color="info" value={task_id['percent_now']} />
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    const { notif, accnt, tasks, login } = this.props;
    return (
        notif ? this.dropNotif() :
          accnt ? this.dropAccnt() :
            login ? this.dropAccnt(true) :
              tasks ? this.dropTasks() : null
    );
  }
}

DefaultHeaderDropdown.propTypes = propTypes;
DefaultHeaderDropdown.defaultProps = defaultProps;

export default DefaultHeaderDropdown;
