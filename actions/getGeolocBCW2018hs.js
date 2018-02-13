/**
 * Calls the Weather API and returns the Geolocation for a given city.
 * @param {Object} params The parameters
 * @param {Object} params.conversation.city The conversation city parameter, if null this action doesn't do anything.
 * @param {String} params.conversation.city.name The city name.
 */
const assert = require('assert');

function main(params) {
  return new Promise(function(resolve, reject) {
    assert(params, 'params can not be null');
    assert(params.username, 'params.username can not be null');
    assert(params.password, 'params.password can not be null');
    //assert(params.conversation.context, 'params.conversation.context can not be null');
    //assert(params.conversation.context.city, 'params.conversation.context.city can not be null');

    console.log("getLocation called hartnmut");
    
    if(params.entities.length>0) {
      if(params.output.hasOwnProperty('action') && 
         params.output.action.hasOwnProperty('call_weather') &&
         params.entities[0].hasOwnProperty('value') && 
         params.entities[0].hasOwnProperty('entity')) {
        
        
        const request = require('request');
        const method = '/v3/location/search';
        const url = 'https://twcservice.mybluemix.net/api/weather' || params.url;

        request({
          method: 'GET',
          url: url + method,
          auth: {
            username: params.username,
            password: params.password,
            sendImmediately: true
          },
          jar: true,
          json: true,
          qs: {
            //query: params.conversation.context.city.name,
            query: params.entities[0].value,
            locationType: 'city',
            countryCode: 'DE',
            language: 'de-DE'
          }
        }, function(error, response, body) {
          var latitudes = body.location.latitude;
          var longitudes = body.location.longitude;
          var abbrList = body.location.adminDistrictCode;
          var statesList = body.location.adminDistrict;
          // map the latitude and longitude values to each other
          var coordinates = latitudes.map((x, i) => {
            return {'latitude': x, 'longitude': longitudes[i]};
          });

          var states = {};
          var abbreviations = {};

          statesList.forEach(function(state, i) {
            states[state] = {
              longitude: coordinates[i].longitude,
              latitude: coordinates[i].latitude
            };
          });

          abbrList.forEach(function(abbr, i) {
            abbreviations[abbr] = {
              full: statesList[i]
            };
          });


          if (error || response.statusCode != 200) {
            reject(error);
          } else {
              var geoLocation = [];
              geoLocation[0] = {
                  "longtitue": longitudes,
                  "latitute" : latitudes
              }
              params.output.geoLocation = geoLocation;
              let returnJson = params;
              delete returnJson.username;
              delete returnJson.url;
              delete returnJson.password;
              delete returnJson.host;

              console.log(returnJson);
              resolve(returnJson);
          }
        });
      } else {
          let returnJson = params;
           delete returnJson.url;
           delete returnJson.password;
           delete returnJson.username;
           delete returnJson.host;
          resolve(returnJson);
      }
    } else {
      let returnJson = params;
      delete returnJson.url;
      delete returnJson.password;
      delete returnJson.username;
      delete returnJson.hos  
      resolve(returnJson);
    }
  });
}
module.exports.main = main;
