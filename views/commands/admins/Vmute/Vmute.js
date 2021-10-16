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


class VMute extends Component {
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
    const get_data = await this.props.get_data("vmute_command")
    if(get_data !== false){
      get_data.data.vmute_commands.forEach((command, index) => {
        get_data.data.vmute_commands[index] = {};
        get_data.data.vmute_commands[index].label = command;
        get_data.data.vmute_commands[index].value = command;
      })
      get_data.data.unvmute_commands.forEach((command, index) => {
        get_data.data.unvmute_commands[index] = {};
        get_data.data.unvmute_commands[index].label = command;
        get_data.data.unvmute_commands[index].value = command;
      })
      get_data.data.myvmute_commands.forEach((command, index) => {
        get_data.data.myvmute_commands[index] = {};
        get_data.data.myvmute_commands[index].label = command;
        get_data.data.myvmute_commands[index].value = command;
      })
      get_data.data.vmutes_commands.forEach((command, index) => {
        get_data.data.vmutes_commands[index] = {};
        get_data.data.vmutes_commands[index].label = command;
        get_data.data.vmutes_commands[index].value = command;
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
      new_data.vmute_commands.forEach((command, index) => {
        new_commands.push(command.value)
      })
      new_data.vmute_commands = new_commands
      var unnew_commands = []
      new_data.unvmute_commands.forEach((command, index) => {
        unnew_commands.push(command.value)
      })
      new_data.unvmute_commands = unnew_commands
      var new_uncommands = []
      new_data.myvmute_commands.forEach((command, index) => {
        new_uncommands.push(command.value)
      })
      new_data.myvmute_commands = new_uncommands
      var new_mutescommands = []
      new_data.vmutes_commands.forEach((command, index) => {
        new_mutescommands.push(command.value)
      })
      new_data.vmutes_commands = new_mutescommands
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
        <Input onClick={() => this.toggle_listgroup(index)} type="text" value={value.reason} placeholder={this.props.language.dashboard.commands.vmute_command.vmute_reasons_reason_main_placeholder}/>
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
          background: `${this.state.data ? this.state.data.vmute_log_color.replace("0x","#") : null}`,
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
                <i className="fa fa-microphone-slash"></i><strong>{this.props.language.dashboard.commands.vmute_command.settings}</strong>
                <div className="card-header-actions">
                  <AppSwitch className={'float-right mb-0'} label id="active" color={'info'} checked={this.state.data.active} onClick={(event) => this.edit_data(event)} size={'sm'}/>
                  <i className="icon-question float-right mr-1" style={{cursor: "help"}} onClick={this.toggle_help}></i>
                  <Modal isOpen={this.state.modal_help} toggle={this.toggle_help} className={this.props.className}>
                    <ModalHeader toggle={this.toggle_help}><i className="fa fa-microphone-slash"></i> {this.props.language.dashboard.commands.vmute_command.title}</ModalHeader>
                    <ModalBody>
                      <FormGroup>
                        <Label><strong>{this.props.language.help_titles.about_title}</strong></Label>
                        <Label>{this.props.language.dashboard.commands.vmute_command.help.about_description}</Label>
                        {this.props.language.dashboard.commands.vmute_command.help.about_example.split('\n').map((item, i) => <FormText key={i} className="help-block mt-0">{item}</FormText>)}
                        <Label className="mb-0 mt-4"><strong>{this.props.language.help_titles.permissions_need}</strong></Label>
                        <Label className="mt-0">{this.props.language.dashboard.commands.vmute_command.help.permissions_note}</Label>
                        {this.props.language.dashboard.commands.vmute_command.help.permissions_help.split('\n').map((item, i) =>
                        <Label key={i} className="form-text m-0">[{item.split(':')[0]} : <Label className="text-muted">{item.split(':')[1]}</Label>]</Label>
                        )}
                        <Label className="mt-4"><strong>{this.props.language.help_titles.how_to_use}</strong></Label>
                        <div id="accordion">
                          <Card>
                            <CardHeader id="headingOne">
                              <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">#1 {this.props.language.help_titles.text_tutorial}</h5>
                              </Button>
                            </CardHeader>
                            <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                              <CardBody>
                                {this.props.language.dashboard.commands.vmute_command.help.tutorial_text.map((item, i) =>
                                <div key={i}>
                                  <Label className="mt-3" style={{color:"#20a8c9"}}><strong>{item.id}- </strong>{item.text}</Label>
                                  <img src={this.props.isMobile ? item.img : item.img_n} alt={item.id}/>
                                </div>
                                )}
                              </CardBody>
                            </Collapse>
                          </Card>
                          <Card>
                            <CardHeader id="headingTwo">
                              <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)} aria-expanded={this.state.accordion[1]} aria-controls="collapseTwo">
                                <h5 className="m-0 p-0">#2 {this.props.language.help_titles.video_tutorial}</h5>
                              </Button>
                            </CardHeader>
                            <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseTwo">
                              <CardBody>
                                {this.props.language.dashboard.commands.vmute_command.help.tutorial_video ? <div><YouTube opts={{width: "100%",height: "100%"}} videoId={this.props.language.dashboard.commands.vmute_command.help.tutorial_video}/></div>: <div>{this.props.language.help_titles.soon}</div>}
                              </CardBody>
                            </Collapse>
                          </Card>
                        </div>
                      </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={this.toggle_help}>{this.props.language.titles.close}</Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vmute_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.vmute_commands}
                    onChange={(value) => this.edit_data_multi_commands("vmute_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.vmute_command.vmute_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.unvmute_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.unvmute_commands}
                    onChange={(value) => this.edit_data_multi_commands("unvmute_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.vmute_command.unvmute_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.unvmute_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.myvmute_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.myvmute_commands}
                    onChange={(value) => this.edit_data_multi_commands("myvmute_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.vmute_command.myvmute_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.myvmute_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vmutes_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.vmutes_commands}
                    onChange={(value) => this.edit_data_multi_commands("vmutes_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.vmute_command.vmutes_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmutes_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.commands.vmute_command.vmute_default_time_title}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="number" id="vmute_default_time" min="0" onChange={(event) => this.edit_data(event)} placeholder={this.props.language.dashboard.commands.vmute_command.vmute_default_time_placeholder} value={this.state.data.vmute_default_time}/>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>{this.props.language.dashboard.commands.vmute_command.vmute_reasons_time_min}</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_default_time_example}</FormText>
                </FormGroup>
                <FormGroup check className="checkbox">
                  <Input className="mr-1" type="checkbox" color={'info'} id="reason_pm" onChange={(event) => this.edit_data(event)} checked={this.state.data.reason_pm} />
                  <Label check htmlFor="reason_pm">{this.props.language.dashboard.commands.vmute_command.reason_pm_title}</Label>
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.reason_pm_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-microphone-slash"></i><strong>{this.props.language.dashboard.commands.vmute_command.vmute_roles_header}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vmute_roles_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.roles.filter(role => this.state.data.vmute_roles.includes(role.id))}
                    options={this.props.selected_guild.roles}
                    onChange={(value) => this.edit_data_multi("vmute_roles",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.vmute_command.vmute_roles_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_roles_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vmutes_roles_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.roles.filter(role => this.state.data.vmutes_roles.includes(role.id))}
                    options={this.props.selected_guild.roles}
                    onChange={(value) => this.edit_data_multi("vmutes_roles",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.vmute_command.vmutes_roles_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmutes_roles_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vmute_default_channels_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.channels.filter(channel => channel.type === 0).filter(channel => this.state.data.vmute_default_channels.includes(channel.id))}
                    options={this.props.selected_guild.channels.filter(channel => channel.type === 0)}
                    onChange={(value) => this.edit_data_multi("vmute_default_channels",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.vmute_command.vmute_default_channels_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_default_channels_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vmute_deny_channels_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.channels.filter(channel => channel.type === 2).filter(channel => this.state.data.vmute_deny_channels.includes(channel.id))}
                    options={this.props.selected_guild.channels.filter(channel => channel.type === 2)}
                    onChange={(value) => this.edit_data_multi("vmute_deny_channels",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.vmute_command.vmute_deny_channels_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_deny_channels_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-microphone-slash"></i><strong>{this.props.language.dashboard.commands.vmute_command.vmute_log_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <div style={styles.swatch} onClick={ this.handleClickColor }>
                    <div style={ styles.color }/>
                  </div>
                  {
                    this.state.colorPickerShowing ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                      <SketchPicker color={this.state.data.vmute_log_color ? this.state.data.vmute_log_color.replace("0x","#") : "#ffffff"} onChange={(event) => this.edit_data_color("vmute_log_color",event)} disableAlpha={true} />
                    </div> : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vmute_log_title_title}</Label>
                  <Input type="text" id="vmute_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.vmute_log_title || ''} placeholder={this.props.language.dashboard.commands.vmute_command.vmute_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vunmute_log_title_title}</Label>
                  <Input type="text" id="vunmute_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.vunmute_log_title || ''} placeholder={this.props.language.dashboard.commands.vmute_command.vunmute_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vunmute_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vmute_log_channel_title}</Label>
                  <Input type="select" id="vmute_log_channel" value={this.state.data.vmute_log_channel} onChange={(event) => this.edit_data(event)}>
                    <option value="">{this.props.language.dashboard.commands.vmute_command.vmute_log_channel_disable}</option>
                    {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_log_channel_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-microphone-slash"></i><strong>{this.props.language.dashboard.commands.vmute_command.vmute_respond_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vmute_message_top_role_title}</Label>
                  <Input type="text" id="vmute_message_top_role" onChange={(event) => this.edit_data(event)} value={this.state.data.vmute_message_top_role || ''} placeholder={this.props.language.dashboard.commands.vmute_command.vmute_message_top_role_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_message_top_role_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.vmute_message_is_admin_title}</Label>
                  <Input type="text" id="vmute_message_is_admin" onChange={(event) => this.edit_data(event)} value={this.state.data.vmute_message_is_admin || ''} placeholder={this.props.language.dashboard.commands.vmute_command.vmute_message_is_admin_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_message_is_admin_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.vmute_command.no_vmutes_msg_title}</Label>
                  <Input type="text" id="no_vmutes_msg" onChange={(event) => this.edit_data(event)} value={this.state.data.no_vmutes_msg || ''} placeholder={this.props.language.dashboard.commands.vmute_command.no_vmutes_msg_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.no_vmutes_msg_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-microphone-slash"></i><strong> {this.props.language.dashboard.commands.vmute_command.vmute_reasons_title}</strong>
              </CardHeader>
              <CardBody>
                <Modal isOpen={this.state.modal_listgroup} toggle={() => this.toggle_listgroup("open_close")} className={this.props.className}>
                  <ModalHeader toggle={() => this.toggle_listgroup("open_close")}><i className="fa fa-microphone-slash"></i> {this.props.language.dashboard.commands.vmute_command.vmute_reasons_header_title}</ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <InputGroup className="m-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{this.props.language.dashboard.commands.vmute_command.vmute_reasons_reason_title}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" id="reason" onChange={(event) => this.edit_list(event)} placeholder={this.props.language.dashboard.commands.vmute_command.vmute_reasons_reason_placeholder} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].reason : null}/>
                      </InputGroup>
                      <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_reasons_reason_example}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="m-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{this.props.language.dashboard.commands.vmute_command.vmute_reasons_time_title}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="number" id="time" min="0" onChange={(event) => this.edit_list(event)} placeholder={this.props.language.dashboard.commands.vmute_command.vmute_reasons_time_placeholder} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].time : null}/>
                        <InputGroupAddon addonType="append">
                          <InputGroupText>{this.props.language.dashboard.commands.vmute_command.vmute_reasons_time_min}</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_reasons_time_example}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <Select
                        closeMenuOnSelect={false}
                        components={makeAnimated()}
                        value={this.props.selected_guild.roles.filter(role => (this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].roles.includes(role.id) : null)}
                        options={this.props.selected_guild.roles}
                        onChange={(value) => this.edit_list_multi(value)}
                        styles={colourStyles}
                        placeholder={this.props.language.dashboard.commands.vmute_command.vmute_reasons_roles_placeholder}
                        isMulti
                      />
                      <FormText className="help-block">{this.props.language.dashboard.commands.vmute_command.vmute_reasons_roles_example}</FormText>
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

export default VMute;
