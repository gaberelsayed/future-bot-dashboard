import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Label,Input,Badge,ListGroup,FormGroup,InputGroup,ListGroupItem,InputGroupAddon,InputGroupText,FormText,Modal, ModalBody, ModalFooter, ModalHeader, Button,Collapse } from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import {toast} from 'react-toastify';
import { css } from 'glamor';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import cloneDeep from 'lodash/cloneDeep';
import YouTube from 'react-youtube';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import {isMobile} from "react-device-detect";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import {
  Stage,
  Layer,
  Text,
  Image,
  Rect,
  Transformer
} from "react-konva/lib/ReactKonvaCore";
import "konva/lib/shapes/Rect";
import "konva/lib/shapes/Text";
import "konva/lib/shapes/Image";
import "konva/lib/shapes/Transformer";

const SortableContainer = sortableContainer(({children}) => {
  return <ListGroup>{children}</ListGroup>;
});

const DragHandle = sortableHandle(() => <InputGroupText><i className="fa fa-list"></i></InputGroupText>);

class Handler extends React.Component {
  componentDidMount() {
    this.checkNode();
  }
  componentDidUpdate() {
    this.checkNode();
  }
  checkNode() {
    const stage = this.transformer.getStage();
    const selectedNode = stage.findOne(this.props.name);
    if (selectedNode === this.transformer.node()) {
      return;
    }
    if (selectedNode) {
      this.transformer.attachTo(selectedNode);
    } else {
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }
  render() {
    return (
      <Transformer
        rotateEnabled={false}
        ref={node => {
          this.transformer = node;
        }}
      />
    );
  }
}

class URLImage extends React.Component {
  constructor(props) {
    super(props);
    this.shapeRef = React.createRef();
    this.avatar = React.createRef();
    this.addon = React.createRef();
  }
  state = {
    image: null,
    avatar: null,
    addon: null,
    name: "",
    data: this.props.data
  };
  componentDidMount() {
    if (this.props.data.bgs.length !== 0 && this.props.data.bgs[0] !== "") {
      this.loadImage();
    }
    if (!this.state.avatar){
      this.loadAvatar();
    }
    if (this.props.data.addonlink !== "") {
      this.loadAddon();
    }
  }
  componentWillReceiveProps() {
    if ((this.state.data && this.state.data.bgs.length !== 0 && this.state.data.bgs[0] !== "" && this.state.image === null ) || (this.props.data && this.props.data.bgs.length !== 0 && this.props.data.bgs[0] !== (this.image ? this.image.src : null))) {
      this.setState({data:this.props.data})
      this.loadImage();
    }
    if ((this.state.data && this.state.data.bgs.length === 0 && this.state.image ) || (this.state.data && this.state.data.bgs.length !== 0 && this.state.data.bgs[0] === "" && this.state.image)) {
      this.setState({image:null})
    }
    if ((this.state.data && this.state.data.addonlink !== "" && this.state.addon === null ) || (this.props.data && this.props.data.addonlink !== "" && this.props.data.addonlink !== (this.addon ? this.addon.src : null))) {
      this.setState({data:this.props.data})
      this.loadAddon();
    }
    if (!this.state.avatar){
      this.loadAvatar();
    }
  }
  componentWillUnmount() {
    if (this.image){
      this.image.removeEventListener('load', this.handleLoad);
    }
    if (this.avatarl){
      this.avatarl.removeEventListener('load', this.handleLoadAv);
    }
  }

  loadImage() {
    this.image = new window.Image();
    this.image.src = this.props.data.bgs[0];
    this.image.addEventListener('load', this.handleLoad);
  }
  handleLoad = () => {
    this.setState({
      image: this.image
    });
  };
  loadAvatar() {
    this.avatarl = new window.Image();
    if (this.props.user.avatar){
      this.avatarl.src = "https://cdn.discordapp.com/avatars/"+this.props.user.id+"/"+this.props.user.avatar+".png?size=256";
    }
    else{
      this.avatarl.src = "http://bl3rbe.net/up/50eqfI9.png";
    }
    this.avatarl.addEventListener('load', this.handleLoadAv);
  }
  handleLoadAv = () => {
    this.setState({
      avatar: this.avatarl
    });
  };
  loadAddon() {
    this.addonl = new window.Image();
    this.addonl.src = this.state.data.addonlink;
    this.addonl.addEventListener('load', this.handleLoadAd);
  }
  handleLoadAd = () => {
    this.setState({
      addon: this.addonl
    });
  };
  handleStageClick = e => {
    this.setState({
      name: e.target.name()
    });
  };
  render() {
    return (
      <Stage width={this.state.image ? this.state.image.width * Math.min(500 / this.state.image.width, 500 / this.state.image.height) : 500} height={this.state.image ? this.state.image.height * Math.min(500 / this.state.image.width, 500 / this.state.image.height) : 250} onClick={this.handleStageClick}>
        <Layer>
          {this.state.image &&
            <Image
              x={0}
              y={0}
              width={this.state.image && this.state.image.width * Math.min(500 / this.state.image.width, 500 / this.state.image.height)}
              height={this.state.image && this.state.image.height * Math.min(500 / this.state.image.width, 500 / this.state.image.height)}
              image={this.state.image}
              ref={node => {
                this.imageNode = node;
              }}
            />
          }
          {this.state.data.avatar !== "disable" ? (this.state.data.avatar === "cricale") ?
            <Rect
              name='avatar'
              x={this.state.data.avatarx}
              y={this.state.data.avatary}
              width={this.state.data.avatarw}
              height={this.state.data.avatarh}
              fillPatternImage={this.state.avatar}
              fillPatternRepeat= 'no-repeat'
              fillPatternScaleY={this.state.data.avatarh / (this.state.avatar ? this.state.avatar.width : 256)}
              fillPatternScaleX={this.state.data.avatarw / (this.state.avatar ? this.state.avatar.width : 256)}
              cornerRadius={this.state.data.avatarw/2}
              ref={this.avatar}
              draggable
              onDragEnd={e => {
                this.props.UpdateW({
                  type:'avatar',
                  avatarx: e.target.x(),
                  avatary: e.target.y()
                });
              }}
              onTransformEnd={e => {
                const node = this.avatar.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const width = Number(node.width() * scaleX).toFixed(2);
                const height = Number(node.height() * scaleY).toFixed(2);
                node.scaleX(1);
                node.scaleY(1);
                node.width(width);
                node.height(height);
                this.props.UpdateW({
                  type:'avatar',
                  types:'trans',
                  avatarw: width,
                  avatarh: height
                });
              }}
            />
          :
            <Image
              name='avatar'
              x={this.state.data.avatarx}
              y={this.state.data.avatary}
              width={this.state.data.avatarw}
              height={this.state.data.avatarh}
              image={this.state.avatar}
              ref={this.avatar}
              draggable
              onDragEnd={e => {
                this.props.UpdateW({
                  type:'avatar',
                  avatarx: e.target.x(),
                  avatary: e.target.y()
                });
              }}
              onTransformEnd={e => {
                const node = this.avatar.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const width = Number(node.width() * scaleX).toFixed(2);
                const height = Number(node.height() * scaleY).toFixed(2);
                node.scaleX(1);
                node.scaleY(1);
                node.width(width);
                node.height(height);
                this.props.UpdateW({
                  type:'avatar',
                  types:'trans',
                  avatarw: width,
                  avatarh: height
                });
              }}
            />
          : null}
          {(this.state.data.addon !== "disable" && this.state.data.addonlink !== "" && this.state.addon) ? (this.state.data.addon === "cricale") ?
            <Rect
              name='addon'
              x={this.state.data.addonx}
              y={this.state.data.addony}
              width={this.state.data.addonw !== 0 ? this.state.data.addonw : this.state.addon.height}
              height={this.state.data.addonh  !== 0 ? this.state.data.addonh : this.state.addon.width}
              fillPatternImage={this.state.addon}
              fillPatternRepeat= 'no-repeat'
              fillPatternScaleY={this.state.data.addonh / this.state.addon.height}
              fillPatternScaleX={this.state.data.addonw / this.state.addon.width}
              cornerRadius={this.state.data.addonw !== 0 ? this.state.data.addonw/2 : this.state.addon.width/2}
              ref={this.addon}
              draggable
              onDragEnd={e => {
                this.props.UpdateW({
                  type:'addon',
                  addonx: e.target.x(),
                  addony: e.target.y()
                });
              }}
              onTransformEnd={e => {
                const node = this.addon.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const width = Number(node.width() * scaleX).toFixed(2);
                const height = Number(node.height() * scaleY).toFixed(2);
                node.scaleX(1);
                node.scaleY(1);
                node.width(width);
                node.height(height);
                this.props.UpdateW({
                  type:'addon',
                  types:'trans',
                  addonw: width,
                  addonh: height
                });
              }}
            />
          :
            <Image
              name='addon'
              x={this.state.data.addonx}
              y={this.state.data.addony}
              width={this.state.data.addonw}
              height={this.state.data.addonh}
              image={this.state.addon}
              ref={this.addon}
              draggable
              onDragEnd={e => {
                this.props.UpdateW({
                  type:'addon',
                  addonx: e.target.x(),
                  addony: e.target.y()
                });
              }}
              onTransformEnd={e => {
                const node = this.addon.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                const width = Number(node.width() * scaleX).toFixed(2);
                const height = Number(node.height() * scaleY).toFixed(2);
                node.scaleX(1);
                node.scaleY(1);
                node.width(width);
                node.height(height);
                this.props.UpdateW({
                  type:'addon',
                  types:'trans',
                  addonw: width,
                  addonh: height
                });
              }}
            />
          : null}
            <Text name='username' text={this.props.user.username} ref={this.shapeRef} draggable 
              align={this.state.data.username}
              fontSize={this.state.data.usernames}
              x={this.state.data.usernamex}
              y={this.state.data.usernamey}
              fill={this.state.data.usernamec}
              width={this.state.image && this.state.image.width * Math.min(500 / this.state.image.width, 500 / this.state.image.height)}
              onDragEnd={e => {
                this.props.UpdateW({
                  type:'username',
                  usernamex: e.target.x(),
                  usernamey: e.target.y()
                });
              }}
              onTransformEnd={e => {
                const node = this.shapeRef.current;
                const new_size = Number(node.fontSize() * node.scaleY()).toFixed(2);
                this.props.UpdateW({
                  type:'username',
                  types:'font',
                  usernames: new_size
                });
                node.fontSize(new_size);
                node.scaleX(1);
                node.scaleY(1);
              }}
              shadowColor='black'
              shadowBlur={5}
              shadowOffset={{ x: 1, y: 1 }}
              shadowOpacity={0.8}
            />
          {!isMobile ?
            <Handler name={'.'+this.state.name}></Handler>
          : 
          <Handler name='.avatar'></Handler>
          }
          {isMobile &&
          <Handler name='.addon'></Handler>
          }
          {isMobile &&
          <Handler name='.username'></Handler>
          }
        </Layer>
      </Stage>
    );
  }
}

class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      copy_data: null,
      changed: false,
      toast_id: null,
      modal_help: false,
      accordion: [false, false],
      accordion_welcome: [false,false,false,false,false,false],
      modal_listgroup: false,
      loading: false
    };
    this.edit_data = this.edit_data.bind(this);
    this.edit_data_multi = this.edit_data_multi.bind(this);
    this.toggle_help = this.toggle_help.bind(this);
    this.toggle_listgroup = this.toggle_listgroup.bind(this);
  }
  
  async componentDidMount(){
    const get_data = await this.props.get_data("welcome")
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
  
  handleClickColorW = () => {
    this.setState({ colorPickerShowingW: !this.state.colorPickerShowingW })
  };

  handleCloseColorW = () => {
    this.setState({ colorPickerShowingW: false })
  };

  add_welcome_message() {
    if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined && (this.state.data.list[this.state.now_listgroup_key].messages.length === 0 || (this.state.data.list[this.state.now_listgroup_key].messages[this.state.data.list[this.state.now_listgroup_key].messages.length-1].text !== ""))){
      var new_data = {...this.state.data}
      new_data.list[this.state.now_listgroup_key].messages.push({text:"",dm:false});
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
  }

  delete_welcome_message(key) {
    if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      new_data.list[this.state.now_listgroup_key].messages[key] = null;
      new_data.list[this.state.now_listgroup_key].messages = new_data.list[this.state.now_listgroup_key].messages.filter(item => item !== null)
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
  }

  add_welcome_bg() {
    if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined && (this.state.data.list[this.state.now_listgroup_key].bgs.length === 0 || (this.state.data.list[this.state.now_listgroup_key].bgs[this.state.data.list[this.state.now_listgroup_key].bgs.length-1] !== ""))){
      var new_data = {...this.state.data}
      new_data.list[this.state.now_listgroup_key].bgs.push("");
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
  }

  delete_welcome_bg(key) {
    if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      new_data.list[this.state.now_listgroup_key].bgs[key] = null;
      new_data.list[this.state.now_listgroup_key].bgs = new_data.list[this.state.now_listgroup_key].bgs.filter(item => item !== null)
      this.setState({data:new_data});
      this.check_data_save(new_data);
    }
  }

  edit_list(event,key) {
    if (this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      if(event.target.type === "checkbox" && event.target.id !== "welcome-message-dm"){
        new_data.list[this.state.now_listgroup_key][event.target.id] = event.target.checked;
      }else if (event.target.id === "welcome-message"){
        new_data.list[this.state.now_listgroup_key].messages[key].text = event.target.value;
      }else if (event.target.id === "welcome-message-dm"){
        new_data.list[this.state.now_listgroup_key].messages[key].dm = event.target.checked;
      }else if (event.target.id === "welcome-bg"){
        new_data.list[this.state.now_listgroup_key].bgs[key] = event.target.value;
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
  
  UpdateW(event) {
    if (this.state.data.list[this.state.now_listgroup_key] !== undefined){
      var new_data = {...this.state.data}
      if(event.type === "avatar"){
        if(event.types === "trans"){
          new_data.list[this.state.now_listgroup_key].avatarw = event.avatarw;
          new_data.list[this.state.now_listgroup_key].avatarh = event.avatarh;
        }else{
          new_data.list[this.state.now_listgroup_key].avatarx = event.avatarx;
          new_data.list[this.state.now_listgroup_key].avatary = event.avatary;
        }
      }
      if(event.type === "addon"){
        if(event.types === "trans"){
          new_data.list[this.state.now_listgroup_key].addonw = event.addonw;
          new_data.list[this.state.now_listgroup_key].addonh = event.addonh;
        }else{
          new_data.list[this.state.now_listgroup_key].addonx = event.addonx;
          new_data.list[this.state.now_listgroup_key].addony = event.addony;
        }
      }
      if(event.type === "username"){
        if(event.types === "font"){
          new_data.list[this.state.now_listgroup_key].usernames = event.usernames;
        }else{
          new_data.list[this.state.now_listgroup_key].usernamex = event.usernamex;
          new_data.list[this.state.now_listgroup_key].usernamey = event.usernamey;
        }
      }
      this.setState({
        data:new_data,
      });
      this.check_data_save(new_data);
    }
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
    if(id === "welcome_color"){
      if(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined){
        new_data.list[this.state.now_listgroup_key].usernamec = event.hex;
      }
    }else{
      new_data[id] = event.hex.replace("#","0x");
    }
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

  toggleAccordionW(tab) {

    const prevState = this.state.accordion_welcome;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion_welcome: state,
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
      this.setState({data:cloneDeep(this.state.copy_data),changed:false,loading:false});
      this.save_botton_show("hide");
    }
  }

  add_new_list(value) {
    var new_data = {...this.state.data}
    new_data.list.push({name:"New Theme",idwc:false,b4photo:false,avatar:"cricale",avatarw:50,avatarh:50,avatarx:50,avatary:50,username:"center",usernames:15,usernamec:"#fff",usernamex:50,usernamey:50,addon:"cricale",addonlink:"www.google.com",addonw:0,addonh:0,addonx:50,addony:50,messages:[],bgs:[],});
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
        <Input onClick={() => this.toggle_listgroup(index)} type="text" defaultValue={value.name} placeholder={this.props.language.dashboard.commands.activity_command.activity_asalah_soawl_main_placeholder}/>
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
          background: `${this.state.data ? this.state.data.welcome_log_color ? this.state.data.welcome_log_color.replace("0x","#") : null : null}`,
        },
        colorW: {
          height: '14px',
          borderRadius: '2px',
          background: `${(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].usernamec ? this.state.data.list[this.state.now_listgroup_key].usernamec : null : null}`,
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
                <i className="fa fa-sign-in"></i><strong>{this.props.language.dashboard.properties.Welcome.settings}</strong>
                <div className="card-header-actions">
                  <AppSwitch className={'float-right mb-0'} label id="active" color={'info'} checked={this.state.data.active} onClick={(event) => this.edit_data(event)} size={'sm'}/>
                </div>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <InputGroup className="mb-2">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>{this.props.language.dashboard.properties.Welcome.clan_name_title}</InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" id="clan_name" onChange={(event) => this.edit_data(event)} placeholder={this.props.language.dashboard.properties.Welcome.clan_name_placeholder} value={this.state.data.clan_name}/>
                  </InputGroup>
                  <FormText className="help-block">{this.props.language.dashboard.properties.Welcome.clan_name_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.Welcome.leave_message_title}</Label>
                  <Input type="textarea" id="leave_message" onChange={(event) => this.edit_data(event)} placeholder={this.props.language.dashboard.properties.Welcome.leave_message_placeholder} value={this.state.data.leave_message}/>
                  <FormText className="help-block">{this.props.language.dashboard.properties.Welcome.leave_message_example}</FormText>
                </FormGroup>
                <FormGroup check className="checkbox mb-2">
                  <Input className="mr-1" type="checkbox" color={'info'} id="random_color" onChange={(event) => this.edit_data(event)} checked={this.state.data.random_color} />
                  <Label check htmlFor="random_color">{this.props.language.dashboard.properties.Welcome.autorole_colors_title}</Label>
                  <FormText className="help-block">{this.props.language.dashboard.properties.Welcome.autorole_colors_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-sign-in"></i><strong>{this.props.language.dashboard.properties.Welcome.channels_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.Welcome.welcome_channel_title}</Label>
                  <Input type="select" id="welcome_channel" value={this.state.data.welcome_channel} onChange={(event) => this.edit_data(event)}>
                    <option value=''>تعطيل الخاصية</option>
                    {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.properties.Welcome.welcome_channel_select}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.Welcome.autorole_title} <Badge className="ml-1" color="danger">Owner</Badge></Label>
                  <Input type="select" id="autorole" value={this.state.data.autorole} onChange={(event) => this.edit_data(event)}>
                    <option value=''>تعطيل الخاصية</option>
                    {this.props.selected_guild.roles.map((role, index) => {
                      return (<option key={index} value={role.id}>{role.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.properties.Welcome.autorole_select}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-sign-in"></i><strong>{this.props.language.dashboard.properties.Welcome.welcome_log_title}</strong>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <div style={styles.swatch} onClick={ this.handleClickColor }>
                    <div style={ styles.color }/>
                  </div>
                  {
                    this.state.colorPickerShowing ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                      <SketchPicker color={this.state.data.welcome_log_color ? this.state.data.welcome_log_color.replace("0x","#") : "#ffffff"} onChange={(event) => this.edit_data_color("welcome_log_color",event)} disableAlpha={true} />
                    </div> : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.Welcome.welcome_log_title_title}</Label>
                  <Input type="text" id="welcome_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.welcome_log_title || ''} placeholder={this.props.language.dashboard.properties.Welcome.welcome_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.properties.Welcome.welcome_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.Welcome.leave_log_title_title}</Label>
                  <Input type="text" id="leave_log_title" onChange={(event) => this.edit_data(event)} value={this.state.data.leave_log_title || ''} placeholder={this.props.language.dashboard.properties.Welcome.leave_log_title_placeholder}/>
                  <FormText className="help-block">{this.props.language.dashboard.properties.Welcome.leave_log_title_example}</FormText>
                </FormGroup>
                <FormGroup>
                  <Label>{this.props.language.dashboard.properties.Welcome.welcome_log_channel_title}</Label>
                  <Input type="select" id="welcome_log_channel" value={this.state.data.welcome_log_channel} onChange={(event) => this.edit_data(event)}>
                    <option value="">{this.props.language.dashboard.properties.Welcome.welcome_log_channel_disable}</option>
                    {this.props.selected_guild.channels.filter(channel => channel.type === 0).map((channel, index) => {
                      return (<option key={index} value={channel.id}>{channel.name}</option>);
                    })}
                  </Input>
                  <FormText className="help-block">{this.props.language.dashboard.properties.Welcome.welcome_log_channel_example}</FormText>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" md="6">
            <Card>
              <CardHeader>
                <i className="fa fa-sign-in"></i><strong>{this.props.language.dashboard.properties.Welcome.welcome_list_title}</strong>
              </CardHeader>
              <CardBody>
                <Modal isOpen={this.state.modal_listgroup} toggle={() => this.toggle_listgroup("open_close")} style={{maxWidth : '1200px'}} className={this.props.className}>
                  <ModalHeader toggle={() => this.toggle_listgroup("open_close")}><i className="fa fa-sign-in"></i> {this.props.language.dashboard.properties.Welcome.welcome_list_header_title}</ModalHeader>
                  
                  <ModalBody>
                    <div className="container">
                      <Row>
                        <Col lg="7 justify-content-center">
                          <div style={{border : '1px solid #167495'}}>
                            <URLImage user={this.props.userapi} data={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key] : {name:"New Theme",idwc:false,b4photo:false,avatar:"cricale",avatarw:50,avatarh:501,avatarx:50,avatary:50,username:"center",usernames:15,usernamec:"#fff",usernamex:50,usernamey:50,addon:"cricale",addonlink:"www.google.com",addonw:0,addonh:0,addonx:50,addony:50,messages:[],bgs:[],}} UpdateW={this.UpdateW.bind(this)}/>
                          </div>
                        </Col>
                        <Col lg="5">
                          <div id="accordion">
                            <Card>
                              <CardHeader id="headingsetting">
                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordionW(5)} aria-expanded={this.state.accordion_welcome[5]} aria-controls="collapsesetting">
                                  <h5 className="m-0 p-0">#0 {this.props.language.dashboard.properties.Welcome.welcome_settings}</h5>
                                </Button>
                              </CardHeader>
                              <Collapse isOpen={this.state.accordion_welcome[5]} data-parent="#accordion" id="collapsesetting" aria-labelledby="headingsetting">
                                <CardBody>
                                  <Row>
                                    <Col md={12}>
                                      <FormGroup>
                                        <Input type="text" name="welcome-settings-name" id="name" onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].name : ""} placeholder={this.props.language.dashboard.properties.Welcome.welcome_settings_name_placeholder} />
                                      </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                      <FormGroup check className="checkbox mb-2">
                                        <Input className="mr-1" type="checkbox" color={'info'} name="idwc" id="idwc" onChange={(event) => this.edit_list(event)} checked={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].idwc : false} />
                                        <Label check htmlFor="idwc">{this.props.language.dashboard.properties.Welcome.theme_settings_sendid_title} </Label>
                                        <FormText className="help-block">{this.props.language.dashboard.properties.Welcome.theme_settings_sendid_help}</FormText>
                                      </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                      <FormGroup check className="checkbox mb-2">
                                        <Input className="mr-1" type="checkbox" color={'info'} id="b4photo" onChange={(event) => this.edit_list(event)} checked={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].b4photo : false} />
                                        <Label check htmlFor="b4photo">{this.props.language.dashboard.properties.Welcome.theme_settings_b4photo_title}</Label>
                                        <FormText className="help-block">{this.props.language.dashboard.properties.Welcome.theme_settings_b4photo_help}</FormText>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Collapse>
                            </Card>
                            <Card>
                              <CardHeader id="headingbg">
                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordionW(4)} aria-expanded={this.state.accordion_welcome[4]} aria-controls="collapsebg">
                                  <h5 className="m-0 p-0">{this.props.language.dashboard.properties.Welcome.theme_background}</h5>
                                </Button>
                              </CardHeader>
                              <Collapse isOpen={this.state.accordion_welcome[4]} data-parent="#accordion" id="collapsebg" aria-labelledby="headingbg">
                                <CardBody>
                                  <Row>
                                    <Col md={12}>
                                      <FormGroup>
                                        <Row className="m-1">
                                          {(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined && this.state.data.list[this.state.now_listgroup_key].bgs !== null) ? this.state.data.list[this.state.now_listgroup_key].bgs.map((bg,idx) => {
                                            return (
                                              <Col md={12} key={idx}>
                                                <FormGroup>
                                                  <Row>
                                                    <Col md={12} className="mt-1">
                                                      <InputGroup>
                                                        <Input type="text" id="welcome-bg" placeholder={this.props.language.dashboard.properties.Welcome.theme_background_link} onChange={(event) => this.edit_list(event,idx)} value={bg}/>
                                                        <InputGroupAddon addonType="append">
                                                          <Button size="sm" color="danger" onClick={() => this.delete_welcome_bg(idx)}><i className="fa fa-trash"></i></Button>
                                                        </InputGroupAddon>
                                                      </InputGroup>
                                                    </Col>
                                                  </Row>
                                                </FormGroup>
                                              </Col>
                                            );
                                          }) : null}
                                        </Row>
                                        <Row className="justify-content-center">
                                          <FormGroup>
                                            <Button block color="primary" className="btn-pill" onClick={() => this.add_welcome_bg()}><i className="fa fa-plus"></i></Button>
                                          </FormGroup>
                                        </Row>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Collapse>
                            </Card>
                            <Card>
                              <CardHeader id="headingOne">
                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordionW(0)} aria-expanded={this.state.accordion_welcome[0]} aria-controls="collapseOne">
                                  <h5 className="m-0 p-0">{this.props.language.dashboard.properties.Welcome.theme_memberpic}</h5>
                                </Button>
                              </CardHeader>
                              <Collapse isOpen={this.state.accordion_welcome[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                <CardBody>
                                  <Row>
                                    <Col md={12}>
                                      <FormGroup>
                                        <Label for="user-avatar-type">{this.props.language.dashboard.properties.Welcome.theme_memberpic_shape}</Label>
                                        <Input type="select" min="1" name="user-avatar-type" id="avatar" onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].avatar : ""}>
                                          <option value={"disable"}>{this.props.language.dashboard.properties.Welcome.theme_memberpic_shape_disable}</option>
                                          <option value={"cricale"}>{this.props.language.dashboard.properties.Welcome.theme_memberpic_shape_circale}</option>
                                          <option value={"ract"}>{this.props.language.dashboard.properties.Welcome.theme_memberpic_shape_ract}</option>
                                        </Input>
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="user-avatar-h">{this.props.language.dashboard.properties.Welcome.theme_memberpic_leangth}</Label>
                                        <Input type="number" step=".01" min="1" name="user-avatar-h" id="avatarh" placeholder= {this.props.language.dashboard.properties.Welcome.theme_memberpic_leangth_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].avatarh : "50"} />
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="user-avatar-w">{this.props.language.dashboard.properties.Welcome.theme_memberpic_width}</Label>
                                        <Input type="number" step=".01" min="1" name="user-avatar-w" id="avatarw" placeholder= {this.props.language.dashboard.properties.Welcome.theme_memberpic_width} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].avatarw : "50"} />
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="user-avatar-y">{this.props.language.dashboard.properties.Welcome.theme_memberpic_y}</Label>
                                        <Input type="number" step=".01" min="1" name="user-avatar-y" id="avatary" placeholder={this.props.language.dashboard.properties.Welcome.theme_memberpic_y_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].avatary : "50"} />
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="user-avatar-x">{this.props.language.dashboard.properties.Welcome.theme_memberpic_x}</Label>
                                        <Input type="number" step=".01" min="1" name="user-avatar-x" id="avatarx" placeholder={this.props.language.dashboard.properties.Welcome.theme_memberpic_x_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].avatarx : "50"} />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Collapse>
                            </Card>
                            <Card>
                              <CardHeader id="headingTwo">
                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordionW(1)} aria-expanded={this.state.accordion_welcome[1]} aria-controls="collapseTwo">
                                  <h5 className="m-0 p-0">{this.props.language.dashboard.properties.Welcome.theme_membername}</h5>
                                </Button>
                              </CardHeader>
                              <Collapse isOpen={this.state.accordion_welcome[1]} data-parent="#accordion" id="collapseTwo" aria-labelledby="headingTwo">
                                <CardBody>
                                  <Row>
                                    <Col md={12}>
                                      <div style={styles.swatch} onClick={ this.handleClickColorW }>
                                        <div style={ styles.colorW }/>
                                      </div>
                                      {
                                        this.state.colorPickerShowingW ? <div style={ styles.popover }>
                                        <div style={ styles.cover } onClick={ this.handleCloseColorW }/>
                                          <SketchPicker onChange={(event) => this.edit_data_color("welcome_color",event)} color={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].usernamec : "#fffff"} disableAlpha={true} />
                                        </div> : null
                                      }
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="username-font-type">{this.props.language.dashboard.properties.Welcome.theme_membername_align}</Label>
                                        <Input type="select" min="1" name="username-font-type" id="username" onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].username : "center"}>
                                          <option value={"disable"}>{this.props.language.dashboard.properties.Welcome.theme_membername_align_disable}</option>
                                          <option value={"center"}>{this.props.language.dashboard.properties.Welcome.theme_membername_align_center}</option>
                                          <option value={"right"}>{this.props.language.dashboard.properties.Welcome.theme_membername_align_right}</option>
                                          <option value={"left"}>{this.props.language.dashboard.properties.Welcome.theme_membername_align_left}</option>
                                        </Input>
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="username-font-size">{this.props.language.dashboard.properties.Welcome.theme_membername_fontsize}</Label>
                                        <Input type="number" step=".01" min="1" name="username-font-size" id="usernames" placeholder={this.props.language.dashboard.properties.Welcome.theme_membername_fontsize_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].usernames : "15"} />
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="username-font-size-y">{this.props.language.dashboard.properties.Welcome.theme_membername_fontsize_y}</Label>
                                        <Input type="number" step=".01" min="1" name="username-font-size-y" id="usernamey" placeholder={this.props.language.dashboard.properties.Welcome.theme_membername_fontsize_y_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].usernamey : "50"} />
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="username-font-size-x">{this.props.language.dashboard.properties.Welcome.theme_membername_fontsize_x}</Label>
                                        <Input type="number" step=".01" min="1" name="username-font-size-x" id="usernamex" placeholder={this.props.language.dashboard.properties.Welcome.theme_membername_fontsize_x_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].usernamex : "50"} />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Collapse>
                            </Card>
                            <Card>
                              <CardHeader id="headingThree">
                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordionW(2)} aria-expanded={this.state.accordion_welcome[2]} aria-controls="collapseThree">
                                  <h5 className="m-0 p-0">{this.props.language.dashboard.properties.Welcome.theme_addonpic}</h5>
                                </Button>
                              </CardHeader>
                              <Collapse isOpen={this.state.accordion_welcome[2]} data-parent="#accordion" id="collapseThree" aria-labelledby="headingThree">
                                <CardBody>
                                  <Row>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="addon-avatar-type">{this.props.language.dashboard.properties.Welcome.theme_addonpic_shape}</Label>
                                        <Input type="select" min="1" name="addon-avatar-type" id="addon" onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].addon : "cricale"}>
                                          <option value={"disable"}>{this.props.language.dashboard.properties.Welcome.theme_addonpic_shape_disable}</option>
                                          <option value={"cricale"}>{this.props.language.dashboard.properties.Welcome.theme_addonpic_shape_circale}</option>
                                          <option value={"ract"}>{this.props.language.dashboard.properties.Welcome.theme_addonpic_shape_ract}</option>
                                        </Input>
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="addon-avatar-link">{this.props.language.dashboard.properties.Welcome.theme_addonpic_link}</Label>
                                        <Input type="text" name="addon-avatar-link" id="addonlink" placeholder={this.props.language.dashboard.properties.Welcome.theme_addonpic_link_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].addonlink : "www.google.com"}/>
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="addon-avatar-h">{this.props.language.dashboard.properties.Welcome.theme_addonpic_leangth}</Label>
                                        <Input type="number" step=".01" min="0" name="addon-avatar-h" id="addonh" placeholder={this.props.language.dashboard.properties.Welcome.theme_addonpic_leangth_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].addonh : "50"} />
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="addon-avatar-w">{this.props.language.dashboard.properties.Welcome.theme_addonpic_width}</Label>
                                        <Input type="number" step=".01" min="0" name="addon-avatar-w" id="addonw" placeholder={this.props.language.dashboard.properties.Welcome.theme_addonpic_width_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].addonw : "50"} />
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="addon-avatar-y">{this.props.language.dashboard.properties.Welcome.theme_addonpic_y}</Label>
                                        <Input type="number" step=".01" min="1" name="addon-avatar-y" id="addony" placeholder={this.props.language.dashboard.properties.Welcome.theme_addonpic_y_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].addony : "50"} />
                                      </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                      <FormGroup>
                                        <Label for="addon-avatar-x">{this.props.language.dashboard.properties.Welcome.theme_addonpic_x}</Label>
                                        <Input type="number" step=".01" min="1" name="addon-avatar-x" id="addonx" placeholder={this.props.language.dashboard.properties.Welcome.theme_addonpic_x_placeholder} onChange={(event) => this.edit_list(event)} value={(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ?  this.state.data.list[this.state.now_listgroup_key].addonx : "50"} />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Collapse>
                            </Card>
                            <Card>
                              <CardHeader id="headingFour">
                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordionW(3)} aria-expanded={this.state.accordion_welcome[3]} aria-controls="collapseFour">
                                  <h5 className="m-0 p-0">{this.props.language.dashboard.properties.Welcome.theme_welcome_messages}</h5>
                                </Button>
                              </CardHeader>
                              <Collapse isOpen={this.state.accordion_welcome[3]} data-parent="#accordion" id="collapseFour" aria-labelledby="headingFour">
                                <CardBody>
                                  <Row>
                                    <Col md={12}>
                                      <FormGroup>
                                        <Row className="m-1">
                                          {(this.state.now_listgroup_key !== undefined && this.state.data.list[this.state.now_listgroup_key] !== undefined) ? this.state.data.list[this.state.now_listgroup_key].messages.map((message,idx) => {
                                            return (
                                              <Col md={12} key={idx}>
                                                <FormGroup>
                                                  <InputGroup>
                                                    <Input type="textarea" id="welcome-message" placeholder={this.props.language.dashboard.properties.Welcome.theme_welcome_messages_placeholder} onChange={(event) => this.edit_list(event,idx)} value={message.text}/>
                                                    <InputGroupAddon addonType="append">
                                                      <Button size="sm" color="danger" onClick={() => this.delete_welcome_message(idx)}><i className="fa fa-trash"></i></Button>
                                                    </InputGroupAddon>
                                                  </InputGroup>
                                                  <Row>
                                                    <Col md={12} className="mt-1">
                                                      <AppSwitch className={'mx-1'} color={'primary'} label dataOn={'خاص'} dataOff={'عام'} id="welcome-message-dm" checked={message.dm} onChange={(event) => this.edit_list(event,idx)}/>
                                                    </Col>
                                                  </Row>
                                                </FormGroup>
                                              </Col>
                                            );
                                          }) : null}
                                        </Row>
                                        <Row className="justify-content-center">
                                          <FormGroup>
                                            <Button block color="primary" className="btn-pill" onClick={() => this.add_welcome_message()}><i className="fa fa-plus"></i></Button>
                                          </FormGroup>
                                        </Row>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </CardBody>
                              </Collapse>
                            </Card>
                          </div>
                        </Col>
                      </Row>
                    </div>
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
        </Row>
      </div>
      </CSSTransitionGroup>
    );
  }
}

export default Welcome;
