import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Label,Input,InputGroup,InputGroupAddon,InputGroupText,FormGroup,FormText,Modal, ModalBody, ModalFooter, ModalHeader, Button,Collapse } from 'reactstrap';
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
import CSSTransitionGroup from 'react-addons-css-transition-group';

class protgahfala extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      copy_data: null,
      changed: false,
      toast_id: null,
      modal_help: false,
      accordion: [false, false],
      colorPickerShowing : false,
      
      loading: false
    };
    this.edit_data = this.edit_data.bind(this);
    this.edit_data_multi = this.edit_data_multi.bind(this);
    this.toggle_help = this.toggle_help.bind(this);
  }
  
  async componentDidMount(){
    const get_data = await this.props.get_data("g7f_protect")
    if(get_data !== false){
      get_data.data.restore_commands.forEach((command, index) => {
        get_data.data.restore_commands[index] = {};
        get_data.data.restore_commands[index].label = command;
        get_data.data.restore_commands[index].value = command;
      })
      this.setState({data:get_data.data,copy_data:get_data.data})
    }
  }
  componentWillUnmount() {
    if(this.state.toast_id){
      toast.dismiss(this.state.toast_id)
      this.setState({toast_id:null})
    }
  }

  toggle_help() {
    this.setState({
      modal_help: !this.state.modal_help,
    });
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
      new_data[event.target.id] = event.target.checked;
    }else{
      new_data[event.target.id] = event.target.value;
    }
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

  edit_data_color(id,event) {
    var new_data = {...this.state.data}
    new_data[id] = event.hex.replace("#","0x");
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

  edit_data_multi(id,value) {
    var new_data = {...this.state.data}
    const new_value = [];
    value.forEach((v, i) => {
      new_value.push(v.id)
    })
    new_data[id] = new_value;
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
    let main = JSON.stringify(new_data)
    let copy = JSON.stringify(this.state.copy_data)
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
      var new_commands = []
      new_data.restore_commands.forEach((command, index) => {
        new_commands.push(command.value)
      })
      new_data.restore_commands = new_commands
      if(await this.props.save_data(this.state.data.type,new_data) === true){
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
          background: `${this.state.data ? this.state.data.g7f_log_color.replace("0x","#") : null}`,
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
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="nav-icon icon-shield"></i><strong>{this.props.language.dashboard.protect.anti_ghfala.g7f_protect_settings}</strong>
                <div className="card-header-actions">
                  <AppSwitch className={'float-right mb-0'} label id="active" color={'info'} checked={this.state.data.active} onClick={(event) => this.edit_data(event)} size={'sm'}/>
                </div>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.protect.anti_ghfala.restore_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.restore_commands}
                    onChange={(value) => this.edit_data_multi_commands("restore_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.protect.anti_ghfala.restore_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.protect.anti_ghfala.restore_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="m-1">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.protect.anti_ghfala.anti_ban_title}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="number" id="max_ban" min="3" onChange={(event) => this.edit_data(event)} placeholder={this.props.language.dashboard.protect.anti_ghfala.anti_ban_placeholder} value={this.state.data.max_ban}/>
                    <InputGroupAddon addonType="append">
                      <Input type="select" id="max_ban_time" value={this.state.data.max_ban_time} onChange={(event) => this.edit_data(event)}>
                        <option value="1">1 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="2">2 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="3">3 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="4">4 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="5">5 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                      </Input>
                    </InputGroupAddon>
                  </InputGroup>
                  <FormText className="help-block">{this.props.language.dashboard.protect.anti_ghfala.anti_ban_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="m-1">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.protect.anti_ghfala.anti_roles_title}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="number" id="max_roles" min="3" onChange={(event) => this.edit_data(event)} placeholder={this.props.language.dashboard.protect.anti_ghfala.anti_roles_placeholder} value={this.state.data.max_roles}/>
                    <InputGroupAddon addonType="append">
                      <Input type="select" id="max_roles_time" value={this.state.data.max_roles_time} onChange={(event) => this.edit_data(event)}>
                        <option value="1">1 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="2">2 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="3">3 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="4">4 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="5">5 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                      </Input>
                    </InputGroupAddon>
                  </InputGroup>
                  <FormText className="help-block">{this.props.language.dashboard.protect.anti_ghfala.anti_roles_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="m-1">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.protect.anti_ghfala.anti_rooms_title}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="number" id="max_rooms" min="3" onChange={(event) => this.edit_data(event)} placeholder={this.props.language.dashboard.protect.anti_ghfala.anti_rooms_placeholder} value={this.state.data.max_rooms}/>
                    <InputGroupAddon addonType="append">
                      <Input type="select" id="max_rooms_time" value={this.state.data.max_rooms_time} onChange={(event) => this.edit_data(event)}>
                        <option value="1">1 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="2">2 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="3">3 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="4">4 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                        <option value="5">5 {this.props.language.dashboard.protect.anti_ghfala.min}</option>
                      </Input>
                    </InputGroupAddon>
                  </InputGroup>
                  <FormText className="help-block">{this.props.language.dashboard.protect.anti_ghfala.anti_rooms_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>تصريح الملكية</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.roles.filter(role => this.state.data.admin_roles.includes(role.id))}
                    options={this.props.selected_guild.roles}
                    onChange={(value) => this.edit_data_multi("admin_roles",value)}
                    styles={colourStyles}
                    placeholder={'أختر الرولات المراد التصريح لها تصريح الملكية'}
                    isMulti
                  />
                  <FormText className="help-block">الرولات المصرح لها التعديل من الموقع بالصلاحية الكاملة كصاحب الملكية</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>تصريح التعديل</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.roles.filter(role => this.state.data.manage_roles.includes(role.id))}
                    options={this.props.selected_guild.roles}
                    onChange={(value) => this.edit_data_multi("manage_roles",value)}
                    styles={colourStyles}
                    placeholder={'أختر الرولات المراد التصريح لها تصريح التعديل'}
                    isMulti
                  />
                  <FormText className="help-block">الرولات المصرح لها التعديل على الموقع ماعاد الاشياء الحساسة مثل مضاد الجحفلة وأمر الرول</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="nav-icon icon-shield"></i><strong>{this.props.language.dashboard.protect.anti_ghfala.g7f_log_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <div style={styles.swatch} onClick={ this.handleClickColor }>
                    <div style={ styles.color }/>
                  </div>
                  {
                    this.state.colorPickerShowing ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                      <SketchPicker color={this.state.data.g7f_log_color ? this.state.data.g7f_log_color.replace("0x","#") : "#ffffff"} onChange={(event) => this.edit_data_color("g7f_log_color",event)} disableAlpha={true} />
                    </div> : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.protect.anti_ghfala.g7f_log_title_title}</Label>
                  <Input type="text" id="g7f_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.g7f_log_title || ''} placeholder={this.props.language.dashboard.protect.anti_ghfala.g7f_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.protect.anti_ghfala.g7f_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.protect.anti_ghfala.g7f_log_channel_title}</Label>
                  <Input type="select" id="g7f_log_channel" value={this.state.data.g7f_log_channel} onChange={(event) => this.edit_data(event)}>
                    <option value="">{this.props.language.dashboard.protect.anti_ghfala.g7f_log_channel_disable}</option>
                    {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.protect.anti_ghfala.g7f_log_channel_example}</FormText>
                </FormGroup>
                <FormGroup check className="checkbox">
                  <Input className="mr-1" type="checkbox" color={'info'} id="log_pm" onChange={(event) => this.edit_data(event)} checked={this.state.data.log_pm} />
                  <Label check htmlFor="log_pm">{this.props.language.dashboard.protect.anti_ghfala.log_pm_title}</Label>
                  <FormText className="help-block">{this.props.language.dashboard.protect.anti_ghfala.log_pm_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      </CSSTransitionGroup>
    );
  }
}

export default protgahfala;
