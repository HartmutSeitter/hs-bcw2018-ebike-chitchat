// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

var request = require('request');

/**
 * Get hourly weather forecast for a lat/long from the Weather API service.
 *
 * Must specify one of zipCode or latitude/longitude.
 *
 * @param username The Weather service API account username.
 * @param username The Weather service API account password.
 * @param latitude Latitude of coordinate to get forecast.
 * @param longitude Longitude of coordinate to get forecast.
 * @param zipCode ZIP code of desired forecast.
 * @return The hourly forecast for the lat/long.
 */
function main(params) {
    //console.log('input params:', params);
    var username = params.username;
    var password = params.password;
    var lat = params.latitude || '52.50190';
    var lon = params.longitude ||  '13.40868'; 
    var city = "Berlin";
    var language = params.language || 'en-US';
    var units = params.units || 'm';
    var timePeriod = params.timePeriod || '7day';
    var host = params.host || 'twcservice.mybluemix.net';
    var url = 'https://' + host + '/api/weather/v1/geocode/' + lat + '/' + lon;
    
    if(params.input.hasOwnProperty('language_detected')) {
      
        if (params.input.language_detected == 'de') {
                 language = 'de-DE';
        }
        if (params.input.language_detected == 'en') {
             language = 'en-US';
        }
          
    }
    var qs = {language: language, units: units};






    switch(timePeriod) {
        case '48hour':
            url += '/forecast/hourly/48hour.json';
            break;
        case 'current':
            url += '/observations.json';
            break;
        case 'timeseries':
            url += '/observations/timeseries.json';
            qs.hours = '23';
            break;
        default:
            url += '/forecast/daily/7day.json';
      
            break;
    }

    console.log('url:', url);
    
    if(params.output.hasOwnProperty('action') && params.output.action.hasOwnProperty('call_weather')) {
        if(params.output.hasOwnProperty('geoLocation')) {
            lat = params.output.geoLocation[0].latitute;
            lon =  params.output.geoLocation[0].longtitue;
            city = params.output.geoLocation[0].city;
            console.log("geoLocation",lat,lon);
        }
        
        
        
        var promise = new Promise(function(resolve, reject) {
            request({
                url: url,
                qs: qs,
                auth: {username: username, password: password},
                timeout: 30000
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var jbody = JSON.parse(body);
                    
                    
                    var weather_conditions = {};
                    var weather1 = jbody.forecasts[0].narrative;
                    for (var i = 0; i < jbody.forecasts.length; i++) {
                        var forecastDetail = jbody.forecasts[i];
                    
                        if (forecastDetail.hasOwnProperty('day')) {
                            weather_conditions[forecastDetail.dow] = {
                              day: {
                                temp: forecastDetail.day.temp,
                                pop: forecastDetail.day.pop,
                                uv_index: forecastDetail.day.uv_index,
                                narrative: forecastDetail.day.narrative,
                                phrase_12char: forecastDetail.day.phrase_12char,
                                phrase_22char: forecastDetail.day.phrase_22char,
                                phrase_32char: forecastDetail.day.phrase_32char
                              },
                              night: {
                                temp: forecastDetail.night.temp,
                                pop: forecastDetail.night.pop,
                                uv_index: forecastDetail.night.uv_index,
                                narrative: forecastDetail.night.narrative,
                                phrase_12char: forecastDetail.night.phrase_12char,
                                phrase_22char: forecastDetail.night.phrase_22char,
                                phrase_32char: forecastDetail.night.phrase_32char
                              }
                            };
                        } else {
                            weather_conditions[forecastDetail.dow] = {
                              night: {
                                temp: forecastDetail.night.temp,
                                pop: forecastDetail.night.pop,
                                uv_index: forecastDetail.night.uv_index,
                                narrative: forecastDetail.night.narrative,
                                phrase_12char: forecastDetail.night.phrase_12char,
                                phrase_22char: forecastDetail.night.phrase_22char,
                                phrase_32char: forecastDetail.night.phrase_32char
                              }
                            };
                         }
                    }
                        
                    var weatherResults = [];
                    if (language == 'de-DE') {
            
                            weatherResults[0] = {
                            day: "Montag in " + city + '  lat= ' + lat + '  lon' + lon,
                            weather: weather_conditions.Montag.day.narrative
                        };
                        weatherResults[1] = {
                            day: "Dienstag in " + city,
                            weather: weather_conditions.Dienstag.day.narrative
                        };
                        weatherResults[2] = {
                            day: "Mittwoch in " + city,
                            weather: weather_conditions.Mittwoch.day.narrative
                        };
                        weatherResults[3] = {
                            day: "Donnerstag in " + city,
                            weather: weather_conditions.Donnerstag.day.narrative
                        };
                        weatherResults[4] = {
                            day: "Freitag in " + city,
                            weather: weather_conditions.Freitag.day.narrative
                        };
                        weatherResults[5] = {
                            day: "Samstag in " + city,
                            weather: weather_conditions.Samstag.day.narrative
                        };
                        weatherResults[6] = {
                            day: "Sonntag in " + city,
                            weather: weather_conditions.Sonntag.day.narrative
                        };
                    }
                    if (language == 'en-US') {
                      
                            weatherResults[0] = {
                            day: "Monday in " + city,
                            weather: weather_conditions.Monday.day.narrative
                        };
                        weatherResults[1] = {
                            day: "Tuesday in " + city,
                            weather: weather_conditions.Tuesday.day.narrative
                        };
                        weatherResults[2] = {
                            day: "Wednesday in " + city,
                            weather: weather_conditions.Wednesday.day.narrative
                        };
                        weatherResults[3] = {
                            day: "Thursday in " + city,
                            weather: weather_conditions.Thursday.day.narrative
                        };
                        weatherResults[4] = {
                            day: "Friday in " + city,
                            weather: weather_conditions.Friday.day.narrative
                        };
                        weatherResults[5] = {
                            day: "Saturday in " + city,
                            weather: weather_conditions.Saturday.day.narrative
                        };
                        weatherResults[6] = {
                            day: "Sunday in " + city,
                            weather: weather_conditions.Sunday.day.narrative
                        };
                    }
                
                    params.output.WeatherResults = weatherResults;
                    params.output.WeatherConditions = weather_conditions;
                    let returnJson = params;
                    delete returnJson.username;
                    delete returnJson.url;
                    delete returnJson.password;
                    delete returnJson.port;
                    resolve(returnJson);
                    
                } else {
                    console.log('error getting forecast');
                    console.log('http status code:', (response || {}).statusCode);
                    console.log('error:', error);
                    console.log('body:', body);
                    reject({
                        error: error,
                        response: response,
                        body: body
                    });
                }
            });
        });
        
        return promise;
    } else {
        delete params.username
        delete params.password;
        delete params.url;
        delete params.port;
        return params;
    }
}

