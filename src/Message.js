import React from 'react';
import './Message.css';

function Message(props) {


  console.log("message.js - props=", props);
  return(
    <div className={props.position === 'right' ? 'message message--from-right' : 'message message--from-left'}>
      {props.label ? <div className="message__label">{props.label}</div> : false}
      
      <div className="message__content">  {props.message} </div>
     
      
      {props.hasTail ? (
        <div className="message__tail">
          <div className="message__tail-background"></div>
          <div className="message__tail-foreground"></div>
        </div>
      ) : false}
      {props.date ? <div className="message__date">{props.date}</div> : false}
      
      {props.hsmessage1 ? <div className="message__content1">  {props.hsmessage1} </div> :false}
      {props.hshtmllink ? <div className="result__link_text"><a href={props.hshtmllink} target="_blank">{props.hslinktext}</a></div> :false}
    
    </div>
  );

}

export default Message;