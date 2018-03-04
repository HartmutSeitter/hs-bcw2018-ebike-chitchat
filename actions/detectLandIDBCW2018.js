/**
  *
  Detect the language from the input string entered by the client application
    when workcount is less than 3, then don't change language
    only change language_detected when Id = de or en -- these are the only languages supported by workspaces in 
    discovery and conversations
*/
 const assert = require('assert');
 //var watson = require('watson-developer-cloud/language-translator/v2');
 var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');
 function main(params) {
  
    assert(params, 'params cannot be null');
      //Make Discovery request only if Conversation output includes a "call discovery" property
    //if(params.output.hasOwnProperty('action') && params.output.action.hasOwnProperty('call_langdetectId')) {
       
    return new Promise(function (resolve, reject) {
        var languageTranslator = new LanguageTranslatorV2({
           username: params.username,
           password: params.password,
           url: params.url,
           version: 'v2'
        });
        console.log("inputparameter",params);
        let responseJson = params;
        //
        // try to detect language only if more than 4 words are in the input string
        //
        var count = 0;
        words = params.input.text.split(" "); 
        for (i=0 ; i < words.length ; i++){
            // inner loop -- do the count
            if (words[i] != "")
                count += 1; 
        }
        if (count > 3) {
            var parameters = {text: params.input.text}
        
            languageTranslator.identify(
                parameters,
                function(error, response) {
                    if (error) {
                       console.log("error =", error)
                       recject(error);
                    } else {
                    console.log("back from lang id");   
                    console.log(JSON.stringify(response, null, 2));
                }
                if (response.languages[0].confidence > 0.7) {
                   if (response.languages[0].language=='de' || response.languages[0].language =='en') { 
                        responseJson.input.language_detected = response.languages[0].language;
                        responseJson.input.language_detected_conf = response.languages[0].confidence;
                   }
                } else {
                     responseJson.input.language_detected = "en";
                     responseJson.input.language_detected_conf = 1.0;
                }
                delete responseJson.username;
                delete responseJson.password;
                delete responseJson.url;
                resolve(responseJson);
            });
        } else {
            responseJson.input.language_detected = "en";
            responseJson.input.language_detected_conf = 1.0;
            delete responseJson.username;
            delete responseJson.password;
            delete responseJson.url;
            return resolve(responseJson) 
        }
        
        
    });
    return promise;
    //} else {
    //    return params;
    //}
 
 }
 
 module.exports.main = main;
