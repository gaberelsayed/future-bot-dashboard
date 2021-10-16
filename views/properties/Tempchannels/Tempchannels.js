import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Label,Input,FormGroup,FormText,Modal, ModalBody, ModalFooter, ModalHeader, Button,Collapse } from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import {toast} from 'react-toastify';
import { css } from 'glamor';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import cloneDeep from 'lodash/cloneDeep';
import YouTube from 'react-youtube';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

class Tempchannels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      copy_data: null,
      changed: false,
      toast_id: null,
      modal_help: false,
      accordion: [false, false],
      loading: false,
	  vc_pr: [{label:'Create_Invite',value:'Create_Invite'},{label:'Manage_Channel',value:'Manage_Channel'},{label:'Manage_Permissions',value:'Manage_Permissions'},{label:'Video',value:'Video'},{label:'Mute_Members',value:'Mute_Members'},{label:'Deafen_Members',value:'Deafen_Members'}],
	  text_pr: [{label:'Create_Invite',value:'Create_Invite'},{label:'Manage_Channel',value:'Manage_Channel'},{label:'Manage_Permissions',value:'Manage_Permissions'},{label:'Manage_Messages',value:'Manage_Messages'},{label:'Embed_Links',value:'Embed_Links'},{label:'Attach_Files',value:'Attach_Files'},{label:'Mention_Everyone',value:'Mention_Everyone'}],
    };
    this.edit_data = this.edit_data.bind(this);
    this.edit_data_multi = this.edit_data_multi.bind(this);
	this.edit_data_multi_normal = this.edit_data_multi_normal.bind(this);
    this.toggle_help = this.toggle_help.bind(this);
  }
  
  async componentDidMount(){
    const get_data = await this.props.get_data("temp_room")
	console.log(this.props.selected_guild.channels)
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
    var new_data = {...this.state.data}
    const new_value = [];
    value.forEach((v, i) => {
      new_value.push(v.id)
    })
    new_data[id] = new_value;
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

  edit_data_multi_normal(id,value) {
    var new_data = {...this.state.data}
    const new_value = [];
    value.forEach((v, i) => {
      new_value.push(v.value)
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
      if(await this.props.save_data(this.state.data.type,this.state.data) === true){
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

  handleClickColor = () => {
    this.setState({ colorPickerShowing: !this.state.colorPickerShowing })
  };

  handleCloseColor = () => {
    this.setState({ colorPickerShowing: false })
  };

  edit_data_color(id,event) {
    var new_data = {...this.state.data}
    new_data[id] = event.hex.replace("#","0x");
    this.setState({data:new_data});
    this.check_data_save(new_data);
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
    if(!this.state.data){
      return (<div className="animated fadeIn pt-1 text-center"><div className="sk-folding sk-folding-cube"><div className="sk-cube1 sk-cube"></div><div className="sk-cube2 sk-cube"></div><div className="sk-cube4 sk-cube"></div><div className="sk-cube3 sk-cube"></div></div></div>)
    }
    const styles = reactCSS({
      'default': {
        color: {
          height: '14px',
          borderRadius: '2px',
          background: `${this.state.data ? this.state.data.temp_room_log_color.replace("0x","#") : null}`,
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
    return (
      <CSSTransitionGroup transitionName="fadeInput"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-clock-o"></i><strong>{'أعدادات الرومات المؤقتة'}</strong>
                <div className="card-header-actions">
                  <AppSwitch className={'float-right mb-0'} label id="active" color={'info'} checked={this.state.data.active} onClick={(event) => this.edit_data(event)} size={'sm'}/>
                </div>
              </CardHeader>
              <CardBody>
				<FormGroup>
				  <Label>{"الرومات الرئيسية"}</Label>
				  <Select
					closeMenuOnSelect={false}
					components={makeAnimated()}
					value={this.props.selected_guild.channels.filter(channel => channel.type === 2).filter(channel => this.state.data.temp_room_rooms.includes(channel.id))}
					options={this.props.selected_guild.channels.filter(channel => channel.type === 2)}
					onChange={(value) => this.edit_data_multi("temp_room_rooms",value)}
					isOptionDisabled={(option) => option.disabled === true}
					styles={colourStyles}
					placeholder={"أختر الرومات الرئيسية"}
					isMulti
				  />
				  <FormText className="help-block">عند دخول أيا من الرومات المختارة سيقوم البوت بأنشاء روم مؤقت</FormText>
				</FormGroup>
				<FormGroup>
				  <Label>{"صلاحيات الرومات الصوتية"}</Label>
				  <Select
					closeMenuOnSelect={false}
					components={makeAnimated()}
					value={this.state.vc_pr.filter(pr => this.state.data.temp_room_vc_permissions.includes(pr.value))}
					options={this.state.vc_pr}
					onChange={(value) => this.edit_data_multi_normal("temp_room_vc_permissions",value)}
					isOptionDisabled={(option) => option.disabled === true}
					styles={colourStyles}
					placeholder={"أختر الصلاحيات"}
					isMulti
				  />
				  <FormText className="help-block">سيقوم البوت بأعطاء صاحب الروم الصلاحيات المختارة</FormText>
				</FormGroup>
				{this.state.data.temp_room_text && 
					<FormGroup>
					  <Label>{"صلاحيات الشاتات الكتابية"}</Label>
					  <Select
						closeMenuOnSelect={false}
						components={makeAnimated()}
						value={this.state.text_pr.filter(pr => this.state.data.temp_room_tx_permissions.includes(pr.value))}
						options={this.state.text_pr}
						onChange={(value) => this.edit_data_multi_normal("temp_room_tx_permissions",value)}
						isOptionDisabled={(option) => option.disabled === true}
						styles={colourStyles}
						placeholder={"أختر الصلاحيات"}
						isMulti
					  />
					  <FormText className="help-block">سيقوم البوت بأعطاء صاحب الروم الصلاحيات المختارة للشات</FormText>
					</FormGroup>
				}
                <FormGroup check className="checkbox">
                  <Input className="mr-1" type="checkbox" color={'info'} id="temp_room_text" onChange={(event) => this.edit_data(event)} checked={this.state.data.temp_room_text} />
                  <Label check htmlFor="temp_room_text">أنشاء شات كتابي</Label>
                  <FormText className="help-block">سيقوم البوت بأنشاء شات كتابي مع الروم المؤقت</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-clock-o"></i><strong>{'لوق الرومات المؤقتة'}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <div style={styles.swatch} onClick={ this.handleClickColor }>
                    <div style={ styles.color }/>
                  </div>
                  {
                    this.state.colorPickerShowing ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                      <SketchPicker color={this.state.data.temp_room_log_color ? this.state.data.temp_room_log_color.replace("0x","#") : "#ffffff"} onChange={(event) => this.edit_data_color("temp_room_log_color",event)} disableAlpha={true} />
                    </div> : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{'موضوع لوق الرومات المؤقتة'}</Label>
                  <Input type="text" id="temp_room_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.temp_room_log_title || ''} placeholder={'أكتب موضوع لوق الرومات المؤقتة'}/>
                  <FormText className="help-block">{'الموضوع الأساسي : Temp-Channel'}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{'لوق الرومات المؤقتة'}</Label>
                  <Input type="select" id="temp_room_log_channel" value={this.state.data.temp_room_log_channel} onChange={(event) => this.edit_data(event)}>
                    <option value="">{'تعطيل لوق الرومات المؤقتة'}</option>
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

export default Tempchannels;
