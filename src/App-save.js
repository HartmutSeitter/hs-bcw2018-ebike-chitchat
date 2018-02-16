// hs
import React, { Component } from 'react'
import './App.css'
import 'react-chat-elements/dist/main.css';
import {MessageBox} from 'react-chat-elements';
import {MessageList} from 'react-chat-elements'
import axios from 'axios'
var todos = [{
        todoTitle: "my first to do",
        todoResponisbility: "hartmut",
        todoDescription: "my first to do",
        todoProiority: "low"
    },
    {
        todoTitle: "my 2nd to do",
        todoResponisbility: "hartmut",
        todoDescription: "my 2nd to do",
        todoProiority: "medium"
    },
    {
        todoTitle: "my 3rd to do",
        todoResponisbility: "hartmut",
        todoDescription: "my 3rd to do",
        todoProiority: "high"
    }
]

class App extends Component {
  constructor () {
    super()
    this.state = {
      username: '',
      hugo: '123'
    }

    this.handleClick = this.handleClick.bind(this)
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
        <button className='button' onClick={this.handleClick}>Click Me</button>
        <p>{this.state.username}</p>
        <p>{this.state.hugo}</p>


        
      
        <MessageList
          className='message-list'
          lockable={true}
          toBottomHeight={'100%'}
          dataSource={[
              {
                  position: 'right',
                  type: 'text',
                  text: 'Hallo Hartmut',
                  date: new Date(),
              },
              {
                position: 'left',
                type: 'text',
                text: 'Hallo Markus',
                date: new Date()
              }
          ]} 
        /> 
        <div className="form-group">
          <button type="submit" className="btn btn-success">Add Todo</button>
        </div>
      </div>

    );
  }
}

export default App
