import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Label,Input,ListGroup,FormGroup,InputGroup,ListGroupItem,InputGroupAddon,InputGroupText,FormText,Modal, ModalBody, ModalFooter, ModalHeader, Button,Collapse } from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import {toast} from 'react-toastify';
import { css } from 'glamor';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import cloneDeep from 'lodash/cloneDeep';
import YouTube from 'react-youtube';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => <InputGroupText><i className="fa fa-list"></i></InputGroupText>);
const SortableContainer = sortableContainer(({children}) => {
  return <ListGroup>{children}</ListGroup>;
});


class Autores extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      copy_data: null,
      changed: false,
      toast_id: null,
      modal_help: false,
      accordion: [false, false],
      modal_listgroup: false,
      loading: false
    };
    this.edit_data = this.edit_data.bind(this);
    this.edit_data_multi = this.edit_data_multi.bind(this);
    this.toggle_help = this.toggle_help.bind(this);
    this.toggle_listgroup = this.toggle_listgroup.bind(this);
  }
  
  async componentDidMount(){
    const get_data = await this.props.get_data("autores")
    if(get_data !== false){
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

  handleClickColor = () => {
    this.setState({ colorPickerShowing: !this.state.colorPickerShowing })
  };

  handleCloseColor = () => {
    this.setState({ colorPickerShowing: false })
  };

  add_res() {
    if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined && (this.state.data.list[this.state.now_listgroup_key].responder.length === 0 || (this.state.data.list[this.state.now_listgroup_key].responder[this.state.data.list[this.state.now_listgroup_key].responder.length-1] !== ""))){
      var new_data = {...this.state.data}
      new_data.list[this.state.now_listgroup_key].responder.push("");
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
  }

  delete_res(key) {
    if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      new_data.list[this.state.now_listgroup_key].responder[key] = null;
      new_data.list[this.state.now_listgroup_key].responder = new_data.list[this.state.now_listgroup_key].responder.filter(item => item !== null)
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
  }

  edit_list(event,key) {
    if (this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      if(event.target.type === "checkbox"){
        new_data.list[this.state.now_listgroup_key][event.target.id] = event.target.checked;
      }else if(event.target.id === "responder"){
        new_data.list[this.state.now_listgroup_key].responder[key] = event.target.value;
      }else{
        new_data.list[this.state.now_listgroup_key][event.target.id] = event.target.value;
      }
      this.setState({
        data:new_data,
      });
      this.check_data_save(new_data);
    }
  }

  delete_list(key) {
    var new_data = {...this.state.data}
    new_data.list[key] = null;
    new_data.list = new_data.list.filter(item => item !== null)
    this.setState({data:new_data});
    this.check_data_save(new_data);
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

  edit_data_color(id,event) {
    var new_data = {...this.state.data}
    new_data[id] = event.hex.replace("#","0x");
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

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
  
  edit_data_multi(id,value) {
    if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      const new_value = [];
      value.forEach((v, i) => {
        new_value.push(v.id)
      })
      this.state.data.list[this.state.now_listgroup_key][id] = new_value;
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
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
      if(await this.props.save_data(this.state.data.type,this.state.data) === true){
        this.setState({copy_data:cloneDeep(this.state.data),changed:false,loading:false});
        this.save_botton_show("hide");
      }else{
        this.setState({loading:false});
      }
    }else{
      this.setState({data:cloneDeep(this.state.copy_data),changed:false,loading:false});
      this.save_botton_show("hide");
    }
  }

  add_new_list(value) {
    var new_data = {...this.state.data}
    new_data.list.push({main:"",startend:"1",type:"1",min_msg:"1",justadmin:false,pm:false,delteble:false,embed:false,roles:[],responder:[],add_remove:[],channel:[]});
    this.setState({data:new_data});
    this.check_data_save(new_data);
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
  const SortableItem = sortableElement(({index,value}) => (
    <ListGroupItem className="justify-content-between Selector-list">
      <InputGroup className="m-1">
        <InputGroupAddon addonType="prepend">
          <DragHandle/>
        </InputGroupAddon>
        <InputGroupAddon onClick={() => this.toggle_listgroup(index)} addonType="prepend">
          <InputGroupText><i className="fa fa-wrench"></i></InputGroupText>
        </InputGroupAddon>
        <Input onClick={() => this.toggle_listgroup(index)} type="text" defaultValue={value.main} placeholder={this.props.language.dashboard.commands.activity_command.activity_asalah_soawl_main_placeholder}/>
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
          background: `${this.state.data ? this.state.data.autores_log_color ? this.state.data.autores_log_color.replace("0x","#") : null : null}`,
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
                <i className="fa fa-retweet"></i><strong>{this.props.language.dashboard.properties.autores.settings}</strong>
                <div className="card-header-actions">
                  <AppSwitch className={'float-right mb-0'} label id="active" color={'info'} checked={this.state.data.active} onClick={(event) => this.edit_data(event)} size={'sm'}/>
                </div>
              </CardHeader>
              <CardBody>
                <Modal isOpen={this.state.modal_listgroup} toggle={() => this.toggle_listgroup("open_close")} className={this.props.className}>
                  <ModalHeader toggle={() => this.toggle_listgroup("open_close")}><i className="fa fa-retweet"></i> {this.props.language.dashboard.properties.autores.res_settings_title}</ModalHeader>
                  <ModalBody>
                    <FormGroup>
                        {(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined && this.state.data.list[this.state.now_listgroup_key].startend === "5") ?
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <Input type="select" id="startend" value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].startend : null} onChange={(event) => this.edit_list(event)}>
                                <option value="1">{this.props.language.dashboard.properties.autores.equals}</option>
                                <option value="2">{this.props.language.dashboard.properties.autores.startswith}</option>
                                <option value="3">{this.props.language.dashboard.properties.autores.endwith}</option>
                                <option value="4">{this.props.language.dashboard.properties.autores.have}</option>
                                <option value="5">{this.props.language.dashboard.properties.autores.auto}</option>
                              </Input>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>{this.props.language.dashboard.properties.autores.every}</InputGroupText>
                            </InputGroupAddon>
                            <Input type="number" min="1" id="min_msg" placeholder={this.props.language.dashboard.properties.autores.min_msg_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].min_msg : null}/>
                            <InputGroupAddon addonType="append">
                              <Input type="select" id="type" value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].type : null} onChange={(event) => this.edit_list(event)}>
                                <option value="1">{this.props.language.dashboard.properties.autores.message}</option>
                                <option value="2">{this.props.language.dashboard.properties.autores.minute}</option>
                              </Input>
                            </InputGroupAddon>
                          </InputGroup>
                        : 
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>{this.props.language.dashboard.properties.autores.text_title}</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon addonType="prepend">
                              <Input type="select" id="startend" value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].startend : null} onChange={(event) => this.edit_list(event)}>
                                <option value="1">{this.props.language.dashboard.properties.autores.equals}</option>
                                <option value="2">{this.props.language.dashboard.properties.autores.startswith}</option>
                                <option value="3">{this.props.language.dashboard.properties.autores.endwith}</option>
                                <option value="4">{this.props.language.dashboard.properties.autores.have}</option>
                                <option value="5">{this.props.language.dashboard.properties.autores.auto}</option>
                              </Input>
                            </InputGroupAddon>
                            <Input type="text" id="main" placeholder={this.props.language.dashboard.properties.autores.text_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].main : null}/>
                          </InputGroup>
                        }
                      
                    </FormGroup>
                    <FormGroup>
                      {(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].responder.map((res,index) => {
                        return (
                        <InputGroup className="mt-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{index+1}</InputGroupText>
                        </InputGroupAddon>
                          <Input type="textarea" id="responder" placeholder={this.state.data.list[this.state.now_listgroup_key].startend !== "5" ? this.props.language.dashboard.properties.autores.responder_placeholder : this.props.language.dashboard.properties.autores.responder_auto_placeholder} onChange={(event) => this.edit_list(event,index)} value={res}/>
                          <InputGroupAddon addonType="append">
                            <Button size="sm" color="danger" onClick={() => this.delete_res(index)}><i className="fa fa-trash"></i></Button>
                          </InputGroupAddon>
                        </InputGroup>
                      );}) : null}
                      <Row className="justify-content-center mt-3 mb-0">
                        <FormGroup>
                          <Button block color="primary" className="btn-pill" onClick={() => this.add_res()}><i className="fa fa-plus"></i></Button>
                        </FormGroup>
                      </Row>
                    </FormGroup>
                    {(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined && this.state.data.list[this.state.now_listgroup_key].startend !== "5") ? 
                      <FormGroup>
                        <Label>{this.props.language.dashboard.properties.autores.res_roles_title}</Label>
                        <Select
                          closeMenuOnSelect={false}
                          components={makeAnimated()}
                          value={this.props.selected_guild.roles.filter(role => (this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].roles.includes(role.id) : null)}
                          options={this.props.selected_guild.roles}
                          onChange={(value) => this.edit_data_multi("roles",value)}
                          styles={colourStyles}
                          placeholder={this.props.language.dashboard.properties.autores.res_roles_placeholder}
                          isMulti
                        />
                        <FormText className="help-block">{this.props.language.dashboard.properties.autores.res_roles_example}</FormText>
                      </FormGroup>
                    : null}
                    <FormGroup>
                      <Label>{this.props.language.dashboard.properties.autores.res_channels_title}</Label>
                      <Select
                        closeMenuOnSelect={false}
                        components={makeAnimated()}
                        value={this.props.selected_guild.channels.filter(channel => channel.type === 0).filter(channel => (this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].channel.includes(channel.id) : null)}
                        options={this.props.selected_guild.channels.filter(channel => channel.type === 0)}
                        onChange={(value) => this.edit_data_multi("channel",value)}
                        styles={colourStyles}
                        placeholder={this.props.language.dashboard.properties.autores.res_channels_placeholder}
                        isMulti
                      />
                      <FormText className="help-block">{this.props.language.dashboard.properties.autores.res_channels_example}</FormText>
                    </FormGroup>
                    {(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined && this.state.data.list[this.state.now_listgroup_key].startend !== "5") ? 
                      <FormGroup>
                        <Label>{this.props.language.dashboard.properties.autores.add_remove_roles_title}</Label>
                        <Select
                          closeMenuOnSelect={false}
                          components={makeAnimated()}
                          value={this.props.selected_guild.roles.filter(role => (this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].add_remove.includes(role.id) : null)}
                          options={this.props.selected_guild.roles}
                          onChange={(value) => this.edit_data_multi("add_remove",value)}
                          styles={colourStyles}
                          placeholder={this.props.language.dashboard.properties.autores.add_remove_roles_placeholder}
                          isMulti
                        />
                        <FormText className="help-block">{this.props.language.dashboard.properties.autores.add_remove_roles_example}</FormText>
                      </FormGroup>
                    : null}
                    {(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined && this.state.data.list[this.state.now_listgroup_key].startend !== "5") ? 
                      <FormGroup>
                        <Row>
                          <Col md={6}>
                            <FormGroup check className="checkbox">
                              <Input className="mr-1" type="checkbox" color={'info'} id="pm" onChange={(event) => this.edit_list(event)} checked={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].pm : false} />
                              <Label check htmlFor="pm">{this.props.language.dashboard.properties.autores.only_pm_title}</Label>
                              <FormText className="help-block">{this.props.language.dashboard.properties.autores.only_pm_example}</FormText>
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup check className="checkbox">
                              <Input className="mr-1" type="checkbox" color={'info'} id="justadmin" onChange={(event) => this.edit_list(event)} checked={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].justadmin : false} />
                              <Label check htmlFor="justadmin">{this.props.language.dashboard.properties.autores.only_admin_title}</Label>
                              <FormText className="help-block">{this.props.language.dashboard.properties.autores.only_admin_example}</FormText>
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup check className="checkbox">
                              <Input className="mr-1" type="checkbox" color={'info'} id="embed" onChange={(event) => this.edit_list(event)} checked={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].embed : false} />
                              <Label check htmlFor="embed">{this.props.language.dashboard.properties.autores.embed_title}</Label>
                              <FormText className="help-block">{this.props.language.dashboard.properties.autores.embed_example}</FormText>
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup check className="checkbox">
                              <Input className="mr-1" type="checkbox" color={'info'} id="delteble" onChange={(event) => this.edit_list(event)} checked={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].delteble : false} />
                              <Label check htmlFor="delteble">{this.props.language.dashboard.properties.autores.delete_text_title}</Label>
                              <FormText className="help-block">{this.props.language.dashboard.properties.autores.delete_text_example}</FormText>
                            </FormGroup>
                          </Col>
                        </Row>
                      </FormGroup>
                    : null}
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
                  <FormGroup className="align-self-center">
                    <Button block color="primary" onClick={() => this.add_new_list()} className="btn-pill"><i className="fa fa-plus"></i></Button>
                  </FormGroup>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-retweet"></i><strong>{this.props.language.dashboard.properties.autores.autores_log_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <div style={styles.swatch} onClick={ this.handleClickColor }>
                    <div style={ styles.color }/>
                  </div>
                  {
                    this.state.colorPickerShowing ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                      <SketchPicker color={this.state.data.autores_log_color ? this.state.data.autores_log_color.replace("0x","#") : "#ffffff"} onChange={(event) => this.edit_data_color("autores_log_color",event)} disableAlpha={true} />
                    </div> : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.autores.autores_log_title_title}</Label>
                  <Input type="text" id="autores_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.autores_log_title || ''} placeholder={this.props.language.dashboard.properties.autores.autores_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.properties.autores.autores_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.autores.autores_log_channel_title}</Label>
                  <Input type="select" id="autores_log_channel" value={this.state.data.autores_log_channel} onChange={(event) => this.edit_data(event)}>
                    <option value="">{this.props.language.dashboard.properties.autores.autores_log_channel_disable}</option>
                    {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.properties.autores.autores_log_channel_example}</FormText>
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

export default Autores;
