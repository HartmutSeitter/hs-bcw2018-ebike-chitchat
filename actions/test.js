
var watson = require('watson-developer-cloud/language-translator/v2');

/**
 * Translate a string from one language to another.
 *
 * @param translateFrom The two digit code of the language to translate from.
 * @param translateTo The two digit code of the language to translate to.
 * @param translateParam The input parameter to translate. Defaults to 'payload'.
 * @param username The Watson service username.
 * @param password The Watson service password.
 * @return The translateParam parameter with all values translated, or error if
 * Watson service returns error
 */
function main(params) {
    //console.log('params:', params);

    var from = params.translateFrom || 'de';
    var to = params.translateTo || 'en';
    
    //var translateParam = params.translateParam || 'payload';
    //var translateParamIn = params.translateParam || 'payload';
      //var translateParam.payload = params.output.text;
    const username = params.username;
    const password = params.password;
     
    var url = params.url || 'https://gateway.watsonplatform.net/language-translator/api';
    var input = {text: "das ist ein test"};
    
    
    if(params.output.hasOwnProperty('action') && params.output.action.hasOwnProperty('call_langdetectId')) {
        //let requestJson = params;
   
        //input.payload = params.output.text;
        console.log("input=", input);
        var promise = new Promise(function(resolve, reject) {
            
            var translated = [];
            var language_translation = new watson({
                username: username,
                password: password,
                url: url
            });
            
            language_translation.identify(input, function (err, response) {
                if (err) 
                    console.log('error:', err);
            } else {
                
                console.log('response:', response);
                
            }
            return promise;
        });
    }
    return params;
}

