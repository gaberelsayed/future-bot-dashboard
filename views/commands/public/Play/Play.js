import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Label,Input,InputGroup,InputGroupAddon,InputGroupText,Dropdown,ButtonDropdown,DropdownToggle,DropdownMenu,DropdownItem,FormGroup,FormText,Modal, ModalBody, ModalFooter, ModalHeader, Button,Collapse } from 'reactstrap';
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
import {CopyToClipboard} from 'react-copy-to-clipboard';

class Link extends Component {
  constructor(props) {
    super(props);
    
    this.fileUpload = [];

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
    this.edit_dropdown = this.edit_dropdown.bind(this);
    this.toggle_help = this.toggle_help.bind(this);
    this.showFileUpload = this.showFileUpload.bind(this);
  }
  
  async componentDidMount(){
    const get_data = await this.props.get_data("play_command")
    if(get_data !== false){
      get_data.data.bots.forEach((bot, index) => {
        get_data.data.bots[index].dropdownOpen = [false,false];
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
  
  toggled(i,index_bot) {
    const newArray = this.state.data.bots[index_bot].dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    var new_data = {...this.state.data}
    new_data.bots[index_bot].dropdownOpen = newArray;
    this.setState({data:new_data});
  }

  edit_dropdown(i,value,index) {
    var new_data = {...this.state.data}
    new_data.bots[index][i] = value;
    this.setState({data:new_data});
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

  edit_data(event,index) {
    var new_data = {...this.state.data}
    if(event.target.type === "checkbox"){
      new_data.bots[index][event.target.id] = event.target.checked;
    }else{
      new_data.bots[index][event.target.id] = event.target.value;
    }
    this.setState({data:new_data});
  }

  edit_data_color(id,event) {
    var new_data = {...this.state.data}
    new_data[id] = event.hex.replace("#","0x");
    this.setState({data:new_data});
  }

  edit_data_multi(id,value,index) {
    var new_data = {...this.state.data}
    const new_value = [];
    value.forEach((v, i) => {
      new_value.push(v.id)
    })
    new_data.bots[index][id] = new_value;
    this.setState({data:new_data});
  }

  edit_data_multi_commands(id,value) {
    var new_data = {...this.state.data}
    const new_value = [];
    value.forEach((v, i) => {
      new_value.push(v)
    })
    new_data[id] = new_value;
    this.setState({data:new_data});
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

  async send_save(index){
    this.setState({loading:true});
      var new_data = {...this.state.data}
	  var new_data_copy = cloneDeep(this.state.copy_data)
	  new_data_copy.bots[index] = new_data.bots[index]
      if(await this.props.save_data(this.state.data.type,new_data.bots[index]) === true){
        this.setState({copy_data:new_data_copy,loading:false});
      }else{
        this.setState({loading:false});
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

  showFileUpload(index) {
    this.fileUpload[index].click();
  }

  async UploadImage(event,index) {
    var all_files = event.target.files
    let file = all_files[0];
    var new_data = {...this.state.data}
    var new_image = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      new_data.bots[index]['new_image'] = reader.result.toString();
      this.setState({new_image: new_image,data:new_data});
    };
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
    return (
      <CSSTransitionGroup transitionName="fadeInput"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
      <div className="animated fadeIn">
        <Row className="justify-content-center">
         {this.state.data.bots.map((bot, ind_bot) =>
          <Col xs="12" sm="4" md="4">
            <Card>
              <CardHeader>
                <i className="icon-link"></i><strong>{ind_bot+1}{"| "+bot.username}</strong>
              </CardHeader>
              <CardBody>
                    <Row className="align-items-center justify-content-center">
                      <Col xs="12" sm="12" md="12" className="text-center avatar_img"  onClick={() => this.showFileUpload(ind_bot)}>
                        <input ref={ref => (this.fileUpload[ind_bot] = ref)} type="file"style={{display: "none"}} id="imageuploader" name="imageuploader" accept=".jpg,.jpeg,.png," onChange={(event) => this.UploadImage(event,ind_bot)}/>
                        <img src={bot.new_image ? bot.new_image : bot.avatar} className="img-avatar bot_avatar" />
                        <div className="midchange">
                          <label>تغيير</label>
                        </div>
                      </Col>
                      <Col xs="12" sm="12" md="12" className="pt-5">
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText >الإسم</InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" id="username" placeholder="Activity Text" value={bot.username} onChange={(event) => this.edit_data(event,ind_bot)}/>
                        </InputGroup>
                        <InputGroup className="pt-2">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText >أنتهاء الأشتراك</InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" id="sub" placeholder="Sub End" value={bot.end}/>
                        </InputGroup>
                        <InputGroup className="pt-2">
                          <InputGroupAddon addonType="prepend">
                            <ButtonDropdown isOpen={bot.dropdownOpen[0]} toggle={() => {this.toggled(0,ind_bot);}}>
                              <DropdownToggle caret color={ bot.status === "online" ? "success" : bot.status === "idle" ? "warning" :  bot.status === "dnd" ? "danger" : "secondary"}>
                                {bot.status}
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem header>حالة البوت</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("status","online",ind_bot);}}>متصل</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("status","idle",ind_bot);}}> بالخارج</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("status","dnd",ind_bot);}}> مشغول</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("status","invisible",ind_bot);}}> مخفي</DropdownItem>
                              </DropdownMenu>
                            </ButtonDropdown>
                          </InputGroupAddon>
                          <InputGroupAddon addonType="prepend">
                            <ButtonDropdown isOpen={bot.dropdownOpen[1]} toggle={() => {this.toggled(1,ind_bot);}}>
                              <DropdownToggle caret style={{backgroundColor: (bot.activity === "playing" || bot.activity === "listening" || bot.activity === "watching") ? `#7289da` : bot.activity === "streaming" ? `#6441a5` : ``}} color={(bot.activity === "playing" || bot.activity === "listening" || bot.activity === "watching") ? "7289da" : bot.activity === "streaming" ? "#fff" : "secondary"}>
                                {bot.activity}
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem header>حالة اللعب</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("activity","nothing",ind_bot);}}>لا شيئ</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("activity","playing",ind_bot);}}>يلعب</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("activity","listening",ind_bot);}}>يستمع</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("activity","watching",ind_bot);}}>يشاهد</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("activity","streaming",ind_bot);}}>يبث</DropdownItem>
                              </DropdownMenu>
                            </ButtonDropdown>
                          </InputGroupAddon>
                          {bot.activity !== "nothing" && <Input type="text" id="activity_text" value={bot.activity_text} onChange={(event) => this.edit_data(event,ind_bot)}/>}
                        </InputGroup>
                      {bot.activity === "streaming" && 
                        <InputGroup className="pt-2">
                          <InputGroupAddon addonType="append">
                            <InputGroupText style={{backgroundColor: '#6441a5'}}>يوزر تويتش</InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" id="twitch" placeholder="Twitch User" value={bot.twitch} onChange={(event) => this.edit_data(event,ind_bot)}/>
                        </InputGroup>
                      }
                      <InputGroup className="pt-2">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{"الرابط"}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="embed code" value={"https://discordapp.com/oauth2/authorize?&client_id="+String(bot.id)+"&scope=bot&guild_id="+String(bot.guild_id)} readOnly/>
                        <CopyToClipboard onCopy={(type,text) => toast.info(this.props.language.upload.copied)} text={"https://discordapp.com/oauth2/authorize?&client_id="+String(bot.id)+"&scope=bot&guild_id="+String(bot.guild_id)}>
                          <InputGroupAddon addonType="append">
                            <Button type="button" color="primary">{this.props.language.upload.copy}</Button>
                          </InputGroupAddon>
                        </CopyToClipboard>
                      </InputGroup>
                        <FormGroup className="pt-5">
                          <Label>المخول لهم أستخدام البوت</Label>
                          <Select
                            closeMenuOnSelect={false}
                            components={makeAnimated()}
                            value={this.props.selected_guild.roles.filter(role => bot.commands_roles.includes(role.id))}
                            options={this.props.selected_guild.roles}
                            onChange={(value) => this.edit_data_multi("commands_roles",value,ind_bot)}
                            styles={colourStyles}
                            placeholder="أختر الرتب المخول لها"
                            isMulti
                          />
                          <FormText className="help-block">ملاحظة: في حال تركها فارغه سيكون بأمكان الجميع أستخدام الأوامر</FormText>
                        </FormGroup>
                        <FormGroup>
                          <Label>أدمن البوت</Label>
                          <Select
                            closeMenuOnSelect={false}
                            components={makeAnimated()}
                            value={this.props.selected_guild.roles.filter(role => bot.admin_roles.includes(role.id))}
                            options={this.props.selected_guild.roles}
                            onChange={(value) => this.edit_data_multi("admin_roles",value,ind_bot)}
                            styles={colourStyles}
                            placeholder="أختر الرتب المخول لها"
                            isMulti
                          />
                          <FormText className="help-block">ملاحظة: هذه الرتب سيكون بأمكانها التخطي او الايقاف للطلبات من غير اي شروط او حتى تغيير الصوت</FormText>
                        </FormGroup>
                        <FormGroup>
                          <Label>شاتات الأوامر</Label>
                          <Select
                            closeMenuOnSelect={false}
                            components={makeAnimated()}
                            value={this.props.selected_guild.channels.filter(channel => channel.type === 0).filter(channel => bot.text_channels.includes(channel.id))}
                            options={this.props.selected_guild.channels.filter(channel => channel.type === 0)}
                            onChange={(value) => this.edit_data_multi("text_channels",value,ind_bot)}
                            styles={colourStyles}
                            placeholder="أختر الشاتات"
                            isMulti
                          />
                          <FormText className="help-block">ملاحظة: في حال عدم أختيار اي شات ستعمل الأوامر بجميع الشاتات</FormText>
                        </FormGroup>
                        <FormGroup>
                          <Label>روم البوت</Label>
                          <Input type="select" id="voice_channel" value={bot.voice_channel} onChange={(event) => this.edit_data(event,ind_bot)}>
                            <option value="">جميع الرومات</option>
                            {this.props.selected_guild.channels.filter(channel => channel.type === 2).map((channel, index) => {
                              return (<option key={index} value={channel.id}>{channel.name}</option>);
                            })}
                          </Input>
                          <FormText className="help-block">ملاحظة: في حال عدم أختيار اي شات ستعمل الأوامر بجميع الشاتات</FormText>
                        </FormGroup>
						<FormGroup check className="checkbox">
						  <Input className="mr-1" type="checkbox" color={'info'} id="stay" onChange={(event) => this.edit_data(event,ind_bot)} checked={bot.stay} />
						  <Label check htmlFor="stay">ثبات في الروم</Label>
						  <FormText className="help-block">سيقوم البوت الدخول تلقائيا والثبات في الروم</FormText>
						</FormGroup>
                        {bot.voice_channel &&
                            <FormGroup check className="checkbox">
                              <Input className="mr-1" type="checkbox" color={'info'} id="no_prefix" onChange={(event) => this.edit_data(event,ind_bot)} checked={bot.no_prefix} />
                              <Label check htmlFor="no_prefix">بدون علامة</Label>
                              <FormText className="help-block">سيكون أستخدام الأوامر من غير العلامه وفقط من هم بالروم المخصص يمكنهم أستخدام البوت</FormText>
                            </FormGroup>
                        }
                        {(bot.voice_channel && bot.no_prefix) ? null :
                            <InputGroup className="pt-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >بادئة الأوامر</InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" id="prefix" placeholder="Prefix" value={bot.prefix} onChange={(event) => this.edit_data(event,ind_bot)}/>
                            </InputGroup>
                        }
                      {(JSON.stringify(this.state.data.bots[ind_bot]) !== JSON.stringify(this.state.copy_data.bots[ind_bot])) &&
                      <Row>
                        <Col xs="12" className="text-center pt-3">
                          <LaddaButton className="btn btn-success btn-ladda" loading={this.state.loading} onClick={() => {this.send_save(ind_bot);}} data-color="green" data-style={EXPAND_RIGHT}>{this.props.language.save_change.save_direct}</LaddaButton>
                        </Col>
                      </Row>
                      }
                    </Col>
                  </Row>
              </CardBody>
            </Card>
          </Col>
          )}
        </Row>
      </div>
      </CSSTransitionGroup>
    );
  }
}

export default Link;
