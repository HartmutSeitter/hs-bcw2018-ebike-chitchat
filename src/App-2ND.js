import React, { Component } from 'react'
import './App.css'
import 'react-chat-elements/dist/main.css';
import axios from 'axios'
import Conversation from './Conversation.js';
import DiscoveryResult from './DiscoveryResult.js';


class App extends Component {
  constructor () {
    super()
    this.state = {
      context: {},
      messageObjectList: [],
      displayNumber: 0,
      username: '',
      hugo: '123'
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  addMessage(msgObj) {
    this.setState({
      messageObjectList: [ ...this.state.messageObjectList , msgObj]
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
    console.log(msgObj);
    this.addMessage(msgObj);
    e.target.value = '';
    //this.callWatson(inputMessage);
  }
  render () {
    return (
      <div className='button__container'>
        <button className='button' onClick={this.handleClick}>Click Me</button>
        <p>{this.state.username}</p>
        <p>{this.state.hugo}</p>

    
        <div className="form-group">
          <button type="submit" className="btn btn-success">Add Todo</button>
          <p className="conversation__intro">
                    This demo shows how the Conversation service calls the Discovery service when it does not know how to respond. The calls to Conversation and Discovery are made in OpenWhisk, IBM's serverless platform.
        </p>
        <Conversation
          onSubmit={this.handleSubmit}
          messageObjectList={this.state.messageObjectList}
        />
        </div>
      </div>

    );
  }
}

export default App
