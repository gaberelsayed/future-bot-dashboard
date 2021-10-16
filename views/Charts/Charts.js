import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, ButtonToolbar,ButtonGroup,Progress,CardColumns,TabPane,Nav,NavLink,TabContent,NavItem,Label,Input,FormGroup,ListGroup,ListGroupItem,InputGroup,InputGroupAddon,InputGroupText,FormText,Modal, ModalBody, ModalFooter, ModalHeader, Button,Collapse } from 'reactstrap';
import {toast} from 'react-toastify';
import { css } from 'glamor';
import cloneDeep from 'lodash/cloneDeep';
import YouTube from 'react-youtube';
import reactCSS from 'reactcss';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import CSSTransitionGroup from 'react-addons-css-transition-group';

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: false
            }
        }],
        xAxes: [{
            type: 'time',
            time: {
                parser: 'YYYY-MM-DD'
            }
        }]
    },
    legend: {
        display: false,
    },
  responsive: true,
  maintainAspectRatio: true
}

class Charts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      toast_id: null,
      model_all: false,
      modal_listgroup: false,
      accordion: [false, false],
      activeTab: new Array(2).fill('1'),
      radioSelected: {join:30,out:30,ban:30,kick:30,voice:30,message:30},
    };
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.toggle_listgroup = this.toggle_listgroup.bind(this);
  }

  async componentDidMount(){
    const get_data = await this.props.get_data("charts")
    if(get_data !== false){
        const chart = {
          labels: [],
          datasets: [
            {
              label: 'Sta',
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [],
            },
          ],
        };
        get_data.data.join = chart
        get_data.data.out = cloneDeep(chart)
        get_data.data.ban = cloneDeep(chart)
        get_data.data.kick = cloneDeep(chart)
        get_data.data.voice = cloneDeep(chart)
        get_data.data.message = cloneDeep(chart)
        get_data.data.charts.forEach(function(item) {
            if (get_data.data.join.labels.indexOf(item['time']) === -1){
                get_data.data.join.labels.push(item['time']);
                get_data.data.join.datasets[0].data.push(item['joins']);
                get_data.data.out.labels.push(item['time']);
                get_data.data.out.datasets[0].data.push(item['out']);
                get_data.data.ban.labels.push(item['time']);
                get_data.data.ban.datasets[0].data.push(item['bans']);
                get_data.data.kick.labels.push(item['time']);
                get_data.data.kick.datasets[0].data.push(item['kick']);
                get_data.data.voice.labels.push(item['time']);
                get_data.data.voice.datasets[0].data.push(item['voice']);
                get_data.data.message.labels.push(item['time']);
                get_data.data.message.datasets[0].data.push(item['messages']);

            }
        });
        this.setState({data:get_data.data,copy_data:cloneDeep(get_data.data)})
        this.onRadioBtnClick(30,'join')
        this.onRadioBtnClick(30,'out')
        this.onRadioBtnClick(30,'ban')
        this.onRadioBtnClick(30,'kick')
        this.onRadioBtnClick(30,'voice')
        this.onRadioBtnClick(30,'message')
    }
  }

  componentWillUnmount() {
    if(this.state.toast_id){
      toast.dismiss(this.state.toast_id)
      this.setState({toast_id:null})
    }
  }

  onRadioBtnClick(radioSelected,type) {
    const data_ra = this.state.radioSelected;
    data_ra[type] = radioSelected;
    const data_chart = this.state.copy_data
    data_chart[type].labels = this.state.data[type].labels.slice(Math.max(this.state.data[type].labels.length - radioSelected, 0))
    data_chart[type].datasets[0].data = this.state.data[type].datasets[0].data.slice(Math.max(this.state.data[type].labels.length - radioSelected, 0))
    this.setState({
      copy_data: data_chart,
      radioSelected: data_ra,
    });
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

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
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
        <CardColumns className="cols-2">
          <Card>
            <CardHeader>
              أحصائيات الصوت
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <ButtonToolbar className="justify-content-center" aria-label="Toolbar with button groups">
                  <ButtonGroup className="mr-1" aria-label="First group">
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(7,'voice')} active={this.state.radioSelected.voice === 7}>Week</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(30,'voice')} active={this.state.radioSelected.voice === 30}>Month</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(365,'voice')} active={this.state.radioSelected.voice === 365}>Year</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(0,'voice')} active={this.state.radioSelected.voice === 0}>All</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <Line data={this.state.radioSelected.voice === 0 ? this.state.data.voice : this.state.copy_data.voice} options={options} />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              أحصائيات الرسائل
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <ButtonToolbar className="justify-content-center" aria-label="Toolbar with button groups">
                  <ButtonGroup className="mr-1" aria-label="First group">
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(7,'message')} active={this.state.radioSelected.message === 7}>Week</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(30,'message')} active={this.state.radioSelected.message === 30}>Month</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(365,'message')} active={this.state.radioSelected.message === 365}>Year</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(0,'message')} active={this.state.radioSelected.message === 0}>All</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <Line data={this.state.radioSelected.message === 0 ? this.state.data.message : this.state.copy_data.message} options={options} />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              أحصائيات الدخول
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <ButtonToolbar className="justify-content-center" aria-label="Toolbar with button groups">
                  <ButtonGroup className="mr-1" aria-label="First group">
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(7,'join')} active={this.state.radioSelected.join === 7}>Week</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(30,'join')} active={this.state.radioSelected.join === 30}>Month</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(365,'join')} active={this.state.radioSelected.join === 365}>Year</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(0,'join')} active={this.state.radioSelected.join === 0}>All</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <Line data={this.state.radioSelected.join === 0 ? this.state.data.join : this.state.copy_data.join} options={options} />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              أحصائيات الخروج
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <ButtonToolbar className="justify-content-center" aria-label="Toolbar with button groups">
                  <ButtonGroup className="mr-1" aria-label="First group">
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(7,'out')} active={this.state.radioSelected.out === 7}>Week</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(30,'out')} active={this.state.radioSelected.out === 30}>Month</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(365,'out')} active={this.state.radioSelected.out === 365}>Year</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(0,'out')} active={this.state.radioSelected.out === 0}>All</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <Line data={this.state.radioSelected.out === 0 ? this.state.data.out : this.state.copy_data.out} options={options} />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              أحصائيات الباند
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <ButtonToolbar className="justify-content-center" aria-label="Toolbar with button groups">
                  <ButtonGroup className="mr-1" aria-label="First group">
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(7,'ban')} active={this.state.radioSelected.ban === 7}>Week</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(30,'ban')} active={this.state.radioSelected.ban === 30}>Month</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(365,'ban')} active={this.state.radioSelected.ban === 365}>Year</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(0,'ban')} active={this.state.radioSelected.ban === 0}>All</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <Line data={this.state.radioSelected.ban === 0 ? this.state.data.ban : this.state.copy_data.ban} options={options} />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              أحصائيات الطرد
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <ButtonToolbar className="justify-content-center" aria-label="Toolbar with button groups">
                  <ButtonGroup className="mr-1" aria-label="First group">
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(7,'kick')} active={this.state.radioSelected.kick === 7}>Week</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(30,'kick')} active={this.state.radioSelected.kick === 30}>Month</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(365,'kick')} active={this.state.radioSelected.kick === 365}>Year</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(0,'kick')} active={this.state.radioSelected.kick === 0}>All</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <Line data={this.state.radioSelected.kick === 0 ? this.state.data.kick : this.state.copy_data.kick} options={options} />
              </div>
            </CardBody>
          </Card>
        </CardColumns>
      </div>
      </CSSTransitionGroup>
    );
  }
}

export default Charts;
