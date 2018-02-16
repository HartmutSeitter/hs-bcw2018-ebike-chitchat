import React from 'react';
import './Conversation.css';
import { InputWithButton } from 'watson-react-components';
//import { InputWithButton } from  'watson-react-components/dist/components';
import Message from './Message.js';

function Conversation(props) {
  console.log("conversation.js - props=",  props);
  function makeMessage(msgObj, index) {
        
    if( typeof msgObj.message === 'string') {
      return(
        <Message key={index} position={msgObj.position || false} label={msgObj.label || false} 
                            date={msgObj.date || false} 
                            message={msgObj.message} 
                            hsmessage1={msgObj.hsmessage1 || false} 
                            hshtmllink={msgObj.hshtmllink || false}  
                            hslinktext={msgObj.hslinktext || false}  
                            hasTail={msgObj.hasTail || false}/>
      );
    } else if( React.isValidElement(msgObj.message)) {
      return( msgObj.message );
    } else {
      return false;
    }
  }
  
  return(
    <div className="conversation">
      <div className="conversation__messages">
        <div>
          {props.messageObjectList.map(makeMessage)}
        </div>
      </div>
      <div className="conversation__input-container">
        <InputWithButton className="conversation__input" onSubmit={props.onSubmit} placeholder="Du kannst mir eine Frage stellen."/>
      </div>
    </div>
  );
}

export default Conversation;
