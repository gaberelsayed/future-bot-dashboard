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

class VoiceOnline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      copy_data: null,
      changed: false,
      toast_id: null,
      modal_help: false,
      accordion: [false, false],
      loading: false
    };
    this.edit_data = this.edit_data.bind(this);
    this.edit_data_multi = this.edit_data_multi.bind(this);
    this.toggle_help = this.toggle_help.bind(this);
  }
  
  async componentDidMount(){
    const get_data = await this.props.get_data("voiceonline")
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
          background: `${this.state.data ? this.state.data.voicechange_log_color.replace("0x","#") : null}`,
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
                <i className="icon-microphone"></i><strong>{this.props.language.dashboard.properties.VoiceOnline.settings}</strong>
                <div className="card-header-actions">
                  <AppSwitch className={'float-right mb-0'} label id="active" color={'info'} checked={this.state.data.active} onClick={(event) => this.edit_data(event)} size={'sm'}/>
                  <i className="icon-question float-right mr-1" style={{cursor: "help"}} onClick={this.toggle_help}></i>
                  <Modal isOpen={this.state.modal_help} toggle={this.toggle_help} className={this.props.className}>
                    <ModalHeader toggle={this.toggle_help}><i className="icon-microphone"></i>{this.props.language.dashboard.properties.VoiceOnline.title}</ModalHeader>
                    <ModalBody>
                      <FormGroup>
                        <Label><strong>{this.props.language.help_titles.about_title}</strong></Label>
                        <Label>{this.props.language.dashboard.properties.VoiceOnline.help.about_description}</Label>
                        {this.props.language.dashboard.properties.VoiceOnline.help.about_example.split('\n').map((item, i) => <FormText key={i} className="help-block mt-0">{item}</FormText>)}
                        <Label className="mb-0 mt-4"><strong>{this.props.language.help_titles.permissions_need}</strong></Label>
                        <Label className="mt-0">{this.props.language.dashboard.properties.VoiceOnline.help.permissions_note}</Label>
                        {this.props.language.dashboard.properties.VoiceOnline.help.permissions_help.split('\n').map((item, i) =>
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
                                {this.props.language.dashboard.properties.VoiceOnline.help.tutorial_text.map((item, i) =>
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
                                {this.props.language.dashboard.properties.VoiceOnline.help.tutorial_video ? <div><YouTube opts={{width: "100%",height: "100%"}} videoId={this.props.language.dashboard.properties.VoiceOnline.help.tutorial_video}/></div>: <div>{this.props.language.help_titles.soon}</div>}
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
                  <Label>{this.props.language.dashboard.properties.VoiceOnline.channel_name_title}</Label>
                  <Input type="text" id="channel_name" onChange={(event) => this.edit_data(event)} value={this.state.data.channel_name || ''} placeholder={this.props.language.dashboard.properties.VoiceOnline.channel_name_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.properties.VoiceOnline.channel_name_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.VoiceOnline.fake_voice_title}</Label>
                  <Input type="number" id="fake_voice" min="0" onChange={(event) => this.edit_data(event)} value={this.state.data.fake_voice || ''} placeholder={this.props.language.dashboard.properties.VoiceOnline.fake_voice_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.properties.VoiceOnline.fake_voice_example}</FormText>
                </FormGroup>
                <FormGroup check className="checkbox">
                  <Input className="mr-1" type="checkbox" color={'info'} id="without_bots" onChange={(event) => this.edit_data(event)} checked={this.state.data.without_bots} />
                  <Label check htmlFor="without_bots">{this.props.language.dashboard.properties.VoiceOnline.without_bots_title}</Label>
                  <FormText className="help-block">{this.props.language.dashboard.properties.VoiceOnline.without_bots_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="icon-microphone"></i><strong>{this.props.language.dashboard.properties.VoiceOnline.channels_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.VoiceOnline.channels_main_room_title}</Label>
                  <Input type="select" id="main_channel" value={this.state.data.main_channel} onChange={(event) => this.edit_data(event)}>
                    {this.props.selected_guild.channels.map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.properties.VoiceOnline.channels_main_room_select}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.VoiceOnline.channels_category_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.channels.filter(channel => channel.type !== 4).filter(channel => this.state.data.voice_online_rooms.includes(channel.id))}
                    options={this.props.selected_guild.channels.filter(channel => channel.type !== 4)}
                    onChange={(value) => this.edit_data_multi("voice_online_rooms",value)}
                    isOptionDisabled={(option) => option.disabled === true}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.properties.VoiceOnline.channels_category_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.properties.VoiceOnline.channels_category_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="icon-microphone"></i><strong>{this.props.language.dashboard.properties.VoiceOnline.voicechange_log_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <div style={styles.swatch} onClick={ this.handleClickColor }>
                    <div style={ styles.color }/>
                  </div>
                  {
                    this.state.colorPickerShowing ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                      <SketchPicker color={this.state.data.voicechange_log_color ? this.state.data.voicechange_log_color.replace("0x","#") : "#ffffff"} onChange={(event) => this.edit_data_color("voicechange_log_color",event)} disableAlpha={true} />
                    </div> : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.VoiceOnline.voicechange_log_title_title}</Label>
                  <Input type="text" id="voicechange_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.voicechange_log_title || ''} placeholder={this.props.language.dashboard.properties.VoiceOnline.voicechange_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.properties.VoiceOnline.voicechange_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.VoiceOnline.voicechange_log_channel_title}</Label>
                  <Input type="select" id="voicechange_log_channel" value={this.state.data.voicechange_log_channel} onChange={(event) => this.edit_data(event)}>
                    <option value="">{this.props.language.dashboard.properties.VoiceOnline.voicechange_log_channel_disable}</option>
                    {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.properties.VoiceOnline.voicechange_log_channel_example}</FormText>
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

export default VoiceOnline;
