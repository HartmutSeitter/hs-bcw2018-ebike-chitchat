import React, { Component } from 'react'
import './App.css'
import 'react-chat-elements/dist/main.css';
import Conversation from './Conversation.js';
import DiscoveryResult from './DiscoveryResult.js';
import WeatherResult from './WeatherResults.js';
import axios from 'axios'
class App extends Component {
  constructor () {
    super()
    this.state = {
      username: '',
      //hugo: '123',
      context: {},
      // A Message Object consists of a message[, intent, date, isUser]
      messageObjectList: [],
      discoveryNumber: 0
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  callWatson(message) {
    //const watsonApiUrl = process.env.REACT_APP_API_URL;
    const watsonApiUrl = "https://openwhisk.ng.bluemix.net/api/v1/web/seitter_org_dev/conversation-with-discovery-openwhisk/conversation-with-discovery-sequence.json"
    const requestJson = JSON.stringify({
      input: {
        text: message
      },
      context: this.state.context
    });
    console.log("requestJson = ", requestJson);
    return fetch(watsonApiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestJson
      }
    ).then((response) => {
      if(!response.ok) {
        throw response;
      }
      return(response.json());
    })
      .then((responseJson) => {
        responseJson.date = new Date();
        console.log("responseJson =");
        if (typeof responseJson === "undefined") {
          console.log("response = undefined");
        } else {
          console.log(responseJson);
          this.handleResponse(responseJson);  
        }
        }).catch(function(error) {
        console.log("error");
        throw error;
      });
  }
  handleResponse(responseJson) {
    if(responseJson.hasOwnProperty('output') 
                  && responseJson.output.hasOwnProperty('action') 
                  && responseJson.output.action.hasOwnProperty('call_discovery')) {
      this.addMessage( { label: 'Discovery Ergebnis:', message: 'Sehr gute Frage. Das habe ich gefunden:', date: (new Date()).toLocaleTimeString()});
      this.formatDiscovery(responseJson.output.discoveryResults);
    } else if (responseJson.hasOwnProperty('output') 
                  && responseJson.output.hasOwnProperty('action') 
                  && responseJson.output.action.hasOwnProperty('call_weather')) {
      this.addMessage( { label: 'Weather Ergebnis:', message: 'Folgende Wetterdaten habe ich gefunden:', date: (new Date()).toLocaleTimeString()});
      this.formatWeather(responseJson.output.WeatherResults);
    
              
    } else {
      console.log("handleRespone = ",responseJson);
      let outputMessage = responseJson.output.text.filter(text => text).join('\n');
      outputMessage = outputMessage.split('<br/>').join('\n');
      console.log("outputMessage type", outputMessage);
      const outputIntent = responseJson.intents[0] ? responseJson.intents[0]['intent'] : '';
      const outputDate = responseJson.date.toLocaleTimeString();
      const outputContext = responseJson.context;
      this.setState({
        context: outputContext
      });
      const msgObj = {
        position: 'left',
        label: outputIntent,
        message: outputMessage,
        date: outputDate,
        hasTail: true
      };
      console.log("msgObj=",msgObj)
      this.addMessage(msgObj);
    }
  }
  
  addMessage(msgObj) {
    //console.log("addMessage msgObj = ", msgObj);
    this.setState({
      messageObjectList: [ ...this.state.messageObjectList , msgObj]
      //messageObjectList: [ ...this.state.messageObjectList , hsmsg]
    
    });
  }
  
  handleSubmit(e) {
    const inputMessage = e.target.value;
    const inputDate = new Date();
    const formattedDate = inputDate.toLocaleTimeString();
    const msgObj = {
      position: 'right',
      message: inputMessage,
      date: formattedDate,
      hasTail: true
    };
    //console.log(msgObj);
    //console.log(process.env);
    this.addMessage(msgObj);
    e.target.value = '';
    this.callWatson(inputMessage);
  }
  
  formatDiscovery(resultArr) {
    resultArr.map(function(result, index) {
      const formattedResult = <DiscoveryResult key={'d' + this.state.discoveryNumber + index} 
                                                        title={result.title} 
                                                        preview={result.bodySnippet} 
                                                        link={result.sourceUrl} 
                                                        linkText={'See full manual entry'} />;
      this.addMessage({ message: formattedResult });
    }.bind(this));
        
    this.setState({
      discoveryNumber: this.state.discoveryNumber + 1
    });
    return(true);
  }

  formatWeather(resultArr) {
    resultArr.map(function(result, index) {
      const formattedResult = <WeatherResult key={'d' + this.state.discoveryNumber + index} 
                               day={result.day} 
                               weather={result.weather}
                               linkText={'Das sind die Wetterdaten'} />;
      //console.log("formatWeather =", result.body);
      this.addMessage({ message: formattedResult });
    }.bind(this));
        
    this.setState({
      discoveryNumber: this.state.discoveryNumber + 1
    });
    return(true);
  }



  handleClick () {
    axios.post('https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/d21d08ef7a8fdb0ae4716bd18586fa968d8111326ce83e0cd93b73c0e2503e46/text-bot-openwhisk/conversation1',
               {"conversation": {"input": {"text": "how about new york"}}}
              )
      .then(response => this.setState(
        //console.log(response);
                            {username: response.data.conversation.output.text[0],
                             hugo: response.data.conversation.output.text[1]}))
  }
  handleAddTodo(todo) {
    this.setState({todos: [...this.state.todos, todo]});
  }
  
  render () {
    return (
      <div className='button__container'>      
        <p className='conversation__intro'>
            This demo shows how the Conversation
            service calls the Discovery service <br/><br/>when it does not know how to respond. <br/><br/>The calls to Conversation and Discovery are made in Functions, IBM's serverless platform.
            <br/>     <br/>
            visit <a href="https://console.bluemix.net/openwhisk/" target='_blank'>IBM Cloud Functions</a> now!
            <br/>
            visit <a href="hhttps://www.ibm.com/watson/services/conversation/" target='_blank'>IBM Converstions</a> now!
            <br/>
            visit <a href="hhttps://www.ibm.com/watson/services/discovery/" target='_blank'>IBM Discovery</a> now!
            <br/>
            visit <a href="https://console.bluemix.net/docs/services/Weather/weather_overview.html#about_weather"target='_blank'>IBM Weather Channel</a> now!
        </p>
        <Conversation
          onSubmit={this.handleSubmit}
          messageObjectList={this.state.messageObjectList}
        />
      </div>

    );
  }
}

export default App
