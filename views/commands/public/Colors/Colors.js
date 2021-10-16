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
import {
  Stage,
  Layer,
  Text,
  Rect
} from "react-konva/lib/ReactKonvaCore";
import "konva/lib/shapes/Rect";
import "konva/lib/shapes/Text";
import "konva/lib/shapes/Image";

class GETColors extends React.Component {
  constructor(props) {
    super(props);
    this.shapeRef = React.createRef();
  }
  state = {
    image: null,
    name: "",
    height: (this.props.data.colors_box_name === "") ? 30 : 69,
    colors: [],
    data: cloneDeep(this.props.data)
  };
  componentDidMount() {
    if (this.props.data.backgrounds.length !== 0 && this.props.data.backgrounds[0] !== "") {
      this.loadImage();
    }
    this.loadcolors();
  }
  componentDidUpdate() {
    if ((this.props.data.backgrounds.length !== 0 && this.props.data.backgrounds[0] !== (this.state.data.backgrounds.length !== 0 ? this.state.data.backgrounds[0] : "") )) {
      if(this.props.data.backgrounds[0] === ""){
        this.setState({data:cloneDeep(this.props.data),image:null})
        this.loadcolors();
      }else{
        this.setState({data:cloneDeep(this.props.data)})
        this.loadImage();
        this.loadcolors();
      }
    }
    if(this.props.data.new_box !== this.state.data.new_box){
      this.setState({data:cloneDeep(this.props.data)})
      this.loadcolors();
    }
    if(this.props.data.colors_box_name !== this.state.data.colors_box_name){
      this.setState({data:cloneDeep(this.props.data)})
      this.loadcolors();
    }
    
  }
  componentWillUnmount() {
    if (this.image){
      this.image.removeEventListener('load', this.handleLoad);
    }
  }
  loadcolors() {
    var now_colors = [];
    if(this.props.data.new_box === ""){
      now_colors = this.props.guild.roles.sort(function (a, b) {return a.name - b.name;}).filter(r => isNaN(r.name) === false)
    }else{
      now_colors = this.props.data.colors[this.props.data.new_box-1].colors
    }
    var count = 0;
    var space = 46;
    var space_line = (this.props.data.colors_box_name === "") ? 30 : 69;
    var total_colors = now_colors.filter(r => isNaN(r.name) === false).length;
    const colors = [];

    now_colors.forEach((role, index) => {
      if(isNaN(role.name) === false){
        colors.push({name:role.name,color:(this.props.data.new_box === "") ? "#" + String(Number(role.color).toString(16)) : role.color,x:space,y:space_line})
        if (count === 10 ){
          count = 0
          space = 46;
          space_line = space_line+38
        }else{
          if (index === total_colors-1){
            space_line = space_line+30
          }
          space = space+38
          count = count+1
        }
      }
    })
    if (this.state.colors !== colors || this.state.height !== space_line){
    this.setState({colors:colors,height:space_line})}
  }
  loadImage() {
    this.image = new window.Image();
    this.image.src = this.props.data.backgrounds[0];
    this.image.addEventListener('load', this.handleLoad);
  }
  handleLoad = () => {
    this.setState({
      image: this.image
    });
  };
  render() {
    return (
      <div style={{width: "100%",}}>
      <Stage width={500} height={this.state.height}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={500}
            height={this.state.height}
            fillPatternImage={this.state.image}
            fillPatternRepeat= 'no-repeat'
            fillPatternScaleY={this.state.image && this.state.height / this.state.image.height}
            fillPatternScaleX={this.state.image && 500 / this.state.image.width}
            cornerRadius={35}
          />
          {this.state.colors.map((role, i) =>
              <Rect
                x={role.x}
                y={role.y}
                width={30}
                height={30}
                shadowBlur={3}
                cornerRadius={this.props.data.colors_type === true ? 15 : 7}
                shadowColor={"#666666"}
                fill={role.color}
              />
          )}
          {this.state.colors.map((role, i) =>
            <Text text={role.name}
              align={"center"}
              verticalAlign={"middle"}
              width={30}
              height={31}
              x={role.x}
              y={role.y}
              fontSize={15}
              fill="#fff"
              shadowColor='black'
              shadowBlur={5}
              shadowOffset={{ x: 1, y: 1 }}
              shadowOpacity={0.8}
            />
          )}
          {(this.props.data.colors_box_name !== "") && 
          <Text text={this.props.data.colors_box_name}
            align={"center"}
            verticalAlign={"middle"}
            textDecoration={"underline"}
            width={500}
            height={50}
            fontSize={33}
            y={8}
            fill="#fff"
            shadowColor='black'
            shadowBlur={2}
            shadowOffset={{ x: 2, y: 2 }}
            shadowOpacity={0.5}
          />}
        </Layer>
      </Stage>
    </div>
    );
  }
}

class Colors extends Component {
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
    const get_data = await this.props.get_data("colors_command")
    if(get_data !== false){
      get_data.data.colors_commands.forEach((command, index) => {
        get_data.data.colors_commands[index] = {};
        get_data.data.colors_commands[index].label = command;
        get_data.data.colors_commands[index].value = command;
      })
      get_data.data.colors_show_commands.forEach((command, index) => {
        get_data.data.colors_show_commands[index] = {};
        get_data.data.colors_show_commands[index].label = command;
        get_data.data.colors_show_commands[index].value = command;
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

  handleClickColor = () => {
    this.setState({ colorPickerShowing: !this.state.colorPickerShowing })
  };

  handleCloseColor = () => {
    this.setState({ colorPickerShowing: false })
  };

  add_bg() {
    if((this.state.data.backgrounds.length === 0 || (this.state.data.backgrounds[this.state.data.backgrounds.length-1] !== ""))){
      var new_data = {...this.state.data}
      new_data.backgrounds.push("");
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
  }

  delete_bg(key) {
    var new_data = {...this.state.data}
    new_data.backgrounds[key] = null;
    new_data.backgrounds = new_data.backgrounds.filter(item => item !== null)
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

  edit_data(event,idx) {
    var new_data = {...this.state.data}
    if(event.target.type === "checkbox"){
      new_data[event.target.id] = event.target.checked;
    }else if(event.target.id === "background"){
      new_data.backgrounds[idx] = event.target.value;
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
      new_data.colors_commands.forEach((command, index) => {
        new_commands.push(command.value)
      })
      new_data.colors_commands = new_commands
      var new_commands_show = []
      new_data.colors_show_commands.forEach((command, index) => {
        new_commands_show.push(command.value)
      })
      new_data.colors_show_commands = new_commands_show
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
          background: `${this.state.data ? this.state.data.colors_log_color.replace("0x","#") : null}`,
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
                <i className="fa fa-paint-brush"></i><strong>{this.props.language.dashboard.commands.colors_command.settings}</strong>
                <div className="card-header-actions">
                  <AppSwitch className={'float-right mb-0'} label id="active" color={'info'} checked={this.state.data.active} onClick={(event) => this.edit_data(event)} size={'sm'}/>
                </div>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.colors_command.colors_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.colors_commands}
                    onChange={(value) => this.edit_data_multi_commands("colors_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.colors_command.colors_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.colors_command.colors_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.colors_command.colors_show_commands_title}</Label>
                  <Creatable
                    components={makeAnimated()}
                    value={this.state.data.colors_show_commands}
                    onChange={(value) => this.edit_data_multi_commands("colors_show_commands",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.colors_command.colors_show_commands_placeholder}
                    noOptionsMessage={() => null}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.colors_command.colors_show_commands_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="m-1">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.commands.colors_command.colors_box_name_title}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" id="colors_box_name" onChange={(event) => this.edit_data(event)} value={this.state.data.colors_box_name || ''} placeholder={this.props.language.dashboard.commands.colors_command.colors_box_name_placeholder}/>
                  </InputGroup>
                  <FormText className="help-block">{this.props.language.dashboard.commands.colors_command.colors_box_name_example}</FormText>
                </FormGroup>
                <FormGroup check className="checkbox mb-2">
                  <Input className="mr-1" type="checkbox" color={'info'} id="colors_type" onChange={(event) => this.edit_data(event)} checked={this.state.data.colors_type} />
                  <Label check htmlFor="colors_type">{this.props.language.dashboard.commands.colors_command.colors_type}</Label>
                  <FormText className="help-block">{this.props.language.dashboard.commands.colors_command.colors_type_example}</FormText>
                </FormGroup>
                {this.state.data.backgrounds.map((bg,index) => {
                  return (
                  <InputGroup className="mt-1">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.commands.colors_command.background} {index+1}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" id="background" placeholder={this.props.language.dashboard.commands.colors_command.background_placeholder} onChange={(event) => this.edit_data(event,index)} value={bg}/>
                    <InputGroupAddon addonType="append">
                      <Button size="sm" color="danger" onClick={() => this.delete_bg(index)}><i className="fa fa-trash"></i></Button>
                    </InputGroupAddon>
                  </InputGroup>
                );})}
                <Row className="justify-content-center mt-3 mb-0">
                  <FormGroup>
                    <Button block color="primary" className="btn-pill" onClick={() => this.add_bg()}><i className="fa fa-plus"></i></Button>
                  </FormGroup>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-paint-brush"></i><strong>{this.props.language.dashboard.commands.colors_command.colors_roles_header}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.colors_command.colors_roles_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.roles.filter(role => this.state.data.colors_roles.includes(role.id))}
                    options={this.props.selected_guild.roles}
                    onChange={(value) => this.edit_data_multi("colors_roles",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.colors_command.colors_roles_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.colors_command.colors_roles_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.colors_command.colors_show_roles_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.roles.filter(role => this.state.data.colors_show_roles.includes(role.id))}
                    options={this.props.selected_guild.roles}
                    onChange={(value) => this.edit_data_multi("colors_show_roles",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.colors_command.colors_show_roles_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.colors_command.colors_show_roles_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.colors_command.disable_channels_colors_title}</Label>
                  <Select
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={this.props.selected_guild.channels.filter(channel => channel.type === 0).filter(channel => this.state.data.disable_channels.includes(channel.id))}
                    options={this.props.selected_guild.channels.filter(channel => channel.type === 0)}
                    onChange={(value) => this.edit_data_multi("disable_channels",value)}
                    styles={colourStyles}
                    placeholder={this.props.language.dashboard.commands.colors_command.disable_channels_colors_placeholder}
                    isMulti
                  />
                  <FormText className="help-block">{this.props.language.dashboard.commands.colors_command.disable_channels_colors_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-paint-brush"></i><strong>{this.props.language.dashboard.commands.colors_command.colors_log_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <div style={styles.swatch} onClick={ this.handleClickColor }>
                    <div style={ styles.color }/>
                  </div>
                  {
                    this.state.colorPickerShowing ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                      <SketchPicker color={this.state.data.colors_log_color ? this.state.data.colors_log_color.replace("0x","#") : "#ffffff"} onChange={(event) => this.edit_data_color("colors_log_color",event)} disableAlpha={true} />
                    </div> : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.colors_command.colors_log_title_title}</Label>
                  <Input type="text" id="colors_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.colors_log_title || ''} placeholder={this.props.language.dashboard.commands.colors_command.colors_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.commands.colors_command.colors_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.commands.colors_command.colors_log_channel_title}</Label>
                  <Input type="select" id="colors_log_channel" value={this.state.data.colors_log_channel} onChange={(event) => this.edit_data(event)}>
                    <option value="">{this.props.language.dashboard.commands.colors_command.colors_log_channel_disable}</option>
                    {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.commands.colors_command.colors_log_channel_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-paint-brush"></i><strong>{this.props.language.dashboard.commands.colors_command.colors_box_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <GETColors data={this.state.data} guild={this.props.selected_guild}/>
                </FormGroup>
                <FormGroup>
                  {(this.state.copy_data.new_box !== "") ?
                  <div className="text-center"><div className="sk-rotating-plane"></div><Label><strong>{this.props.language.dashboard.commands.colors_command.now_installing}</strong></Label></div>
                  :
                  <InputGroup className="mt-1">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.commands.colors_command.change_colors_box}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="select" id="new_box" value={this.state.data.new_box} onChange={(event) => this.edit_data(event)}>
                      <option value={""}>{this.props.language.dashboard.commands.colors_command.box_stay}</option>
                      {this.state.data.colors.map((box, i) => {
                        return (<option value={box.name}>{box.name+" "+this.props.language.dashboard.commands.colors_command.box_number}</option>)
                      })}
                    </Input>
                  </InputGroup>
                  }
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

export default Colors;
