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
import 'emoji-mart/css/emoji-mart.css'
import { Picker,Emoji  } from 'emoji-mart'

const DragHandle = sortableHandle(() => <InputGroupText><i className="fa fa-list"></i></InputGroupText>);
const SortableContainer = sortableContainer(({children}) => {
  return <ListGroup>{children}</ListGroup>;
});


class Reaction extends Component {
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
	  show_picker: false,
	  custom_emoji: [],
      loading: false
    };
    this.edit_data = this.edit_data.bind(this);
    this.edit_data_multi = this.edit_data_multi.bind(this);
    this.toggle_help = this.toggle_help.bind(this);
    this.toggle_listgroup = this.toggle_listgroup.bind(this);
  }
  
  async componentDidMount(){
	var custom_emoji = this.props.selected_guild.emojis.map((emi,index) => {return ({
    name: emi.name,
	short_names: [],
    id_: emi.id,
    text: '',
    emoticons: [],
    imageUrl: 'https://cdn.discordapp.com/emojis/'+String(emi.id)+'.'+(emi.animated ? 'gif' : 'png')+'?v=1',
    customCategory: this.props.selected_guild.name
  })})
  console.log(custom_emoji)
	this.setState({custom_emoji:custom_emoji})
    const get_data = await this.props.get_data("reaction_role")
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

  add_res(reaction) {
    if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined && (this.state.data.list[this.state.now_listgroup_key].reactions.length === 0 || (this.state.data.list[this.state.now_listgroup_key].reactions[this.state.data.list[this.state.now_listgroup_key].reactions.length-1].roles.length !== 0))){
      var new_data = {...this.state.data}
      new_data.list[this.state.now_listgroup_key].reactions.push({reaction:reaction,roles:[],});
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
  }

  delete_res(key) {
    if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      new_data.list[this.state.now_listgroup_key].reactions[key] = null;
      new_data.list[this.state.now_listgroup_key].reactions = new_data.list[this.state.now_listgroup_key].reactions.filter(item => item !== null)
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
  }

  edit_list(event,key) {
    if (this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      if(event.target.type === "checkbox"){
        new_data.list[this.state.now_listgroup_key][event.target.id] = event.target.checked;
      }else if(event.target.id === "reactions"){
        new_data.list[this.state.now_listgroup_key].reactions[key].roles = event.target.value;
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

  edit_data_multi_react(id,value,index) {
    if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      const new_value = [];
      value.forEach((v, i) => {
        new_value.push(v.id)
      })
	  this.state.data.list[this.state.now_listgroup_key].reactions[index][id] = new_value;
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
    new_data.list.push({main:"",justadmin:false,reactions:[],roles:[]});
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
          background: `${this.state.data ? this.state.data.reaction_role_log_color ? this.state.data.reaction_role_log_color.replace("0x","#") : null : null}`,
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
                <i className="fa fa-smile-o"></i><strong>{'أعدادات الرياكشون رول'}</strong>
                <div className="card-header-actions">
                  <AppSwitch className={'float-right mb-0'} label id="active" color={'info'} checked={this.state.data.active} onClick={(event) => this.edit_data(event)} size={'sm'}/>
                </div>
              </CardHeader>
              <CardBody>
                <Modal isOpen={this.state.modal_listgroup} toggle={() => this.toggle_listgroup("open_close")} className={this.props.className}>
                  <ModalHeader toggle={() => this.toggle_listgroup("open_close")}><i className="fa fa-smile-o"></i> أعدادات الرياكشون رول</ModalHeader>
                  <ModalBody>
                    <FormGroup>
					  <InputGroup>
						<InputGroupAddon addonType="prepend">
						  <InputGroupText>أيدي الرسالة</InputGroupText>
						</InputGroupAddon>
						<Input type="text" id="main" placeholder={'قم بلصق أيدي الرسالة هنا'} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].main : null}/>
					  </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      {(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].reactions.map((res,index) => {
                        return (
						<>
                        <InputGroup className="mt-1">
						<InputGroupAddon addonType="prepend">
						  <InputGroupText>{index+1}</InputGroupText>
						</InputGroupAddon>
							<InputGroupText>
								<Emoji emoji={res.reaction} set='twitter' size={32} />
							</InputGroupText>
                          <InputGroupAddon addonType="append">
                            <Button size="sm" color="danger" onClick={() => this.delete_res(index)}><i className="fa fa-trash"></i></Button>
                          </InputGroupAddon>
                        </InputGroup>
						  <FormGroup>
							<Select
							  closeMenuOnSelect={false}
							  components={makeAnimated()}
							  value={this.props.selected_guild.roles.filter(role => (res.roles.includes(role.id)))}
							  options={this.props.selected_guild.roles}
							  onChange={(value) => this.edit_data_multi_react("roles",value,index)}
							  styles={colourStyles}
							  placeholder={'أختر الرتب'}
							  isMulti
							/>
							<FormText className="help-block">أختر الرتب المراد أضافتها في حال أضافة الرياكشون وأزالتها في حال أزالة الرياكشون</FormText>
						  </FormGroup>
						  </>
						 );}) : null}
                      <Row className="justify-content-center mt-3 mb-0">
                        <FormGroup>
                          <Button block className="mb-3" color="primary" className="btn-pill" onClick={() => this.setState({show_picker: !this.state.show_picker})}><i className="fa fa-plus"></i></Button>
							  {this.state.show_picker &&
								<Picker title="FutureBOT" enableFrequentEmojiSort={true} showPreview={false} showSkinTones={false} custom={this.state.custom_emoji} theme={'dark'} skin={2} set='twitter' style={{ position: 'absolute',zIndex: 9999 }} onSelect={(emoji) => {this.add_res(emoji);this.setState({show_picker: !this.state.show_picker});}}/>
							  }
                        </FormGroup>
                      </Row>
                    </FormGroup>
                      <FormGroup>
                        <Label>{this.props.language.dashboard.properties.autores.res_roles_title}</Label>
                        <Select
                          closeMenuOnSelect={false}
                          components={makeAnimated()}
                          value={this.props.selected_guild.roles.filter(role => (this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].roles.includes(role.id) : null)}
                          options={this.props.selected_guild.roles}
                          onChange={(value) => this.edit_data_multi("roles",value)}
                          styles={colourStyles}
                          placeholder={'أختر الرتب المسموح لها أستخدام الرياكشون'}
                          isMulti
                        />
                        <FormText className="help-block">{this.props.language.dashboard.properties.autores.res_roles_example}</FormText>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md={12}>
                            <FormGroup check className="checkbox">
                              <Input className="mr-1" type="checkbox" color={'info'} id="justadmin" onChange={(event) => this.edit_list(event)} checked={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].justadmin : false} />
                              <Label check htmlFor="justadmin">{this.props.language.dashboard.properties.autores.only_admin_title}</Label>
                              <FormText className="help-block">{'فقط من يمتلكون صلاحية منج مسج يمكنه أستخدام الرياكشون'}</FormText>
                            </FormGroup>
                          </Col>
                        </Row>
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
                <i className="fa fa-smile-o"></i><strong>{'لوق الرياكشون رول'}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <div style={styles.swatch} onClick={ this.handleClickColor }>
                    <div style={ styles.color }/>
                  </div>
                  {
                    this.state.colorPickerShowing ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                      <SketchPicker color={this.state.data.reaction_role_log_color ? this.state.data.reaction_role_log_color.replace("0x","#") : "#ffffff"} onChange={(event) => this.edit_data_color("reaction_role_log_color",event)} disableAlpha={true} />
                    </div> : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{'موضوع لوق الرياكشون رول'}</Label>
                  <Input type="text" id="reaction_role_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.reaction_role_log_title || ''} placeholder={'أكتب موضوع لوق الرياكشون رول'}/>
                  <FormText className="help-block">{'الموضوع الأساسي : Reaction-Role'}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{'لوق الرياكشون رول'}</Label>
                  <Input type="select" id="reaction_role_log_channel" value={this.state.data.reaction_role_log_channel} onChange={(event) => this.edit_data(event)}>
                    <option value="">{'تعطيل لوق الرياكشون رول'}</option>
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

export default Reaction;
