import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Progress,TabPane,Nav,NavLink,TabContent,NavItem,Label,Input,FormGroup,ListGroup,ListGroupItem,InputGroup,InputGroupAddon,InputGroupText,FormText,Modal, ModalBody, ModalFooter, ModalHeader, Button,Collapse } from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import Select, {Creatable} from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import {toast} from 'react-toastify';
import { css } from 'glamor';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import cloneDeep from 'lodash/cloneDeep';
import YouTube from 'react-youtube';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import axios from 'axios';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Moment from 'react-moment';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import moment from 'moment';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

const columns = [
  {
  dataField: 'to',
  text: 'Product Price',
  filter: textFilter()
}];

const DragHandle = sortableHandle(() => <InputGroupText><i className="fa fa-list"></i></InputGroupText>);

const SortableContainer = sortableContainer(({children}) => {
  return <ListGroup>{children}</ListGroup>;
});

function seconds_to_days_hours_mins_secs_str(seconds)
{ // day, h, m and s
  var days     = Math.floor(seconds / (24*60*60));
      seconds -= days    * (24*60*60);
  var hours    = Math.floor(seconds / (60*60));
      seconds -= hours   * (60*60);
  var minutes  = Math.floor(seconds / (60));
      seconds -= minutes * (60);
  return ((0<days)?(days+" day, "):"")+((0<hours)?(hours+"h, "):"")+((0<minutes)?(minutes+"m, "):"")+seconds+"s";
}


class Logs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      copy_data: null,
      changed: false,
      toast_id: null,
      model_member: false,
      model_all: false,
      modal_listgroup: false,
      change_all: [],
      accordion: [false, false],
      activeTab: new Array(2).fill('1'),
      colorPickerShowing : false,
      loading: false
    };
    this.edit_data = this.edit_data.bind(this);
    this.toggle_member = this.toggle_member.bind(this);
    this.toggle_all = this.toggle_all.bind(this);
    this.load_member = this.load_member.bind(this);
    this.toggle_listgroup = this.toggle_listgroup.bind(this);
    this.member_name = this.member_name.bind(this);
    this.member_roles = this.member_roles.bind(this);
    this.toggle_tab = this.toggle_tab.bind(this);
    this.tabPane = this.tabPane.bind(this);
    this.id_type = this.id_type.bind(this);
    this.id_type_text = this.id_type_text.bind(this);
  }

  async componentDidMount(){
    const get_data = await this.props.get_data("logs")
    if(get_data !== false){
        const members_list = []
        const members_json = JSON.parse(get_data.data.members)
        Object.keys(members_json).forEach(function(key) {
            members_list.push(members_json[key]);
        });
        get_data.data.members = members_list.reverse()
        get_data.data.types_type = {};
        get_data.data.types_by = {};
        get_data.data.types_to = {};
        get_data.data.logs.forEach((log,index) => {
            if (!(log.whatsis in get_data.data.types_type)){
                get_data.data.types_type[log.whatsis] = log.whatsis
            }
            if (!(log.by in get_data.data.types_by) && this.id_type_text(log.by.toString(),get_data.data.members) !== null){
                get_data.data.types_by[log.by.toString()] = this.id_type_text(log.by.toString(),get_data.data.members)
            }
            console.log(this.id_type_text(log.to.toString(),get_data.data.members))
            if (!(log.to in get_data.data.types_to) && this.id_type_text(log.to.toString(),get_data.data.members) !== null){
                get_data.data.types_to[log.to.toString()] = this.id_type_text(log.to.toString(),get_data.data.members)
            }
        })
        get_data.data.save = {main_log_channel:get_data.data.main_log_channel,guild_id:get_data.data.guild_id}
        this.setState({data:get_data.data,copy_data:cloneDeep(get_data.data)})
    }
  }
  componentWillUnmount() {
    if(this.state.toast_id){
      toast.dismiss(this.state.toast_id)
      this.setState({toast_id:null})
    }
  }

  toggle_tab(tabPane,tab) {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray,
    });
  }

    info_area(cell, row, enumObject, index) {
      return (
        <>
            <Input type="textarea" value={cell}/>
        </>
      );
    }

    id_type(cell, row, enumObject, index) {
      const type_id = cell;
      if (type_id === this.props.selected_guild.id.toString()){
          return (
            <div className="text-center">
               Server
            </div>
          );
      }
      else if (this.state.data.members.find(el => {return el.id.toString() === type_id})){
          const member = this.state.data.members.find(el => {return el.id.toString() === type_id});
          member.color = member.color.replace("000000","ffffff");
          return (
            <div className="text-center" onClick={() => this.load_member(member)} style={{cursor: 'pointer'}}>
                <div className="avatar avatar-xm">
                    <img onError={this.addDefaultSrc} src={member.avatar} className="img-avatar" alt={member.id} />
                    <span className={"avatar-status badge-"+(member.status === "online" ? "success" : member.status === "dnd" ? "danger" : member.status === "idle" ? "warning" : "secondary")}></span>
                </div>
                <Label className="ml-2">
                    {member.nick && <strong style={{display:"block",color:`${member.color}`}}>{member.nick}</strong>}
                    {!member.nick ? <strong style={{color:`${member.color}`}}>{member.name}<FormText style={{display:"inline"}}>#{member.discriminator}</FormText></strong> : <FormText style={{display:"inline"}} className="mt-0"><strong style={{color:`${member.color}`}}>{member.name}</strong><FormText style={{display:"inline"}}>#{member.discriminator}</FormText></FormText>}
                    {" "}{member.bot ? (<span class="badge" style={{backgroundColor:"#7289da"}}> BOT </span>) : null}
                    <FormText>ID: {member.id}</FormText>
                </Label>
            </div>
           );
      }
      else if (this.props.selected_guild.roles.find(el => {return el.id.toString() === type_id})){
          const item = this.props.selected_guild.roles.find(el => {return el.id.toString() === type_id});
          return (
            <div className="text-center">
                <Label>
                    <span class="badge m-1" style={{borderWidth: 0.2, borderColor: "#"+(item.color !== 0 && (item.color + Math.pow(16, 6)).toString(16).substr(-6).toUpperCase()), borderStyle:'solid'}}><div className="mr-1" style={{display:"inline",color:"#"+(item.color !== 0 && (item.color + Math.pow(16, 6)).toString(16).substr(-6).toUpperCase())}}>⬤</div>{item.name}</span>
                    <FormText>ID: {item.id}</FormText>
                </Label>
            </div>
          );
      }
      else if (this.props.selected_guild.channels.find(el => {return el.id.toString() === type_id})){
        const channel = this.props.selected_guild.channels.find(el => {return el.id.toString() === type_id});
          return (
            <div className="text-center">
                <Label>
                    <strong>{channel.name}</strong>
                    <FormText>ID: {channel.id}</FormText>
                </Label>
            </div>
          );
      }
      if(type_id === cell){
          return null
      }
      return (
        <>
        {type_id}
        </>
      );
    }

    id_type_text(type_id,members_list) {
      const members = this.state.data ? this.state.data.members : members_list
      if (type_id.toString()=== this.props.selected_guild.id.toString()){
          return "Server";
      }
      else if (members.find(el => {return el.id.toString() === type_id.toString()})){
          const member = members.find(el => {return el.id.toString() === type_id.toString()});
          member.color = member.color.replace("000000","ffffff");
          return (member.name+"#"+member.discriminator);
      }
      else if (this.props.selected_guild.roles.find(el => {return el.id.toString() === type_id.toString()})){
          const item = this.props.selected_guild.roles.find(el => {return el.id.toString() === type_id.toString()});
          return ("@"+item.name);
      }
      else if (this.props.selected_guild.channels.find(el => {return el.id.toString() === type_id.toString()})){
        const channel = this.props.selected_guild.channels.find(el => {return el.id.toString() === type_id.toString()});
          return channel.name;
      }
      return null
    }

  tabPane() {
    return (
      <>
        <TabPane tabId="1" style={{paddingLeft:"0px",paddingRight:"0px"}}>
            <BootstrapTable data={this.state.now_member.logs} version="4" columns={ columns } filter={ filterFactory() } striped hover pagination search bordered={ false } options={{
              sortIndicator: true,
              hideSizePerPage: true,
              paginationSize: 3,
              hidePageListOnlyOnePage: true,
              clearSearch: true,
              alwaysShowAllBtns: false,
              withFirstAndLast: false,
            }}>
              <TableHeaderColumn dataAlign="center" isKey width={"15%"} dataField="whatsis" filter={{type: 'SelectFilter',options: this.state.now_member.types_type}} dataSort>Type</TableHeaderColumn>
              <TableHeaderColumn dataAlign="center" width={"20%"} dataField="by" dataFormat={this.id_type} filter={{type: 'SelectFilter',options: this.state.now_member.types_by}} dataSort>By</TableHeaderColumn>
              <TableHeaderColumn dataAlign="center" width={"20%"} dataField="to" dataFormat={this.id_type} filter={{type: 'SelectFilter',options: this.state.now_member.types_to}} dataSort>To</TableHeaderColumn>
              <TableHeaderColumn dataAlign="center" width={"30%"} dataField="info" dataFormat={this.info_area} dataSort>Info</TableHeaderColumn>
              <TableHeaderColumn dataAlign="center" width={"15%"} dataField="time" dataSort>Time</TableHeaderColumn>
            </BootstrapTable>
        </TabPane>
        <TabPane tabId="2">
            <BootstrapTable data={this.state.now_member.warns} version="4" columns={ columns } filter={ filterFactory() } striped hover pagination search bordered={ false } options={{
              sortIndicator: true,
              hideSizePerPage: true,
              paginationSize: 3,
              hidePageListOnlyOnePage: true,
              clearSearch: true,
              alwaysShowAllBtns: false,
              withFirstAndLast: false,
            }}>
              <TableHeaderColumn dataAlign="center" isKey width={"10%"} dataField="col" dataSort>ID</TableHeaderColumn>
              <TableHeaderColumn dataAlign="center" width={"20%"} dataField="bywho" dataFormat={this.id_type} filter={{type: 'SelectFilter',options: this.state.now_member.types_by_warns}} dataSort>By</TableHeaderColumn>
              <TableHeaderColumn dataAlign="center" width={"30%"} dataField="reason" dataFormat={this.info_area} dataSort>Reason</TableHeaderColumn>
            </BootstrapTable>
        </TabPane>
      </>
    );
  }

  toggle_member () {
    this.setState({
      now_member: this.state.model_member ? this.state.now_member : null,
      model_member: !this.state.model_member,
    });
  }

  toggle_all () {
    this.setState({
      model_all: !this.state.model_all,
    });
  }

  load_member(member) {
    this.setState({
      now_member: null,
      model_member: true,
    }, () => {
      axios.post('https://fbot.gg/api/1/member', {guild_id:this.props.selected_guild.id,member_id:member.id},{headers: {'Content-Type': 'application/json'},withCredentials: true})
      .then(res => {
        member.logs = res.data.logs;
        member.warns = res.data.warns;
        member.inviter = res.data.inviter;
        member.url = res.data.url;
        member.time = res.data.time;
        member.total_inviter = res.data.total_inviter;
        member.types_type = {};
        member.types_by = {};
        member.types_by_warns = {};
        member.types_to = {};
        member.logs.forEach((log,index) => {
            if (!(log.whatsis in member.types_type)){
                member.types_type[log.whatsis] = log.whatsis
            }
            if (!(log.by in member.types_by)){
                if(this.id_type_text(log.by)){
                    member.types_by[log.by] = this.id_type_text(log.by)
                }
            }
            if (!(log.to in member.types_to)){
                if(this.id_type_text(log.to)){
                    member.types_to[log.to] = this.id_type_text(log.to)
                }
            }
        })
        member.warns.forEach((warn,index) => {
            if (!(warn.bywho in member.types_by_warns)){
                if(this.id_type_text(warn.bywho)){
                    member.types_by_warns[warn.bywho] = this.id_type_text(warn.bywho)
                }
            }
        })
        this.setState({
          now_member: member,
        });
      }).catch(error => {});
    });
  }

  toggle_listgroup(key) {
    if (key !== "open_close"){
      this.setState({
        now_listgroup_key: key,
        modal_listgroup: !this.state.modal_listgroup,
      });
    }else{
      this.setState({
        modal_listgroup: !this.state.modal_listgroup,
      });
    }
  }

  handleClickColor = () => {
    this.setState({ colorPickerShowing: !this.state.colorPickerShowing })
  };

  handleCloseColor = () => {
    this.setState({ colorPickerShowing: false })
  };

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  edit_data(event) {
    var new_data = {...this.state.data}
    if(event.target.type === "checkbox"){
      new_data.save[event.target.id] = event.target.checked;
    } else {
      new_data.save[event.target.id] = event.target.value;
    }
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

  edit_list(event) {
    if (this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      if(event.target.type === "checkbox"){
        new_data.list[this.state.now_listgroup_key][event.target.id] = event.target.checked;
      }else if (event.target.type === "number"){
        new_data.list[this.state.now_listgroup_key][event.target.id] = parseInt(event.target.value, 10);
      }else{
        new_data.list[this.state.now_listgroup_key][event.target.id] = event.target.value;
      }
      this.setState({
        data:new_data,
      });
      this.check_data_save(new_data);
    }
  }

  edit_list_multi(value) {
    if (this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      const new_value = [];
      value.forEach((v, i) => {
        new_value.push(v.id)
      })
      new_data.list[this.state.now_listgroup_key].roles = new_value;
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
  }

  add_new_list(value) {
    var new_data = {...this.state.data}
    new_data.list.push({reason :null,time:0,roles:[]});
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

  delete_list(key) {
    var new_data = {...this.state.data}
    new_data.list[key] = null;
    new_data.list = new_data.list.filter(item => item !== null)
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

  edit_data_color(id,event) {
    var new_data = {...this.state.data}
    new_data[id] = event.hex.replace("#","0x");
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

  edit_data_multi_commands(id,value) {
    var new_data = {...this.state.data}
    const new_value = [];
    value.forEach((v, i) => {
      new_value.push(v)
    })
    new_data[id] = new_value;
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

  check_data_save(new_data){
    let main = JSON.stringify(new_data.save)
    let copy = JSON.stringify(this.state.copy_data.save)
    if (!this.state.changed && copy !== main){
      this.setState({changed:true});
      this.save_botton_show("show");
    }else if(this.state.changed && copy === main){
      this.setState({changed:false});
      this.save_botton_show("hide");
    }
  }

  async send_save(type){
    this.setState({loading:true});
    if(this.state.toast_id){
      toast.update(this.state.toast_id,{
      render:
      <div>{this.props.language.save_change.text}
      <LaddaButton className="btn btn-success btn-ladda float-right ml-1" loading={true} onClick={() => {this.send_save("save");}} data-color="success" data-style={EXPAND_RIGHT}>{this.props.language.save_change.save}</LaddaButton>
      <LaddaButton className="btn btn-secondary btn-ladda float-right" loading={true} onClick={() => {this.send_save("back");}} data-color="secondary" data-style={EXPAND_RIGHT}>{this.props.language.save_change.back}</LaddaButton>
      </div>
      ,
      });
    }
    if(type === "save"){
      var new_data = {...this.state.data}
      if(await this.props.save_data("logs_save",new_data.save) === true){
        this.setState({copy_data:cloneDeep(this.state.data),changed:false,loading:false});
        this.save_botton_show("hide");
      }else{
        this.setState({loading:false});
      }
    }else{
      this.setState({loading:false});
      this.setState({data:cloneDeep(this.state.copy_data),changed:false,loading:false});
      this.save_botton_show("hide");
    }
  }

  save_botton_show(type) {
    if(type === "show"){
      if(!this.state.toast_id){
        const toast_id = toast.info(
        <div>{this.props.language.save_change.text}
        <LaddaButton className="btn btn-success btn-ladda float-right ml-1" loading={this.state.loading} onClick={() => {this.send_save("save");}} data-color="success" data-style={EXPAND_RIGHT}>{this.props.language.save_change.save}</LaddaButton>
        <LaddaButton className="btn btn-secondary btn-ladda float-right" loading={this.state.loading} onClick={() => {this.send_save("back");}} data-color="secondary" data-style={EXPAND_RIGHT}>{this.props.language.save_change.back}</LaddaButton>
        </div>
        , {
        position: "bottom-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        closeButton: false,
        pauseOnHover: false,
        draggable: false,
        className: css({
          background: this.props.userapi.theme === 'dark' ? '#515b65' : '#e4e5e6',
          color: this.props.userapi.theme === 'dark' ? 'white' : 'black',
        }),
        });
        this.setState({toast_id:toast_id})
      }
    }else{
      if(this.state.toast_id){
        toast.dismiss(this.state.toast_id)
        this.setState({toast_id:null})
      }
    }
  }

  addDefaultSrc(ev){
    ev.target.src = 'http://bl3rbe.net/up/1o2pMKnetym4.png';
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    var new_data = {...this.state.data}
    new_data.list = arrayMove(new_data.list, oldIndex, newIndex)
    this.setState({
      data:new_data,
    });
    this.check_data_save(new_data);
  };
  
    member_name(cell, row, enumObject, index) {
      const member = row
      member.color = member.color.replace("000000","ffffff")
      return (
      <div className="text-center">
        <Label>
            {member.nick && <strong style={{display:"block",color:`${member.color}`}}>{member.nick}</strong>}
            {!member.nick ? <strong style={{color:`${member.color}`}}>{member.name}<FormText style={{display:"inline"}}>#{member.discriminator}</FormText></strong> : <FormText style={{display:"inline"}} className="mt-0"><strong style={{color:`${member.color}`}}>{member.name}</strong><FormText style={{display:"inline"}}>#{member.discriminator}</FormText></FormText>}
            {" "}{member.bot ? (<span class="badge" style={{backgroundColor:"#7289da"}}> BOT </span>) : null}
            <FormText>ID: {member.id}</FormText>
        </Label>
      </div>
      );
    }

    member_xp(cell, row, enumObject, index) {
      const member = row
      member.color = member.color.replace("000000","ffffff")
      var now_percent = member.lvl_need !== "0" ? (member.now_exp !== "0" ? (parseInt(member.now_exp, 10)/parseInt(member.lvl_need, 10)*100): 0) : 0;
      var total_time = member.voice_xp !== "0" ? seconds_to_days_hours_mins_secs_str(parseInt(member.voice_xp, 10)) : "0s";
      return (
      <div className="text-center">
          <div className="clearfix">
            <div className="float-left">
              <strong>Lv.{member.level} <FormText style={{display:"inline"}}>(Total XP: {parseInt(member.total_exp, 10)})</FormText></strong>
            </div>
            <div className="float-right">
              <small className="text-muted">Now XP: {member.now_exp}</small>
            </div>
          </div>
          <Progress animated className="progress-sm" color="success" value={now_percent}>%{now_percent}</Progress>
          <div className="clearfix">
            <div className="float-left">
              🔊<strong className="text-muted">Voice: {member.voice_xp !== "0" ? total_time.toString('H:mm:ss') : total_time}<FormText style={{display:"inline"}}>(#{member.rank_voice})</FormText></strong>
            </div>
            <div className="float-right">
              #<strong className="text-muted">Messages: {member.text_xp}<FormText style={{display:"inline"}}>(#{member.rank_text})</FormText></strong>
            </div>
          </div>
      </div>
      );
    }

    member_roles(cell, row, enumObject, index) {
      const member = row
      member.color = member.color.replace("000000","ffffff")
      var now_percent = member.exp_need !== "0" ? (member.need_exp !== "0" ? (parseInt(member.need_exp, 10)/parseInt(member.exp_need, 10)*100): 0) : 0;
      var total_time = member.voice_xp !== "0" ? new Date(parseInt(member.voice_xp, 10) * 1000) : "0s";
      return (
      <div className="text-center">
        {this.props.selected_guild.roles.filter(role => member.roles.includes(role.id)).map((item, i) => <span class="badge m-1" style={{borderWidth: 0.2, borderColor: "#"+(item.color !== 0 && (item.color + Math.pow(16, 6)).toString(16).substr(-6).toUpperCase()), borderStyle:'solid'}}><div className="mr-1" style={{display:"inline",color:"#"+(item.color !== 0 && (item.color + Math.pow(16, 6)).toString(16).substr(-6).toUpperCase())}}>⬤</div>{item.name}</span>)}
      </div>
      );
    }

    member_avatar(cell, row, enumObject, index) {
      const member = row
      member.color = member.color.replace("000000","ffffff")
      return (
        <div className="text-center">
            <div className="avatar avatar-xm">
                <img onError={this.addDefaultSrc} src={member.avatar} className="img-avatar" alt={member.id} />
                <span className={"avatar-status badge-"+(member.status === "online" ? "success" : member.status === "dnd" ? "danger" : member.status === "idle" ? "warning" : "secondary")}></span>
            </div>
        </div>
      );
    }

    member_age(cell, row, enumObject, index) {
      const member = row
      member.color = member.color.replace("000000","ffffff")
      return (
      <div className="text-center">
        <FormText className="mt-0">Created: <Moment format="YYYY-MM-DD h:mm:ss a" unix>{member.created_at}</Moment> (<Moment fromNow ago unix>{member.created_at}</Moment>)</FormText>
        <FormText className="mt-0">Joined: <Moment format="YYYY-MM-DD h:mm:ss a" unix>{member.joined_at}</Moment> (<Moment fromNow ago unix>{member.joined_at}</Moment>)</FormText>
      </div>
      );
    }


  render() {
    const dark_1 = this.props.userapi.theme === 'dark' ? '#515b65' : '#e4e5e6';
    const dark_2 = this.props.userapi.theme === 'dark' ? '#23282c' : '#e4e7ea';
    const dark_3 = this.props.userapi.theme === 'dark' ? '#3a4149' : '#fff';
    const dark_black = this.props.userapi.theme === 'dark' ? 'white' : 'black';
    
    const colourStyles = {
      menuList: (styles, { data }) => {
        return {
          ...styles,
          backgroundColor: dark_1,
        };
      },
      singleValue: styles => ({ ...styles, color: dark_black}),
      input: styles => ({ ...styles, color: dark_black}),
      control: styles => ({ ...styles, backgroundColor: dark_1,borderColor: dark_2,':hover': {borderColor: dark_2},':focus': {borderColor: dark_black}}),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          backgroundColor: dark_1,
          color: dark_black,
          cursor: isDisabled ? 'not-allowed' : 'default',
          ':hover': {
            backgroundColor: dark_3,
          },
        };
      },
      multiValue: (styles, { data }) => {
        return {
          ...styles,
          backgroundColor: dark_1,
        };
      },
      multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: dark_black,
        backgroundColor: dark_3,
      }),
      multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: dark_black,
        backgroundColor: dark_3,
        ':hover': {
          backgroundColor: 'red',
          color: dark_black,
        },
      }),
    };
    const styles = reactCSS({
      'default': {
        color: {
          height: '14px',
          borderRadius: '2px',
          background: ``,
        },
        swatch: {
          background: `${this.props.userapi ? this.props.userapi.theme === 'dark' ? '#515b65' : '#fff' : '#515b65'}`,
          border : `${this.props.userapi ? this.props.userapi.theme === 'dark' ? '1px solid #23282c' : '1px solid #8ad4ee' : '1px solid #23282c'}`,
          borderRadius: '0.25rem',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    if(!this.state.data){
      return (<div className="animated fadeIn pt-1 text-center"><div className="sk-folding sk-folding-cube"><div className="sk-cube1 sk-cube"></div><div className="sk-cube2 sk-cube"></div><div className="sk-cube4 sk-cube"></div><div className="sk-cube3 sk-cube"></div></div></div>)
    }
    return (
      <CSSTransitionGroup transitionName="fadeInput"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" sm="12" md="12">
            <Card>
              <CardHeader>
                <i className="fa fa-balance-scale"></i><strong>السجلات</strong>
              </CardHeader>
              <CardBody style={{paddingLeft:"0px",paddingRight:"0px"}} className="text-center">
				  <Modal isOpen={this.state.model_member} style={{maxWidth : '1200px'}} toggle={this.toggle_member} className={this.props.className}>
					<ModalHeader toggle={this.toggle_member}><i className="fa fa-balance-scale"></i> معاينة العضو</ModalHeader>
					<ModalBody>
                      { (!this.state.now_member) ?
                        <div className="animated fadeIn pt-1 text-center"><div className="sk-folding sk-folding-cube"><div className="sk-cube1 sk-cube"></div><div className="sk-cube2 sk-cube"></div><div className="sk-cube4 sk-cube"></div><div className="sk-cube3 sk-cube"></div></div></div>
                      :
                          <FormGroup>
                            <Row>
                                <Col xs="12" sm="12" md="12">
                                    <div className="text-center">
                                        <div className="avatar avatar-lg">
                                            <img onError={this.addDefaultSrc} src={this.state.now_member.avatar} className="img-avatar" alt={this.state.now_member.id} />
                                            <span className={"avatar-status badge-"+(this.state.now_member.status === "online" ? "success" : this.state.now_member.status === "dnd" ? "danger" : this.state.now_member.status === "idle" ? "warning" : "secondary")}></span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs="4" sm="4" md="4">
                                   <InputGroupText className="m-0 mb-1 mt-1">Member</InputGroupText>
                                   {this.state.now_member.nick && <InputGroupText className="m-0 mb-1 mt-1">Nickname</InputGroupText>}
                                   <InputGroupText className="m-0 mb-1 mt-1">ID</InputGroupText>
                                   <InputGroupText className="m-0 mb-1 mt-1">Created</InputGroupText>
                                   <InputGroupText className="m-0 mb-1 mt-1">Joined</InputGroupText>
                                   {!(this.state.now_member.total_inviter === 0) &&
                                    <InputGroupText className="m-0 mb-1 mt-1">Total Invites</InputGroupText>
                                   }
                                  {this.state.now_member.inviter &&
                                      <>
                                          <InputGroupText className="m-0 mb-1 mt-1">Inviter</InputGroupText>
                                          <InputGroupText className="m-0 mb-1 mt-1">Inviter URL</InputGroupText>
                                          <InputGroupText className="m-0 mb-1 mt-1">Inviter Time</InputGroupText>
                                      </>
                                  }
                                   <InputGroupText className="m-0 mb-1 mt-1">Roles</InputGroupText>
                                </Col>
                                <Col xs="8" sm="8" md="8">
                                  <InputGroup className="m-0 mb-1 mt-1">
                                    <Input style={{color:`${this.state.now_member.color}`}} type="text" className="input-sm form-control-sm" value={this.state.now_member.name}/>
                                    <InputGroupAddon addonType="append">
                                      <InputGroupText>#{this.state.now_member.discriminator}</InputGroupText>
                                    </InputGroupAddon>
                                  </InputGroup>
                                  {this.state.now_member.nick && 
                                      <InputGroup className="m-0 mb-1 mt-1">
                                        <Input type="text" className="input-sm form-control-sm" value={this.state.now_member.nick}/>
                                      </InputGroup>
                                  }
                                  <InputGroup className="m-0 mb-1 mt-1">
                                    <Input type="text" className="input-sm form-control-sm" value={this.state.now_member.id}/>
                                  </InputGroup>
                                  <InputGroup className="m-0 mb-1 mt-1">
                                    <Input type="text" className="input-sm form-control-sm" value={moment(new Date(this.state.now_member.created_at*1000)).format("YYYY-MM-DD h:mm:ss a")}/>
                                    <InputGroupAddon addonType="append">
                                      <InputGroupText><Moment fromNow ago unix>{this.state.now_member.created_at}</Moment></InputGroupText>
                                    </InputGroupAddon>
                                  </InputGroup>
                                  <InputGroup className="m-0 mb-1 mt-1">
                                    <Input type="text" className="input-sm form-control-sm" value={moment(new Date(this.state.now_member.joined_at*1000)).format("YYYY-MM-DD h:mm:ss a")}/>
                                    <InputGroupAddon addonType="append">
                                      <InputGroupText><Moment fromNow ago unix>{this.state.now_member.joined_at}</Moment></InputGroupText>
                                    </InputGroupAddon>
                                  </InputGroup>
                                  {!(this.state.now_member.total_inviter === 0) &&
                                      <InputGroup className="m-0 mb-1 mt-1">
                                        <Input type="text" className="input-sm form-control-sm" value={this.state.now_member.total_inviter}/>
                                      </InputGroup>
                                  }
                                  {this.state.now_member.inviter &&
                                      <>
                                          <InputGroup className="m-0 mb-1 mt-1">
                                            <Input type="text" className="input-sm form-control-sm" value={this.id_type_text(this.state.now_member.inviter)}/>
                                          </InputGroup>
                                          <InputGroup className="m-0 mb-1 mt-1">
                                            <Input type="text" className="input-sm form-control-sm" value={this.state.now_member.url}/>
                                          </InputGroup>
                                          <InputGroup className="m-0 mb-1 mt-1">
                                            <Input type="text" className="input-sm form-control-sm" value={this.state.now_member.time}/>
                                          </InputGroup>
                                      </>
                                  }
                                  <InputGroup className="m-0 mb-1 mt-1 d-block">
                                    {
                                        this.member_roles(null,this.state.now_member)
                                    }
                                  </InputGroup>
                                </Col>
                                <Col xs="12" sm="12" md="12" className="mt-2">
                                    {this.state.model_member && this.member_xp(null,this.state.now_member)}
                                </Col>
                                <Col xs="12" sm="12" md="12" className="mt-2">
                                    <Nav tabs>
                                      <NavItem>
                                        <NavLink
                                          active={this.state.activeTab[0] === '1'}
                                          onClick={() => { this.toggle_tab(0, '1'); }}
                                        >
                                          logs
                                        </NavLink>
                                      </NavItem>
                                      <NavItem>
                                        <NavLink
                                          active={this.state.activeTab[0] === '2'}
                                          onClick={() => { this.toggle_tab(0, '2'); }}
                                        >
                                          Warns
                                        </NavLink>
                                      </NavItem>
                                    </Nav>
                                    <TabContent activeTab={this.state.activeTab[0]}>
                                      {this.tabPane()}
                                    </TabContent>
                                </Col>
                            </Row>
                          </FormGroup>
                      }
					</ModalBody>
					<ModalFooter>
					  <Button color="secondary" onClick={this.toggle_member}>{this.props.language.titles.close}</Button>
					</ModalFooter>
				  </Modal>
                <Button color="success" onClick={this.toggle_all}>أعدادات السجلات</Button>
				  <Modal isOpen={this.state.model_all} toggle={this.toggle_all} className={this.props.className}>
					<ModalHeader toggle={this.toggle_all}>
                        <i className="fa fa-balance-scale"></i> اعدادات السجلات
                    </ModalHeader>
					<ModalBody>
                        <Row>
                            <Col md={12} className="m-1">
                                <Row className="text-center">
                                    <Col md={4}>
                                        <InputGroupText className="w-100">شات السجلات</InputGroupText>
                                    </Col>
                                    <Col md={8}>
                                          <Input type="select" id="main_log_channel" value={this.state.data.save.main_log_channel} onChange={(event) => this.edit_data(event)}>
                                            <option value="">تعطيل الشات الاحتياطي</option>
                                            {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                                              return (<option key={index} value={channel.id}>{channel.name}</option>);
                                            })}
                                          </Input>
                                          <FormText className="help-block">سيقوم البوت بأرسال السجلات هنا في حال تم حذف شات السجلات المخصص</FormText>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
					</ModalBody>
					<ModalFooter>
					  <Button color="secondary" onClick={this.toggle_all}>{this.props.language.titles.close}</Button>
					</ModalFooter>
				  </Modal>
                <BootstrapTable data={this.state.data.logs} version="4" columns={ columns } filter={ filterFactory() } striped hover pagination search bordered={ false } options={{
                  sortIndicator: true,
                  hideSizePerPage: true,
                  paginationSize: 5,
                  hidePageListOnlyOnePage: false,
                  clearSearch: true,
                  alwaysShowAllBtns: false,
                  withFirstAndLast: false,
                }}>
                  <TableHeaderColumn dataAlign="center" isKey width={"15%"} dataField="whatsis" filter={{type: 'SelectFilter',options: this.state.data.types_type}} dataSort>Type</TableHeaderColumn>
                  <TableHeaderColumn dataAlign="center" width={"20%"} dataField="by" dataFormat={this.id_type} filter={{type: 'SelectFilter',options: this.state.data.types_by}} dataSort>By</TableHeaderColumn>
                  <TableHeaderColumn dataAlign="center" width={"20%"} dataField="to" dataFormat={this.id_type} filter={{type: 'SelectFilter',options: this.state.data.types_to}} dataSort>To</TableHeaderColumn>
                  <TableHeaderColumn dataAlign="center" width={"30%"} dataField="info" dataFormat={this.info_area} dataSort>Info</TableHeaderColumn>
                  <TableHeaderColumn dataAlign="center" width={"15%"} dataField="time" dataSort>Time</TableHeaderColumn>
                </BootstrapTable>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      </CSSTransitionGroup>
    );
  }
}

export default Logs;
