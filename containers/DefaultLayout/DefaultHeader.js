import React, { Component } from 'react';
import { Nav, NavItem, NavLink, Modal, ModalBody, ModalFooter, ModalHeader, Button, Input, Row, Col, Card, CardHeader, InputGroupAddon, InputGroup, InputGroupText, Progress, Form, FormGroup, Label } from 'reactstrap';
import PropTypes from 'prop-types';

import reactCSS from 'reactcss'
import { AppNavbarBrand, AppSidebarToggler, AppSwitch } from '@coreui/react';
import DefaultHeaderDropdown  from './DefaultHeaderDropdown'
import axios from 'axios';
import DiscordView from './embed/Discordview';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { SketchPicker } from 'react-color';
import { extractRGB, combineRGB } from './embed/Color';


import './embed/index.css';
import './embed/discord.css';
import 'highlight.js/styles/solarized-dark.css';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      modal_upload: false,
      modal_embed: false,
      expRight: false,
      uoload_perc: false,
      colorPickerShowing : false,
      initialEmbed : {
        embed : {
        title: 'title ~~(did you know you can have markdown here too?)~~',
        description: 'this supports [named links](https://discordapp.com) on top of the previously shown subset of markdown. ```\nyes, even code blocks```',
        url: 'https://discordapp.com',
        color: Math.floor(Math.random() * 0xFFFFFF),
        timestamp: new Date().toISOString(),
        footer: { icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png', text: 'footer text' },
        thumbnail: { url: 'https://cdn.discordapp.com/embed/avatars/0.png' },
        image: { url: 'https://cdn.discordapp.com/embed/avatars/0.png' },
        author: {
          name: 'author name',
          url: 'https://discordapp.com',
          icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
        },
        fields: [
          { name: '🙄', value: 'an informative error should show up, and this view will remain as-is until all issues are fixed' },
          { name: '<:thonkang:219069250692841473>', value: 'these last two', inline: true },
          { name: '<:thonkang:219069250692841473>', value: 'are inline fields', inline: true }
        ]
    }},
      uploaded: []
    };
    
    this.toggle_upload = this.toggle_upload.bind(this);
    this.toggle_embed = this.toggle_embed.bind(this);
    this.colorChange = this.colorChange.bind(this);
  }
  
  toggle(name) {
    this.setState({
      [name]: !this.state[name],
      progress: 0.5
    })
  }
  
  toggle_upload() {
    this.setState({
      modal_upload: !this.state.modal_upload,
    });
  }
  
  toggle_embed() {
    this.setState({
      modal_embed: !this.state.modal_embed,
    });
  }
  
  handleClickColor = () => {
    this.setState({ colorPickerShowing: !this.state.colorPickerShowing })
  };

  handleCloseColor = () => {
    this.setState({ colorPickerShowing: false })
  };
  
  colorChange(color) {
    let val = combineRGB(color.rgb.r, color.rgb.g, color.rgb.b);
    if (val === 0) val = 1; // discord wont accept 0
    var someProperty = {...this.state.initialEmbed}
    someProperty.embed.color = val;
    this.setState({someProperty});
  }
  
  async update_embed(event) {
    var someProperty = {...this.state.initialEmbed}
    const id_list = event.target.id.split("-");
    if (id_list.length === 2){
      someProperty.embed[id_list[0]][id_list[1]] = event.target.value;
    } else {
      someProperty.embed[event.target.id] = event.target.value;
    }
    this.setState({someProperty});
  }
  
  async update_fields(event,key) {
    var someProperty = {...this.state.initialEmbed}
    if(event.target.id === "inline"){
      if(event.target.checked === true){
        someProperty.embed.fields[key][event.target.id] = event.target.checked;
      }else{
        delete someProperty.embed.fields[key][event.target.id];
      }
    } else{
      someProperty.embed.fields[key][event.target.id] = event.target.value;
    }
    this.setState({someProperty});
  }
  
  async delete_embed(key) {
    var someProperty = {...this.state.initialEmbed}
    someProperty.embed.fields.splice(key, 1)
    this.setState({someProperty});
  }
  
  async add_embed() {
    var someProperty = {...this.state.initialEmbed}
    someProperty.embed.fields.push({name : "",value:""});
    this.setState({someProperty});
  }
  
  async UploadImage(event) {
    var all_files = event.target.files
    var total_perc = all_files.length;
    var last_upload = 0;
    for( var i = 0; i < all_files.length; i++ ){
      let formData = new FormData();
      let file = all_files[i];
      formData.append('imageuploader', file);
      await axios.post('https://bl3rbe.net', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          //eslint-disable-next-line
          onUploadProgress: function(progressEvent) {
            last_upload = last_upload+Math.round((progressEvent.loaded * 100)/progressEvent.total)/total_perc;
            this.setState({uoload_perc: parseInt(last_upload)});
          }.bind(this)
      })
      .then(res => {
        this.setState({uploaded : [...this.state.uploaded,res.data]});
      }).catch(error => {});
    }
    this.setState({uoload_perc: false});
  }

  render() {
    const styles = reactCSS({
      'default': {
        color: {
          height: '14px',
          borderRadius: '2px',
          background: `rgb(${extractRGB(this.state.initialEmbed.embed.color).r }, ${extractRGB(this.state.initialEmbed.embed.color).g }, ${extractRGB(this.state.initialEmbed.embed.color).b })`,
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
    var ItDash = true;
    if (this.props.selected_guild === null){ItDash = false;}
    return (
      <React.Fragment>
        {ItDash && <AppSidebarToggler className="d-lg-none" display="md" mobile />}
        
        <AppNavbarBrand
          full={{ src: this.props.logo, width: 40, height: 40, alt: 'Future BOT' }}
          minimized={{ src: this.props.logo, width: 35, height: 35, alt: 'Future BOT' }}
        />
        <Nav className="d-md-down-none ml-auto" navbar>
          <NavItem className="px-3">
            <NavLink href="#/" onClick={() => this.props.reset_guild()}><i className="icon-home"></i>  {this.props.language.titles.home}</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href={"#"+this.props.location.pathname} onClick={this.toggle_upload}><i className="fa fa-upload"></i>  {this.props.language.titles.upload}</NavLink>
                <Modal isOpen={this.state.modal_upload} toggle={this.toggle_upload} className={this.props.className} >
                  <ModalHeader toggle={this.toggle_upload}>{this.props.language.upload.title_model}</ModalHeader>
                  <ModalBody>
                    <div className="container">
                    <Row className="p-2">{!this.state.uoload_perc ?
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text" >{this.props.language.upload.files}</span>
                        </div>
                        <div className="custom-file">
                          <Input type="file" className="custom-file-input" id="imageuploader" name="imageuploader" accept=".jpg,.jpeg,.png,.gif,.ico" multiple onChange={(event) => this.UploadImage(event)}/>
                          <label className="custom-file-label" htmlFor="imageuploader">{this.props.language.upload.choose_file}</label>
                        </div>
                      </div> : 
                      <Progress bar animated color="info" className="rounded" value={this.state.uoload_perc}>{"%"+this.state.uoload_perc}</Progress>
                    }
                    </Row>
                    <Row>
                      {this.state.uploaded.map((img,idx) => {
                        return (
                          <Col sm="12" key={idx}>
                            <Card className="card-accent-info shadow">
                              <img className="card-img-top" src={img} alt={img} />
                              <CardHeader className="text-center">
                                <InputGroup>
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>{this.props.language.upload.link}</InputGroupText>
                                  </InputGroupAddon>
                                  <Input type="text" placeholder="link" value={img} readOnly/>
                                  <CopyToClipboard onCopy={(type,text) => this.props.toast_not('info',this.props.language.upload.copied)} text={img}>
                                    <InputGroupAddon addonType="append">
                                      <Button type="button" color="primary">{this.props.language.upload.copy}</Button>
                                    </InputGroupAddon>
                                  </CopyToClipboard>
                                </InputGroup>
                              </CardHeader>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.toggle_upload}>{this.props.language.titles.close}</Button>
                  </ModalFooter>
                </Modal>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href={"#"+this.props.location.pathname} onClick={this.toggle_embed}><i className="fa fa-code"></i>  {this.props.language.titles.embed_creator}</NavLink>
                <Modal isOpen={this.state.modal_embed} toggle={this.toggle_embed} style={{maxWidth : '1200px'}} className={this.props.className} >
                  <ModalHeader toggle={this.toggle_embed}>{this.props.language.embed.title_model}</ModalHeader>
                  <ModalBody>
                    <div className="container">
                      <Row>
                        <Col lg="5">
                          <Form name='embed-values'>
                            <FormGroup>
                              <div style={styles.swatch} onClick={ this.handleClickColor }>
                                <div style={ styles.color }/>
                              </div>
                                {
                                  this.state.colorPickerShowing ? <div style={ styles.popover }>
                                  <div style={ styles.cover } onClick={ this.handleCloseColor }/>
                                  <SketchPicker color={extractRGB(this.state.initialEmbed.embed.color)} onChange={this.colorChange} disableAlpha={true} />
                                  </div> : null
                                }
                            </FormGroup>
                            <Row>
                              <Col md={4}>
                                <FormGroup>
                                  <Label for="embed-author-name">{this.props.language.embed.author_name} :</Label>
                                  <Input type="text" name="embed-author-name" id="author-name" placeholder={this.props.language.embed.author_name} onChange={(event) => this.update_embed(event)} defaultValue={this.state.initialEmbed.embed.author.name} />
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label for="embed-author-icon_url">{this.props.language.embed.author_icon} :</Label>
                                  <Input type="text" name="embed-author-icon_url" id="author-icon_url" placeholder={this.props.language.embed.author_icon} onChange={(event) => this.update_embed(event)} defaultValue={this.state.initialEmbed.embed.author.icon_url} />
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label for="embed-author-url">{this.props.language.embed.author_link} :</Label>
                                  <Input type="text" name="embed-author-url" id="author-url" placeholder={this.props.language.embed.author_link} onChange={(event) => this.update_embed(event)} defaultValue={this.state.initialEmbed.embed.author.url} />
                                </FormGroup>
                              </Col>
                            </Row>
                            <FormGroup>
                              <Label for="embed-title">{this.props.language.embed.title} :</Label>
                              <Input type="text" name="embed-title" id="title" placeholder={this.props.language.embed.title} onChange={(event) => this.update_embed(event)} defaultValue={this.state.initialEmbed.embed.title} />
                            </FormGroup>
                            <FormGroup>
                              <Label for="embed-description">{this.props.language.embed.description} :</Label>
                              <Input type="textarea" name="embed-description" id="description" placeholder={this.props.language.embed.description} style={{height : '80px'}} onChange={(event) => this.update_embed(event)} defaultValue={this.state.initialEmbed.embed.description} />
                            </FormGroup>
                            <div style={{border : '1px solid #167495'}} className="mb-1">
                              <Row className="justify-content-center">
                                <FormGroup>
                                  {this.props.language.embed.fields}
                                </FormGroup>
                              </Row>
                              <Row className="m-1">
                                {this.state.initialEmbed.embed.fields.map((field,idx) => {
                                  return (
                                    <Col md={field.inline ? 6 : 12} key={idx}>
                                      <FormGroup>
                                        <Input type="text" className="mb-1" name="embed-field-name" id="name" placeholder={this.props.language.embed.field_title} onChange={(event) => this.update_fields(event,idx)} defaultValue={field.name}/>
                                        <Input type="textarea" name="embed-field-value" id="value" placeholder={this.props.language.embed.field_value} onChange={(event) => this.update_fields(event,idx)} defaultValue={field.value}/>
                                        <Row>
                                          <Col md={12} className="mt-1">
                                            <AppSwitch className={'mx-1'} color={'primary'} label name="embed-field-inline" id="inline" checked={field.inline ? true : false} onChange={(event) => this.update_fields(event,idx)}/>
                                            <Button size="sm" color="danger" style={{marginTop : '-20px'}} onClick={() => this.delete_embed(idx)}><i className="fa fa-trash"></i></Button>
                                          </Col>
                                        </Row>
                                      </FormGroup>
                                    </Col>
                                  );
                                })}
                              </Row>
                              <Row className="justify-content-center">
                                <FormGroup>
                                  <Button block color="primary" className="btn-pill" onClick={() => this.add_embed()}><i className="fa fa-plus"></i></Button>
                                </FormGroup>
                              </Row>
                            </div>
                            <Row>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="embed-thumbnail">{this.props.language.embed.thumbnail} :</Label>
                                  <Input type="text" name="embed-thumbnail" id="thumbnail-url" placeholder={this.props.language.embed.thumbnail} onChange={(event) => this.update_embed(event)} defaultValue={this.state.initialEmbed.embed.thumbnail.url} />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="embed-image">{this.props.language.embed.image} :</Label>
                                  <Input type="text" name="embed-image" id="image-url" placeholder={this.props.language.embed.image} onChange={(event) => this.update_embed(event)} defaultValue={this.state.initialEmbed.embed.image.url} />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="embed-footer-text">{this.props.language.embed.footer_text} :</Label>
                                  <Input type="text" name="embed-footer-text" id="footer-text" placeholder={this.props.language.embed.footer_text} onChange={(event) => this.update_embed(event)} defaultValue={this.state.initialEmbed.embed.footer.text} />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup>
                                  <Label for="embed-footer-icon_url">{this.props.language.embed.footer_icon} :</Label>
                                  <Input type="text" name="embed-footer-icon_url" id="footer-icon_url" placeholder={this.props.language.embed.footer_icon} onChange={(event) => this.update_embed(event)} defaultValue={this.state.initialEmbed.embed.footer.icon_url} />
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        </Col>
                        <Col lg="7">
                          <div style={{border : '1px solid #167495'}}>
                            <DiscordView data={this.state.initialEmbed} error={null} webhookMode={false} darkTheme={this.props.userapi ? this.props.userapi.theme === 'dark' ? true : false : true} compactMode={false} />
                              <InputGroup className="m-1 w-auto justify-content-center">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>{this.props.language.embed.embed_code}</InputGroupText>
                                </InputGroupAddon>
                                <Input type="text" placeholder="embed code" value={JSON.stringify(this.state.initialEmbed.embed)} readOnly/>
                                <CopyToClipboard onCopy={(type,text) => this.props.toast_not('info',this.props.language.upload.copied)} text={JSON.stringify(this.state.initialEmbed.embed)}>
                                  <InputGroupAddon addonType="append">
                                    <Button type="button" color="primary">{this.props.language.upload.copy}</Button>
                                  </InputGroupAddon>
                                </CopyToClipboard>
                              </InputGroup>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.toggle_embed}>{this.props.language.titles.close}</Button>
                  </ModalFooter>
                </Modal>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href={"#"+this.props.location.pathname} onClick={() => window.open("https://discord.gg/T6UkD9T", '_blank')}><i className="fa fa-question-circle"></i>  {this.props.language.titles.support}</NavLink>
          </NavItem>
          
        </Nav>
        <Nav className={this.props.userapi ? "ml-auto" : "ml-auto mr-3"} navbar>
          {this.props.userapi ? <DefaultHeaderDropdown language={this.props.language} userapi={this.props.userapi} read_notif={() => this.props.read_notif()} user_notif={this.props.userapi['notif']} notif/>: <DefaultHeaderDropdown language={this.props.language} loading_login={this.props.loading_login} loginbut={() => this.props.loginbut()} login/>}
          {this.props.userapi ? <DefaultHeaderDropdown language={this.props.language} userapi={this.props.userapi} user_tasks={this.props.userapi['tasks']} tasks/>: null}
          {this.props.userapi ? <DefaultHeaderDropdown language={this.props.language} userapi={this.props.userapi} change_theme={() => this.props.change_theme()} user_theme={this.props.userapi['theme']} upload_centre={this.toggle_upload} embed_centre={this.toggle_embed} reset_guild={() => this.props.reset_guild()} onLogout={this.props.logout} admin={this.props.userapi['admin']} user_id={this.props.userapi['id']} user_avatar={this.props.userapi['avatar']} user_name={this.props.userapi['username']} accnt/> : null}
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
