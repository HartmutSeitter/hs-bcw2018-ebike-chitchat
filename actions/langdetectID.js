/**
  *
  * Format and send request to Watson Discovery service if marked as necessary.
  *
  * @param {object} params - the parameters.
  * @param {string} params.username - default parameter, must be set. The username for Discovery service.
  * @param {string} params.password - default parameter, must be set. The password for Discovery service.
  * @param {string} params.environment_id - default parameter, must be set. The environment_id for Discovery service.
  * @param {string} params.collection_id - default parameter, must be set. The collection_id for Discovery service
  * @param {string} params.input - input text to be sent to Discovery service.
  * @param {string} params.output - the output of the Conversation service results
  *
  * @return {object} the JSON of Discovery's response, or the original JSON if discovery was not called.
  *
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
         var parameters = {
                     text: params.input.text
            }
        
            languageTranslator.identify(
                parameters,
                function(error, response) {
                if (error) {
                    console.log("error =", error)
                    recject(error);
                }
                else {
                   console.log("back from lang id");   
                    console.log(JSON.stringify(response, null, 2));
                }
                if (response.languages[0].confidence > 0.7) {
                   responseJson.input.language_detected = response.languages[0].language;
                   responseJson.input.language_detected_conf = response.languages[0].confidence;
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
            delete responseJson.username;
            delete responseJson.password;
            delete responseJson.url;
            resolve(responseJson) 
        }
        
        
    });
    return promise;
    //} else {
    //    return params;
    //}
 
 }
 
 module.exports.main = main;