# ChitChat Bot for BCW2018 - ebike info - extending conversation with other Watson servies

As an addition to this project a related application was developed to show preformance data of the ChitChat app.
(hs-bcw2018-chitchat-dashboard)
In the hs-bcw2018-ebike-chitchat a chitchat conversation bot is implemented and some dialog traces a saved in a cloudant database to analyse the performance of the chitchat application.

The hs-bcw2018 chitchat is based on the React App and for more info see[Create React App](https://github.com/facebookincubator/create-react-app).

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://git.ng.bluemix.net/idsorg/sample-java-cloudant)


## Dependencies 
This application uses:
1. IBM Cloud Functions (openwhisk) to invoke the Watson Services
2. IBM Watson Language Translation service
3. IBM Watson Conversation Service
4. IBM Watson Discovery Service
5. IBM Watson Weather Channel
6. IBM Cloudant Database Service

##The following IBM Cloud Functions are neccessary to run the application

1. A web endpoint which can be invoked from the React application to start the Function sequence
2. The Function sequence to invoke the individual Function actions
3. detectLandIDBCW2018 to detect the languageID of the input data
4. conversation the handle the user dialog
5. discovery to access the discovery service to retrieve documents which match the search string
6. translateBCW2018hs translate some of the conversation answers to another language
7. getGeolocBCW2018hs to invoke the Weather service to retrieve geoLoc Data of a given City
8. getWeatherBCW2018hs to get weather forcast data depending on geoLoc info
9. cloudant-add to save the JSON message of the sequence for performance analysis.

You can copy the code of the Functions from the actions directory Parameters of the action definitions!!

##Setup

1. Create a service instance of Watson Conversation
2. Create Conversation Service Workspace for German Language and English Language (load the workspace files in the conversation-ws subdirctory )
3. Create a service instance of Waston Discovery service
  4. Create a collection for german language and load the 'german' documents of the manuals subdirectory
  5. Create a collection for english language and load the 'german' documents of the manuals subdirectory
6. Create a service instance of the Watson Language Translation Service
7. Create a service instance of the Weather Channel Service
8. Create a service instance of a Cloudant Database

9. Put the credential info of all services into the 

## Setup to run it localy
1. Copy the repository data to a local directory
2. execute 'npm install'
3. execute 'npm build run'
4. execute 'npm start

5. insert the correct api endpint in App.js to invoke the IBM Cloud Function sequence frpm the react app.

## Setup to run the app in IBM Cloud

1. Create a new toolchain in IBM Cloud using DevOps in on the IBM cloud dashboard -- Develop a cloud foundry app
2. Specify a unique name and select create
3. Configure Git Repos -- select Repository type: Clone
4. Check that the Source Repository URL points to the correct Git-Repository
5. Configure the Deliver Pipeline steps (Build and Deliver)
6. In the Build Stage select NPM as Builder type and use the following build script 
```
#Set up required version of Node and NPM
export NVM_DIR=/home/pipeline/nvm
export NODE_VERSION=7.0.0
export NVM_VERSION=0.33.0

npm config delete prefix \
  && curl https://raw.githubusercontent.com/creationix/nvm/v${NVM_VERSION}/install.sh | sh \
  && . $NVM_DIR/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default \
  && node -v \
  && npm -v

#Install & build
npm install && npm install watson-react-components && npm run build
```
7. Set Build archive directory to build

8. In the Deploy stage specfie the deploy config appropriate and use the following Deploy Script
```
#!/bin/bash
# Push app
if ! cf app $CF_APP; then  
  cf push $CF_APP -b https://github.com/cloudfoundry-community/staticfile-buildpack.git 
else
  OLD_CF_APP=${CF_APP}-OLD-$(date +"%s")
  rollback() {
    set +e  
    if cf app $OLD_CF_APP; then
      cf logs $CF_APP --recent
      cf delete $CF_APP -f
      cf rename $OLD_CF_APP $CF_APP
    fi
    exit 1
  }
  set -e
  trap rollback ERR
  cf rename $CF_APP $OLD_CF_APP
  cf push $CF_APP -b https://github.com/cloudfoundry-community/staticfile-buildpack.git 
  cf delete $OLD_CF_APP -f
fi
# Export app name and URL for use in later Pipeline jobs
export CF_APP_NAME="$CF_APP"
export APP_URL=http://$(cf app $CF_APP_NAME | grep urls: | awk '{print $2}')
```
#Run the Build and Deploy Process and the app should be deployed to the IBM Cloud env. you specified in the Deploy Config
