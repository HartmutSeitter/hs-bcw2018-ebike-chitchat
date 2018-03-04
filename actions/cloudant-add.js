var moment = require('moment');
function main(params) {
    if (params._rev !== null) {
        var output = Object.assign({}, { conversation: params.conversation }, { _id: params._id }, { _rev: params._rev });
        //return output;  // xxxhs commented out
    } else if (!params._id || !params.id) {
        Promise.reject(new Error('id cannot be null'));
    }

    //load the package
    const Cloudant = require('cloudant');
    const username = params.CLOUDANT_USERNAME;
    const password = params.CLOUDANT_PASSWORD;
    var dbname = 'owtextbotdb';
    var owdb = null;
    //connect to Cloudant
    const cloudant = Cloudant({
        account: username,
        password: password
    });

    try {
        owdb = cloudant.db.create(dbname);
        if (owdb != null) {
            owdb = cloudant.db.use(dbname);
        }
    } catch (e) {
        owdb = cloudant.db.use(dbname);
    }

    return new Promise(function(resolve, reject) {
        var now = moment();
        var nowformatted = now.format('YYYY-MM-DD-HH:mm:ss:SSS');
        var now
        console.log(nowformatted);
        let cloudantJson = params;
        
        delete cloudantJson.CLOUDANT_USERNAME;
        delete cloudantJson.CLOUDANT_PASSWORD;
        delete cloudantJson.CLOUDANT_URL;
        cloudantJson.date = nowformatted;
        owdb.insert(cloudantJson, params._id, function(err, body) {
            if (err) {
                return reject(err);
            }
            var output = Object.assign({}, { conversation: params.conversation }, { _id: params._id }, { _rev: body.rev });
            let returnJson = params;
            delete returnJson.CLOUDANT_USERNAME;
            delete returnJson.CLOUDANT_PASSWORD;
            delete returnJson.CLOUDANT_URL;
            return resolve(returnJson);
        });
    });
}

module.exports.main = main;