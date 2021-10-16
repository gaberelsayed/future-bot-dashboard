import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Label,Input,FormGroup,ListGroup,ListGroupItem,InputGroup,InputGroupAddon,InputGroupText,FormText,Modal, ModalBody, ModalFooter, ModalHeader, Button,Collapse } from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import Select, {Creatable} from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import {toast} from 'react-toastify';
import { css } from 'glamor';
import LaddaButton, { EXPAND_RIGHT,ZOOM_IN } from 'react-ladda';
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


class Activity extends Component {
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
    this.fileReader = new FileReader();
    this.fileReader.onload = (file) => {
      this.setState({loading_json:true});
      var list = JSON.parse(file.target.result);
      const new_data = {...this.state.data};
      list.forEach((question, index) => {
        if(this.state.data.list.filter((e) => e.soawl === question.soawl).length === 0){
          new_data.list.push(question);
        };
      })
      this.setState({data:new_data,loading_json:false});
      this.check_data_save(new_data);
    };
  }

  async componentDidMount(){
    const get_data = await this.props.get_data("activity_command")
    if(get_data !== false){
      get_data.data.activity_points_commands.forEach((command, index) => {
        get_data.data.activity_points_commands[index] = {};
        get_data.data.activity_points_commands[index].label = command;
        get_data.data.activity_points_commands[index].value = command;
      })
      get_data.data.activity_ask_commands.forEach((command, index) => {
        get_data.data.activity_ask_commands[index] = {};
        get_data.data.activity_ask_commands[index].label = command;
        get_data.data.activity_ask_commands[index].value = command;
      })
      get_data.data.activity_askstop_commands.forEach((command, index) => {
        get_data.data.activity_askstop_commands[index] = {};
        get_data.data.activity_askstop_commands[index].label = command;
        get_data.data.activity_askstop_commands[index].value = command;
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

  add_new_list(value) {
    var new_data = {...this.state.data}
    new_data.list.push({soawl :null,timeout:0,delete:true,jawab:null});
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

  download_list(list) {
    const copy = [];
    list.forEach((question, index) => {
      copy.push({soawl:question.soawl,jawab:question.jawab,timeout:question.timeout,delete:question.delete})
    })
    let filename = "questions.json";
    let contentType = "application/json;charset=utf-8;";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(copy)))], { type: contentType });
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var a = document.createElement('a');
      a.download = filename;
      a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(copy));
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
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
      new_data.activity_points_commands.forEach((command, index) => {
        new_commands.push(command.value)
      })
      new_data.activity_points_commands = new_commands
      var new_ask_commands = []
      new_data.activity_ask_commands.forEach((command, index) => {
        new_ask_commands.push(command.value)
      })
      new_data.activity_ask_commands = new_ask_commands
      var new_askstop_commands = []
      new_data.activity_askstop_commands.forEach((command, index) => {
        new_askstop_commands.push(command.value)
      })
      new_data.activity_askstop_commands = new_askstop_commands
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
        <Input onClick={() => this.toggle_listgroup(index)} type="text" value={value.soawl} placeholder={this.props.language.dashboard.commands.activity_command.activity_asalah_soawl_main_placeholder}/>
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
          background: `${this.state.data ? this.state.data.activity_log_color.replace("0x","#") : null}`,
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
                <i className="fa fa-paragraph"></i><strong>{this.props.language.dashboard.commands.activity_command.settings}</strong>
                <div className="card-header-actions">
                  <AppSwitch className={'float-right mb-0'} label id="active" color={'info'} checked={this.state.data.active} onClick={(event) => this.edit_data(event)} size={'sm'}/>
                </div>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.activity_points_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.activity_points_commands}
                    onChange={(value) => this.edit_data_multi_commands("activity_points_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.activity_command.activity_points_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_points_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.activity_ask_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.activity_ask_commands}
                    onChange={(value) => this.edit_data_multi_commands("activity_ask_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.activity_command.activity_ask_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_ask_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.activity_askstop_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.activity_askstop_commands}
                    onChange={(value) => this.edit_data_multi_commands("activity_askstop_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.activity_command.activity_askstop_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_askstop_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.commands.activity_command.activity_limit_point_title}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="number" id="activity_limit_point" min="5" onChange={(event) => this.edit_data(event)} placeholder={this.props.language.dashboard.commands.activity_command.activity_limit_point_placeholder} value={this.state.data.activity_limit_point}/>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>{this.props.language.dashboard.commands.activity_command.activity_limit_point_point}</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_limit_point_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-paragraph"></i><strong>{this.props.language.dashboard.commands.activity_command.activity_roles_header}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.activity_roles_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.roles.filter(role => this.state.data.activity_roles.includes(role.id))}
                    options={this.props.selected_guild.roles}
                    onChange={(value) => this.edit_data_multi("activity_roles",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.activity_command.activity_roles_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_roles_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.activity_deny_channels_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.channels.filter(channel => channel.type === 0).filter(channel => this.state.data.activity_deny_channels.includes(channel.id))}
                    options={this.props.selected_guild.channels.filter(channel => channel.type === 0)}
                    onChange={(value) => this.edit_data_multi("activity_deny_channels",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.activity_command.activity_deny_channels_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_deny_channels_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-paragraph"></i><strong>{this.props.language.dashboard.commands.activity_command.activity_log_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <div style={styles.swatch} onClick={ this.handleClickColor }>
                    <div style={ styles.color }/>
                  </div>
                  {
                    this.state.colorPickerShowing ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                      <SketchPicker color={this.state.data.activity_log_color ? this.state.data.activity_log_color.replace("0x","#") : "#ffffff"} onChange={(event) => this.edit_data_color("activity_log_color",event)} disableAlpha={true} />
                    </div> : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.activity_points_log_title_title}</Label>
                  <Input type="text" id="activity_points_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.activity_points_log_title || ''} placeholder={this.props.language.dashboard.commands.activity_command.activity_points_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_points_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.activity_ask_log_title_title}</Label>
                  <Input type="text" id="activity_ask_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.activity_ask_log_title || ''} placeholder={this.props.language.dashboard.commands.activity_command.activity_ask_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_ask_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.activity_log_channel_title}</Label>
                  <Input type="select" id="activity_log_channel" value={this.state.data.activity_log_channel} onChange={(event) => this.edit_data(event)}>
                    <option value="">{this.props.language.dashboard.commands.activity_command.activity_log_channel_disable}</option>
                    {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_log_channel_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-paragraph"></i><strong>{this.props.language.dashboard.commands.activity_command.activity_respond_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.point_reset_message_title}</Label>
                  <Input type="text" id="point_reset_message" onChange={(event) => this.edit_data(event)} value={this.state.data.point_reset_message || ''} placeholder={this.props.language.dashboard.commands.activity_command.point_reset_message_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.point_reset_message_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.no_points_message_title}</Label>
                  <Input type="text" id="no_points_message" onChange={(event) => this.edit_data(event)} value={this.state.data.no_points_message || ''} placeholder={this.props.language.dashboard.commands.activity_command.no_points_message_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.no_points_message_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.next_questions_msg_title}</Label>
                  <Input type="text" id="next_questions_msg" onChange={(event) => this.edit_data(event)} value={this.state.data.next_questions_msg || ''} placeholder={this.props.language.dashboard.commands.activity_command.next_questions_msg_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.next_questions_msg_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.activity_finish_msg_title}</Label>
                  <Input type="text" id="activity_finish_msg" onChange={(event) => this.edit_data(event)} value={this.state.data.activity_finish_msg || ''} placeholder={this.props.language.dashboard.commands.activity_command.activity_finish_msg_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_finish_msg_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.activity_command.no_questions_msg_title}</Label>
                  <Input type="text" id="no_questions_msg" onChange={(event) => this.edit_data(event)} value={this.state.data.no_questions_msg || ''} placeholder={this.props.language.dashboard.commands.activity_command.no_questions_msg_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.no_questions_msg_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-paragraph"></i><strong>{this.props.language.dashboard.commands.activity_command.activity_asalah_title}</strong>
              </CardHeader>
              <CardBody>
                <Modal isOpen={this.state.modal_listgroup} toggle={() => this.toggle_listgroup("open_close")} className={this.props.className}>
                  <ModalHeader toggle={() => this.toggle_listgroup("open_close")}><i className="fa fa-paragraph"></i> {this.props.language.dashboard.commands.activity_command.activity_asalah_header_title}</ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <InputGroup className="m-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{this.props.language.dashboard.commands.activity_command.activity_asalah_soawl_title}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="textarea" id="soawl" onChange={(event) => this.edit_list(event)} placeholder={this.props.language.dashboard.commands.activity_command.activity_asalah_soawl_placeholder} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].soawl : null}/>
                      </InputGroup>
                      <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_asalah_soawl_example}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="m-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{this.props.language.dashboard.commands.activity_command.activity_asalah_jawab_title}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="textarea" id="jawab" onChange={(event) => this.edit_list(event)} placeholder={this.props.language.dashboard.commands.activity_command.activity_asalah_jawab_placeholder} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].jawab : null}/>
                      </InputGroup>
                      <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_asalah_jawab_example}</FormText>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="m-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{this.props.language.dashboard.commands.activity_command.activity_asalah_timeout_title}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="number" id="timeout" min="5" onChange={(event) => this.edit_list(event)} placeholder={this.props.language.dashboard.commands.activity_command.activity_asalah_timeout_placeholder} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].timeout : null}/>
                        <InputGroupAddon addonType="append">
                          <InputGroupText>{this.props.language.dashboard.commands.activity_command.activity_asalah_timeout_sec}</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_asalah_timeout_example}</FormText>
                    </FormGroup>
                    <FormGroup check className="checkbox">
                      <Input className="mr-1" type="checkbox" color={'info'} id="delete" onChange={(event) => this.edit_list(event)} checked={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].delete : null} />
                      <Label check htmlFor="delete">{this.props.language.dashboard.commands.activity_command.activity_asalah_delete_title}</Label>
                      <FormText className="help-block">{this.props.language.dashboard.commands.activity_command.activity_asalah_delete_example}</FormText>
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
                  {(this.props.isMobile && this.state.data.list.length !== 0) ? null : 
                    <FormGroup className="align-self-center mr-1">
                      <Button block color="success" onClick={() => this.download_list(this.state.data.list)} className="btn-pill"><i className="fa fa-download"></i></Button>
                    </FormGroup>
                  }
                  <FormGroup className="align-self-center">
                    <Button block color="primary" onClick={() => this.add_new_list()} className="btn-pill"><i className="fa fa-plus"></i></Button>
                  </FormGroup>
                  {this.props.isMobile ? null : 
                    <FormGroup className="align-self-center ml-1">
                      <LaddaButton block data-color="warning" loading={this.state.loading_json} data-style={ZOOM_IN} className="btn btn-warning btn-ladda btn-pill" onClick={() => document.querySelector(".json_uploader").click()}><i className="fa fa-upload"></i></LaddaButton>
                    </FormGroup>
                  }
                  <FormGroup className="align-self-center ml-1 d-none">
                    <Input type="file" className="custom-file-input json_uploader" style={{width:"0"}} accept=".json" multiple onChange={(event) => this.fileReader.readAsText(event.target.files[0])} />
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

export default Activity;
