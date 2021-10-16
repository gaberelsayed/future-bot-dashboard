import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Label,Input,FormGroup,ListGroup,ListGroupItem,InputGroup,InputGroupAddon,InputGroupText,FormText,Modal, ModalBody, ModalFooter, ModalHeader, Button,Collapse } from 'reactstrap';
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
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import CSSTransitionGroup from 'react-addons-css-transition-group';

const DragHandle = sortableHandle(() => <InputGroupText><i className="fa fa-list"></i></InputGroupText>);

const SortableContainer = sortableContainer(({children}) => {
  return <ListGroup>{children}</ListGroup>;
});


class ID extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      copy_data: null,
      changed: false,
      toast_id: null,
      modal_help: false,
      modal_listgroup: false,
      accordion: [false, false],
      colorPickerShowing : false,
      loading: false
    };
    this.edit_data = this.edit_data.bind(this);
    this.edit_data_multi = this.edit_data_multi.bind(this);
    this.toggle_help = this.toggle_help.bind(this);
    this.toggle_listgroup = this.toggle_listgroup.bind(this);
  }

  async componentDidMount(){
    const get_data = await this.props.get_data("id_command")
    if(get_data !== false){
      get_data.data.id_commands.forEach((command, index) => {
        get_data.data.id_commands[index] = {};
        get_data.data.id_commands[index].label = command;
        get_data.data.id_commands[index].value = command;
      })
      get_data.data.top_commands.forEach((command, index) => {
        get_data.data.top_commands[index] = {};
        get_data.data.top_commands[index].label = command;
        get_data.data.top_commands[index].value = command;
      })
      this.setState({data:get_data.data,copy_data:cloneDeep(get_data.data)})
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
      new_data[event.target.id] = event.target.checked;
    }else{
      new_data[event.target.id] = event.target.value;
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
    new_data.list.push({exp_need:100,roles:[],message:""});
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
      new_data.id_commands.forEach((command, index) => {
        new_commands.push(command.value)
      })
      new_data.id_commands = new_commands
      var new_topcommands = []
      new_data.top_commands.forEach((command, index) => {
        new_topcommands.push(command.value)
      })
      new_data.top_commands = new_topcommands
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

  onSortEnd = ({oldIndex, newIndex}) => {
    var new_data = {...this.state.data}
    new_data.list = arrayMove(new_data.list, oldIndex, newIndex)
    this.setState({
      data:new_data,
    });
    this.check_data_save(new_data);
  };

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
  const SortableItem = sortableElement(({index,value}) => (
    <ListGroupItem className="justify-content-between Selector-list">
      <InputGroup className="m-1">
        <InputGroupAddon addonType="prepend">
          <DragHandle/>
        </InputGroupAddon>
        <InputGroupAddon onClick={() => this.toggle_listgroup(index)} addonType="prepend">
          <InputGroupText><i className="fa fa-wrench"></i></InputGroupText>
        </InputGroupAddon>
        <Input onClick={() => this.toggle_listgroup(index)} type="text" value={String(index+1)+" "+this.props.language.dashboard.commands.id_command.level}/>
        <InputGroupAddon addonType="append">
          <Button type="button" color="danger" onClick={() => this.delete_list(index)}><i className="fa fa-trash"></i></Button>
        </InputGroupAddon>
      </InputGroup>
    </ListGroupItem>
  ));
    const styles = reactCSS({
      'default': {
        color: {
          height: '14px',
          borderRadius: '2px',
          background: `${this.state.data ? this.state.data.id_log_color.replace("0x","#") : null}`,
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
                <i className="fa fa-address-book"></i><strong>{this.props.language.dashboard.commands.id_command.settings}</strong>
                <div className="card-header-actions">
                  <AppSwitch className={'float-right mb-0'} label id="active" color={'info'} checked={this.state.data.active} onClick={(event) => this.edit_data(event)} size={'sm'}/>
                </div>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.id_command.id_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.id_commands}
                    onChange={(value) => this.edit_data_multi_commands("id_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.id_command.id_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.id_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.id_command.top_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.top_commands}
                    onChange={(value) => this.edit_data_multi_commands("top_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.id_command.top_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.top_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.commands.id_command.per_voice_title}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="number" id="per_voice" min="0" onChange={(event) => this.edit_data(event)} placeholder={this.props.language.dashboard.commands.id_command.per_voice_placeholder} value={this.state.data.per_voice}/>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>{this.props.language.dashboard.commands.id_command.exp}</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.per_voice_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.commands.id_command.per_text_title}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="number" id="per_text" min="0" onChange={(event) => this.edit_data(event)} placeholder={this.props.language.dashboard.commands.id_command.per_text_placeholder} value={this.state.data.per_text}/>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>{this.props.language.dashboard.commands.id_command.exp}</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.commands.id_command.per_text_every}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="number" id="timeout" min="10" onChange={(event) => this.edit_data(event)} placeholder={this.props.language.dashboard.commands.id_command.per_text_every_placeholder} value={this.state.data.timeout}/>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>{this.props.language.dashboard.commands.id_command.sec}</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.per_text_example}</FormText>
                </FormGroup>
                <FormGroup check className="checkbox">
                  <Input className="mr-1" type="checkbox" color={'info'} id="stop_temp" onChange={(event) => this.edit_data(event)} checked={this.state.data.stop_temp} />
                  <Label check htmlFor="stop_temp">{this.props.language.dashboard.commands.id_command.stop_temp_title}</Label>
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.stop_temp_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-address-book"></i><strong>{this.props.language.dashboard.commands.id_command.id_roles_header}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.id_command.id_roles_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.roles.filter(role => this.state.data.id_roles.includes(role.id))}
                    options={this.props.selected_guild.roles}
                    onChange={(value) => this.edit_data_multi("id_roles",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.id_command.id_roles_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.id_roles_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.id_command.top_roles_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.roles.filter(role => this.state.data.top_roles.includes(role.id))}
                    options={this.props.selected_guild.roles}
                    onChange={(value) => this.edit_data_multi("top_roles",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.id_command.top_roles_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.top_roles_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.id_command.disable_channels_id_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.channels.filter(channel => channel.type === 0).filter(channel => this.state.data.disable_channels.includes(channel.id))}
                    options={this.props.selected_guild.channels.filter(channel => channel.type === 0)}
                    onChange={(value) => this.edit_data_multi("disable_channels",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.id_command.disable_channels_id_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.disable_channels_id_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.id_command.allowed_channels_id_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.channels.filter(channel => (channel.type === 2 || channel.type === 0)).filter(channel => this.state.data.allowed_channels.includes(channel.id))}
                    options={this.props.selected_guild.channels.filter(channel => (channel.type === 2 || channel.type === 0))}
                    onChange={(value) => this.edit_data_multi("allowed_channels",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.id_command.allowed_channels_id_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.allowed_channels_id_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.id_command.channel_def_title}</Label>
                  <Input type="select" id="channel_def" value={this.state.data.channel_def} onChange={(event) => this.edit_data(event)}>
                    <option value="">{this.props.language.dashboard.commands.id_command.channel_def_disable}</option>
                    {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.channel_def_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-address-book"></i><strong>{this.props.language.dashboard.commands.id_command.id_log_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <div style={styles.swatch} onClick={ this.handleClickColor }>
                    <div style={ styles.color }/>
                  </div>
                  {
                    this.state.colorPickerShowing ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                      <SketchPicker color={this.state.data.id_log_color ? this.state.data.id_log_color.replace("0x","#") : "#ffffff"} onChange={(event) => this.edit_data_color("id_log_color",event)} disableAlpha={true} />
                    </div> : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.id_command.id_log_title_title}</Label>
                  <Input type="text" id="id_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.id_log_title || ''} placeholder={this.props.language.dashboard.commands.id_command.id_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.id_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.id_command.id_log_channel_title}</Label>
                  <Input type="select" id="id_log_channel" value={this.state.data.id_log_channel} onChange={(event) => this.edit_data(event)}>
                    <option value="">{this.props.language.dashboard.commands.id_command.id_log_channel_disable}</option>
                    {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.commands.id_command.id_log_channel_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-address-book"></i><strong> {this.props.language.dashboard.commands.id_command.id_levels_title}</strong>
              </CardHeader>
              <CardBody>
                <Modal isOpen={this.state.modal_listgroup} toggle={() => this.toggle_listgroup("open_close")} className={this.props.className}>
                  <ModalHeader toggle={() => this.toggle_listgroup("open_close")}><i className="fa fa-address-book"></i> {this.state.now_listgroup_key+1}{" "+this.props.language.dashboard.commands.id_command.id_levels_header_title}</ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <InputGroup className="m-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{this.props.language.dashboard.commands.id_command.id_need_exp_title}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="number" id="exp_need" min="1" onChange={(event) => this.edit_list(event)} placeholder={this.props.language.dashboard.commands.id_command.id_need_exp_placeholder} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].exp_need : null}/>
                        <InputGroupAddon addonType="append">
                          <InputGroupText>{this.props.language.dashboard.commands.id_command.exp}</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FormText className="help-block">{this.props.language.dashboard.commands.id_command.id_need_exp_example}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <Label>{this.props.language.dashboard.commands.id_command.id_level_roles_title}</Label>
                      <Select
                        closeMenuOnSelect={false}
                        components={makeAnimated()}
                        value={this.props.selected_guild.roles.filter(role => (this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].roles.includes(role.id) : null)}
                        options={this.props.selected_guild.roles}
                        onChange={(value) => this.edit_list_multi(value)}
                        styles={colourStyles}
                        placeholder={this.props.language.dashboard.commands.id_command.id_level_roles_placeholder}
                        isMulti
                      />
                      <FormText className="help-block">{this.props.language.dashboard.commands.id_command.id_level_roles_example}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="m-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{this.props.language.dashboard.commands.id_command.id_level_message_title}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="textarea" id="message" onChange={(event) => this.edit_list(event)} placeholder={this.props.language.dashboard.commands.id_command.id_level_message_placeholder} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].message : null}/>
                      </InputGroup>
                      <FormText className="help-block">{this.props.language.dashboard.commands.id_command.id_level_message_example}</FormText>
                    </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={() => this.toggle_listgroup("open_close")}>{this.props.language.titles.close}</Button>
                  </ModalFooter>
                </Modal>
                <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
                  {this.state.data.list.map((item, index) => (
                    <SortableItem key={`item-${index}`} index={index} value={item} />
                  ))}
                </SortableContainer>
                <Row className="justify-content-center mt-3 mb-0">
                  <FormGroup className="m-0">
                    <Button block color="primary" onClick={() => this.add_new_list()} className="btn-pill"><i className="fa fa-plus"></i></Button>
                  </FormGroup>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      </CSSTransitionGroup>
    );
  }
}

export default ID;
