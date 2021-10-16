import React,{ Component } from 'react';
import {Row, Col, Card,h1,p,img} from "reactstrap";
import Flip from 'react-reveal/Flip';
import Zoom from 'react-reveal/Zoom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from "@fortawesome/free-brands-svg-icons"
import { generateCustomPlaceholderURL } from 'react-placeholder-image';




class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: '1',
    };
  }
  
  checkImageURL(ev,guild){
    ev.target.src = generateCustomPlaceholderURL(500, 500, {backgroundColor: '#262b2f',textColor: '#ffffff',text: guild.name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')});
  }

  render() { 

    if (!this.props.userapi){
      return (
      <div >
        <div className="Hero" style={{backgroundImage: `url(${require("./bg.png")})`, backgroundPosition: 'center',backgroundSize: 'cover',backgroundRepeat: 'no-repeat'}}>
          <div className="HeroInner">
            <h1> Future Bot</h1>
            <p style={{fontFamily: 'Blinker'}}> The Best bot for Server Management, Tracking The server statistics and Server Entertainment. </p>
            <div className="HeroButtons">
                <a  href="https://discordapp.com/oauth2/authorize?client_id=615277259879743491&scope=bot&permissions=8" role="button" className="btn btn-primary btn-lg grow mr-5" aria-pressed="true" style={{fontSize: "20px",fontFamily: 'Blinker'}}><FontAwesomeIcon  icon={faDiscord}  />  Add to Discord</a>
                <button type="button" onClick={() => this.messagesEnd.scrollIntoView({ behavior: "smooth" })} className="btn btn-primary btn-warning btn-lg grow ml-5" style={{fontSize: "20px",fontFamily: 'Blinker'}}>  See more features!  </button>
            </div>
          </div>
        </div>
        <section className="Section" style={{background:"#262b2f"}} ref={(el) => { this.messagesEnd = el; }}>
          <div className="SectionInner">
            <div className="SectionImg">
              <img src={require("../../assets/img/profile3.png")} alt="Profile"/>
            </div>

            <div className="SectionText">
              <h1>A fully upgraded profile & ranking system!</h1>
              <p>With the new Profile & ranking system. you can add your social media accounts to your profile. and you can also customize the XP properties for your own server and add ranks to it, and even more!  </p>
            </div>
          </div>
        </section>
        <section className="Section" style={{background:"#262b2f"}}>
          <div className="SectionInner">
            <div className="SectionImg" style={{flex: "42 1 0%"}}>
              <img src={require("../../assets/img/embed.png")} alt="EmbedCreator"/>
            </div>
            <div className="SectionText" style={{flex: "42 1 0%"}}>
              <h1>The Embed Creator</h1>
              <p>Take advantage of the embed creator to stylize your announcements, responding messages or ongoing events.</p>
            </div>
          </div>
        </section>
        <section className="Section" style={{background:"#262b2f"}}>
          <div className="SectionInner">
            <div className="SectionImg" style={{flex: "42 1 0%"}}>
              <img src={require("../../assets/img/colors.png")} alt="Colors"/>
            </div>
            <div className="SectionText" style={{flex: "42 1 0%"}}>
              <h1>Fully Customizable Color Roles!</h1>
              <p>You can use the colors system to add a colorful experince to your server members, And there is a variety of color templates you can choose from!</p>
            </div>
          </div>
        </section>
        <section className="Section" style={{background:"#262b2f"}}>
          <div className="SectionInner">
            <div className=" text-center" style={{flex: "42 1 0%"}}>
              <h1>AND EVEN MORE!</h1>
            </div>
          </div>
        </section>
      </div>
      )
    }
    return (
    <div className="app-body background flex-row align-items-center">
      <div className="container-fluid">
        <Zoom >
            <div className="container">
              <Row className="justify-content-center text-center p-2">
                {this.props.loading_guild ? null :
                <Col md={12} xs={12} className="serverlist" style={{position:"sticky"}}>
                  <h3 className="p-5">{this.props.language.titles.server_list}</h3>
                </Col>}
                  {this.props.loading_guild ? <div className="animated fadeIn pt-1 text-center"><div className="sk-folding sk-folding-cube"><div className="sk-cube1 sk-cube"></div><div className="sk-cube2 sk-cube"></div><div className="sk-cube4 sk-cube"></div><div className="sk-cube3 sk-cube"></div></div></div> : this.props.userapi['guilds'].map((guild,idx) => {
                    return (
                    <Col md={2} xs={6}>
                      <Zoom right key={idx}>
                        <Card className={guild.plus ? "card-accent-success m-2 box zoom-effect-container rounded-circle" : guild.turbo ? "card-accent-info m-2 box zoom-effect-container rounded-circle" : "m-2 box zoom-effect-container rounded-circle"} style={{ cursor: 'pointer' }} onClick={() => this.props.select_guild(guild)}>
                          <div className="image-card">
                            <img className="card-img" onError={(event) => this.checkImageURL(event,guild)} src={"https://cdn.discordapp.com/icons/"+guild.id+"/"+guild.icon+".jpg?size=1024"} alt={guild.id}/>
                          </div>
                          <div className="text-center card-guild card-img-overlay">
                            <Flip>
                            {guild.name.substring(0,13)} 
                            </Flip>
                          </div>
                        </Card>
                      </Zoom>
                    </Col>
                    );
                  })}
              </Row>
            </div>
          </Zoom>
        </div>
      </div>
    );
  }
}


export default Login;