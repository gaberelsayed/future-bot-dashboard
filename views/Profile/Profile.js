import React,{ Component } from 'react';
import { CardGroup, CardBody, CardHeader, Modal, ModalHeader, ModalBody, ModalFooter, Badge, label, Nav, NavItem, NavLink, TabContent, TabPane, Button, Progress, Container, Input, Row, Col, Card, InputGroupAddon, InputGroup, InputGroupText } from 'reactstrap';
import Zoom from 'react-reveal/Zoom';
import classnames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import LaddaButton, { EXPAND_RIGHT } from 'react-ladda';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: '1',
      activeTab: '1',
      changed : false,
      loading: false,
      bg_profile: false,
      data_save : {type: 'profile',data: {
          profile_instagram:this.props.userapi.profile_instagram,
          profile_twitter:this.props.userapi.profile_twitter,
          profile_snap:this.props.userapi.profile_snap,
          profile_facebook:this.props.userapi.profile_facebook,
          profile_note:this.props.userapi.profile_note
        }
      },
      copy_data_save : {type: 'profile',data: {
          profile_instagram:this.props.userapi.profile_instagram,
          profile_twitter:this.props.userapi.profile_twitter,
          profile_snap:this.props.userapi.profile_snap,
          profile_facebook:this.props.userapi.profile_facebook,
          profile_note:this.props.userapi.profile_note
        }
      },
    };
    this.toggle_bg_profile = this.toggle_bg_profile.bind(this);
    this.send_save = this.send_save.bind(this);
  }
  
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }
  
  toggle_bg_profile() {
    this.setState({
      bg_profile: !this.state.bg_profile,
    });
  }

  change_date(event) {
    var someProperty = {...this.state.data_save}
    someProperty.data[event.target.id] = event.target.value;
    this.setState({someProperty});
    let main = JSON.stringify(this.state.copy_data_save)
    let copy = JSON.stringify(this.state.data_save)
    if (!this.state.changed && copy !== main){
      this.setState({changed:true});
    }else if(this.state.changed && copy === main){
      this.setState({changed:false});
    }
  }
  
  async send_save(){
    this.setState({loading:true});
    if(await this.props.save_data(this.state.data_save.type,this.state.data_save.data) === true){
      this.setState({copy_data_save:cloneDeep(this.state.data_save),changed:false,loading:false});
    }else{
      this.setState({loading:false});
    }
  }

  render() { 

    return (
      <div className={this.props.dashboard ? null : "app-body background flex-row align-items-start"}>
        <div className={this.props.dashboard ? null : "container-fluid"}>
          <Zoom>
            <CardGroup>
              <Card className="m-1">
                <CardHeader className="text-center">
                  {this.props.userapi.username+"#"+this.props.userapi.discriminator}
                </CardHeader>
                <CardBody>
                  <Row className="align-items-center justify-content-center">
                    <Col md={1} className="text-center">
                      <img src={"https://cdn.discordapp.com/avatars/"+this.props.userapi.id+"/"+this.props.userapi.avatar+".jpg"} alt={this.props.userapi.id} className="img-avatar m-1"/>
                    </Col>
                    <Col md={2} className="justify-content-center m-1">
                      <InputGroup className="m-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText >{this.props.language.profile.level}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" disabled placeholder="level" value={this.props.userapi.level}/>
                        <InputGroupAddon addonType="append">
                          <InputGroupText><i className="fa fa-heart"></i>&nbsp;{this.props.userapi.likes}</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <InputGroup className="m-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{this.props.language.profile.exp}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" disabled placeholder="Total XP" value={this.props.userapi.total_xp} />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>#{this.props.userapi.xp_rank}</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <InputGroup className="m-1">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>{this.props.language.profile.gold}</InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" disabled placeholder="gold" value={this.props.userapi.gold}/>
                        <InputGroupAddon addonType="append">
                          <InputGroupText>#{this.props.userapi.gold_rank}</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    <Col md={4} className="text-center m-1">
                      <Row>
                        <Col md={6} className="text-center">
                          <InputGroup className="m-1">
                            <InputGroupAddon addonType="prepend">
                              <Button type="button" color="instagram" ><i className="fa fa-instagram"></i></Button>
                            </InputGroupAddon>
                            <Input type="text" placeholder="instagram" id="profile_instagram" onChange={(event) => this.change_date(event)} defaultValue={this.state.data_save.data.profile_instagram}/>
                          </InputGroup>
                        </Col>
                        <Col md={6} className="text-center">
                          <InputGroup className="m-1">
                            <InputGroupAddon addonType="prepend">
                              <Button type="button" color="primary"><i className="fa fa-twitter"></i></Button>
                            </InputGroupAddon>
                            <Input type="text" placeholder="twitter" id="profile_twitter" onChange={(event) => this.change_date(event)} defaultValue={this.state.data_save.data.profile_twitter}/>
                          </InputGroup>
                        </Col>
                        <Col md={6} className="text-center">
                          <InputGroup className="m-1">
                            <InputGroupAddon addonType="prepend">
                              <Button type="button" color="warning"><i className="fa fa-snapchat"></i></Button>
                            </InputGroupAddon>
                            <Input type="text" placeholder="snapchat" id="profile_snap" onChange={(event) => this.change_date(event)} defaultValue={this.state.data_save.data.profile_snap}/>
                          </InputGroup>
                        </Col>
                        <Col md={6} className="text-center">
                          <InputGroup className="m-1">
                            <InputGroupAddon addonType="prepend">
                              <Button type="button" color="facebook" ><i className="fa fa-facebook"></i></Button>
                            </InputGroupAddon>
                            <Input type="text" placeholder="facebook" id="profile_facebook" onChange={(event) => this.change_date(event)} defaultValue={this.state.data_save.data.profile_facebook}/>
                          </InputGroup>
                        </Col>
                        <Col md={12} className="text-center">
                          <InputGroup className="m-1">
                            <InputGroupAddon addonType="prepend">
                              <Button type="button" color="info" ><i className="fa fa-sticky-note-o"></i></Button>
                            </InputGroupAddon>
                            <Input type="text" placeholder="note" id="profile_note" onChange={(event) => this.change_date(event)} defaultValue={this.state.data_save.data.profile_note}/>
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={4} className="text-center profile_bg" onClick={this.toggle_bg_profile}>
                      <img src={require("../../img/shop/"+this.props.userapi.bg_now+"."+this.props.userapi.bg_type)} alt={this.props.userapi.id} className="m-1 bg_profile"/>
                      <div className="midchange">
                        <label>{this.props.language.profile.change_bg}</label>
                      </div>
                    </Col>
                    <Modal isOpen={this.state.bg_profile} toggle={this.toggle_bg_profile} style={{maxWidth : '800px'}} className={this.props.className} >
                      <ModalHeader toggle={this.toggle_bg_profile}>{this.props.language.profile.change_bg_profile}</ModalHeader>
                      <ModalBody>
                        <Row>
                          {this.props.userapi.shop.map((img,idx) => { 
                            return this.props.userapi.bgs.indexOf(img.dir) > -1 ? (
                              <Col sm="4" key={idx}>
                                <Card className="card-accent-info shadow profile_bg_change">
                                  <img className="card-img-top" src={require("../../img/shop/"+img.dir+"."+img.type)} alt={img.id} />
                                  <CardBody>
                                    <Row>
                                      <Col xs="6">
                                        <LaddaButton className="btn btn-primary btn-ladda" loading={this.state.loading} data-color="primary" data-style={EXPAND_RIGHT}><i className="fa fa-exchange"></i> {this.props.language.profile.apply}</LaddaButton>
                                      </Col>
                                      <Col xs="6" className="text-right">
                                        <LaddaButton className="btn btn-danger btn-ladda" loading={this.state.loading} data-color="danger" data-style={EXPAND_RIGHT}><i className="fa fa-trash"></i> {this.props.language.profile.sell}</LaddaButton>
                                      </Col>
                                    </Row>
                                  </CardBody>
                                </Card>
                              </Col>
                            )
                           : (null) })}
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="secondary" onClick={this.toggle_bg_profile}>{this.props.language.titles.close}</Button>
                      </ModalFooter>
                    </Modal>
                  </Row>
                  <Progress animated color="info" className="rounded m-3" value={this.props.userapi.percent_xp}>{"%"+this.props.userapi.percent_xp}</Progress>
                </CardBody>
              { this.state.changed ?
                <Zoom>
                  <Row>
                    <Col xs="12" className="text-center m-2">
                      <LaddaButton className="btn btn-success btn-ladda" loading={this.state.loading} onClick={() => {this.send_save();}} data-color="green" data-style={EXPAND_RIGHT}>{this.props.language.save_change.save_direct}</LaddaButton>
                    </Col>
                  </Row>
                  </Zoom>
                  : null
              }
              </Card>
            </CardGroup>
            <Row>
              <Col md={12}>
                <Nav tabs>
                  <NavItem>
                    <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>
                      <i className="icon-calculator"></i> <span className={this.state.activeTab === '1' ? '' : 'd-none'}> Top </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>
                      <i className="icon-basket-loaded"></i><span className={this.state.activeTab === '2' ? '' : 'd-none'}> Shop </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>
                      <i className="icon-pie-chart"></i> <span className={this.state.activeTab === '3' ? '' : 'd-none'}> Messages </span>{'\u00A0'}<Badge pill color="danger">29</Badge>
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <Row className="justify-content-center serverlist">
                      <Col md={2}>
                        <Card className="m-3 box-rank card-accent-info">
                          <img src={this.props.userapi.top_xp.avatar} alt={this.props.userapi.top_xp.id} className="card-img-top"/>
                          <CardBody>
                            <h5 className="card-title">{this.props.userapi.top_xp.username+"#"+this.props.userapi.top_xp.discriminator}</h5>
                            <InputGroup className="m-1">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>{this.props.language.profile.exp}</InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" disabled value={this.props.userapi.top_xp.total_xp} placeholder="Total XP" />
                              <InputGroupAddon addonType="append">
                                <InputGroupText>#1</InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                            {this.props.userapi.top_gold.id === this.props.userapi.top_xp.id ? 
                              <InputGroup className="m-1">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>{this.props.language.profile.gold}</InputGroupText>
                                </InputGroupAddon>
                                <Input type="text" disabled value={this.props.userapi.top_gold.gold} placeholder="gold" />
                                <InputGroupAddon addonType="append">
                                  <InputGroupText>#1</InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                            :null}
                            {this.props.userapi.top_like.id === this.props.userapi.top_xp.id ? 
                              <InputGroup className="m-1">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText><i className="fa fa-heart"></i></InputGroupText>
                                </InputGroupAddon>
                                <Input type="text" disabled value={this.props.userapi.top_like.likes} placeholder="likes" />
                                <InputGroupAddon addonType="append">
                                  <InputGroupText>#1</InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                            :null}
                          </CardBody>
                        </Card>
                      </Col>
                      {this.props.userapi.top_xp.id !== this.props.userapi.top_gold.id ?
                      <Col md={2}>
                        <Card className="m-3 box-rank card-accent-warning">
                          <img src={this.props.userapi.top_gold.avatar} alt={this.props.userapi.top_gold.id} className="card-img-top"/>
                          <CardBody>
                            <h5 className="card-title">{this.props.userapi.top_gold.username+"#"+this.props.userapi.top_gold.discriminator}</h5>
                            <InputGroup className="m-1">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>{this.props.language.profile.gold}</InputGroupText>
                              </InputGroupAddon>
                              <Input type="text" disabled value={this.props.userapi.top_gold.gold} placeholder="gold" />
                              <InputGroupAddon addonType="append">
                                <InputGroupText>#1</InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                            {this.props.userapi.top_like.id === this.props.userapi.top_gold.id ? 
                              <InputGroup className="m-1">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText><i className="fa fa-heart"></i></InputGroupText>
                                </InputGroupAddon>
                                <Input type="text" disabled value={this.props.userapi.top_like.likes} placeholder="likes" />
                                <InputGroupAddon addonType="append">
                                  <InputGroupText>#1</InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                            :null}
                          </CardBody>
                        </Card>
                      </Col>
                      : null}
                      {this.props.userapi.top_like.id !== this.props.userapi.top_gold.id && this.props.userapi.top_like.id !== this.props.userapi.top_xp.id ?
                        <Col md={2}>
                          <Card className="m-3 box-rank card-accent-danger">
                            <img src={this.props.userapi.top_like.avatar} alt={this.props.userapi.top_like.id} className="card-img-top"/>
                            <CardBody>
                              <h5 className="card-title">{this.props.userapi.top_like.username+"#"+this.props.userapi.top_like.discriminator}</h5>
                              <InputGroup className="m-1">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText><i className="fa fa-heart"></i></InputGroupText>
                                </InputGroupAddon>
                                <Input type="text" disabled value={this.props.userapi.top_like.likes} placeholder="likes" />
                                <InputGroupAddon addonType="append">
                                  <InputGroupText>#1</InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                            </CardBody>
                          </Card>
                        </Col>
                      : null}
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      {this.props.userapi.shop.map((img,idx) => { 
                        return this.props.userapi.bgs.indexOf(img.dir) > -1 && img.price !== 0 ? (
                          <Col sm="4" key={idx}>
                            <Card className="card-accent-info shadow profile_bg_change">
                              <img className="card-img" src={require("../../img/shop/"+img.dir+"."+img.type)} alt={img.id} />
                              <CardHeader className="text-center">
                                {img.name}
                              </CardHeader>
                              <div className="card-img-overlay p-1">
                                <Row>
                                  <Col xs="6">
                                    <LaddaButton className="btn btn-success btn-ladda" loading={this.state.loading} data-color="success" data-style={EXPAND_RIGHT}><i className="fa fa-money"></i> {img.price}</LaddaButton>
                                  </Col>
                                  <Col xs="6" className="text-right">
                                    <LaddaButton className="btn btn-primary btn-ladda" loading={this.state.loading} data-color="primary" data-style={EXPAND_RIGHT}><i className="fa fa-lightbulb-o"></i> {this.props.language.profile.test}</LaddaButton>
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          </Col>
                        )
                       : (null) })}
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <BootstrapTable data={this.props.userapi['notif']} version="4" striped hover pagination search options={{sortIndicator: true, hideSizePerPage: true, paginationSize: 3, hidePageListOnlyOnePage: true, clearSearch: true, alwaysShowAllBtns: false, withFirstAndLast: false}}>
                      <TableHeaderColumn isKey dataField="msg_ar">Date</TableHeaderColumn>
                      <TableHeaderColumn dataField="msg_ar" dataSort>Messages</TableHeaderColumn>
                      <TableHeaderColumn dataField="msg_ar" dataSort>test2</TableHeaderColumn>
                      <TableHeaderColumn dataField="msg_ar" dataSort>test3</TableHeaderColumn>
                    </BootstrapTable>
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
            <Container>
              <Row className="justify-content-center align-items-center">
              </Row>
            </Container>
          </Zoom>
        </div>
      </div>
      );
  }
}


export default Login;