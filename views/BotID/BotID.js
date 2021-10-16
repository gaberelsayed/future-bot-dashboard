import React,{ Component,input } from 'react';
import { CardGroup, CardBody, CardHeader, Modal, ModalHeader, ModalBody,Dropdown,ButtonDropdown,DropdownToggle,DropdownMenu,DropdownItem, ModalFooter, Badge, label, Nav, NavItem, NavLink, TabContent, TabPane, Button, Progress, Container, Input, Row, Col, Card, InputGroupAddon, InputGroup, InputGroupText } from 'reactstrap';
import Zoom from 'react-reveal/Zoom';
import classnames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios';
import {toast} from 'react-toastify';
import { css } from 'glamor';
import {CopyToClipboard} from 'react-copy-to-clipboard';


class Tabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      copy_data: null,
      dropdownOpen:[false,false],
      toast_id: null,
      changed : false,
      loading: false,
    };
    this.fileUpload = React.createRef();
    this.showFileUpload = this.showFileUpload.bind(this);
    this.edit_dropdown = this.edit_dropdown.bind(this);
    this.edit_data = this.edit_data.bind(this);
  }

  async componentDidMount(){
    const get_data = await this.props.get_data("botid")
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
  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  edit_dropdown(i,value) {
    var new_data = {...this.state.data}
    new_data[i] = value;
    this.setState({data:new_data});
    this.check_data_save(new_data);
  }

  edit_data(event) {
    var new_data = {...this.state.data}
    new_data[event.target.id] = event.target.value;
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

  showFileUpload() {
    this.fileUpload.current.click();
  }

  async UploadImage(event) {
    var all_files = event.target.files
    let file = all_files[0];
    var new_data = {...this.state.data}
    var new_image = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      new_data['new_image'] = reader.result.toString();
      this.setState({new_image: new_image,data:new_data});
      this.check_data_save(new_data);
    };
  }

  render() { 
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
                <Card className="m-1">
                  <CardHeader className="text-center">
                    هوية البوت
                  </CardHeader>
                  <CardBody>
                    <Row className="align-items-center justify-content-center">
                      <Col xs="12" sm="3" md="3" className="text-center avatar_img"  onClick={this.showFileUpload}>
                        <input ref={this.fileUpload} type="file"style={{display: "none"}} id="imageuploader" name="imageuploader" accept=".jpg,.jpeg,.png," onChange={(event) => this.UploadImage(event)}/>
                        <img src={this.state.new_image ? this.state.new_image : this.state.data.avatar} className="img-avatar bot_avatar" />
                        <div className="midchange">
                          <label>تغيير</label>
                        </div>
                      </Col>
                      <Col xs="12" sm="9" md="9">
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText >الإسم</InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" id="username" placeholder="Activity Text" value={this.state.data.username} onChange={(event) => this.edit_data(event)}/>
                        </InputGroup>
                        {this.state.data.plus_end &&
                            <InputGroup className="pt-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >أنتهاء الأشتراك</InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" id="sub" placeholder="Sub End" value={this.state.data.plus_end}/>
                            </InputGroup>
                        }
                        <InputGroup className="pt-2">
                          <InputGroupAddon addonType="prepend">
                            <ButtonDropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {this.toggle(0);}}>
                              <DropdownToggle caret color={ this.state.data.status === "online" ? "success" : this.state.data.status === "idle" ? "warning" :  this.state.data.status === "dnd" ? "danger" : "secondary"}>
                                {this.state.data.status}
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem header>حالة البوت</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("status","online");}}>متصل</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("status","idle");}}> بالخارج</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("status","dnd");}}> مشغول</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("status","invisible");}}> مخفي</DropdownItem>
                              </DropdownMenu>
                            </ButtonDropdown>
                          </InputGroupAddon>
                          <InputGroupAddon addonType="prepend">
                            <ButtonDropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {this.toggle(1);}}>
                              <DropdownToggle caret style={{backgroundColor: (this.state.data.activity === "playing" || this.state.data.activity === "listening" || this.state.data.activity === "watching") ? `#7289da` : this.state.data.activity === "streaming" ? `#6441a5` : ``}} color={(this.state.data.activity === "playing" || this.state.data.activity === "listening" || this.state.data.activity === "watching") ? "7289da" : this.state.data.activity === "streaming" ? "#fff" : "secondary"}>
                                {this.state.data.activity}
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem header>حالة اللعب</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("activity","nothing");}}>لا شيئ</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("activity","playing");}}>يلعب</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("activity","listening");}}>يستمع</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("activity","watching");}}>يشاهد</DropdownItem>
                                <DropdownItem onClick={() => {this.edit_dropdown("activity","streaming");}}>يبث</DropdownItem>
                              </DropdownMenu>
                            </ButtonDropdown>
                          </InputGroupAddon>
                          {this.state.data.activity !== "nothing" && <Input type="text" id="activity_text" value={this.state.data.activity_text} onChange={(event) => this.edit_data(event)}/>}
                      </InputGroup>
                      {this.state.data.activity === "streaming" && 
                        <InputGroup className="pt-2">
                          <InputGroupAddon addonType="append">
                            <InputGroupText style={{backgroundColor: '#6441a5'}}>يوزر تويتش</InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" id="twitch" placeholder="Twitch User" value={this.state.data.twitch} onChange={(event) => this.edit_data(event)}/>
                        </InputGroup>
                      }
                      <InputGroup className="pt-2">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{"الرابط"}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="embed code" value={"https://discordapp.com/oauth2/authorize?&client_id="+String(this.state.data.id)+"&scope=bot&permissions=8&guild_id="+String(this.state.data.guild_id)} readOnly/>
                        <CopyToClipboard onCopy={(type,text) => toast.info(this.props.language.upload.copied)} text={"https://discordapp.com/oauth2/authorize?&client_id="+String(this.state.data.id)+"&scope=bot&permissions=8&guild_id="+String(this.state.data.guild_id)}>
                          <InputGroupAddon addonType="append">
                            <Button type="button" color="primary">{this.props.language.upload.copy}</Button>
                          </InputGroupAddon>
                        </CopyToClipboard>
                      </InputGroup>
                    </Col>
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


export default Tabs;