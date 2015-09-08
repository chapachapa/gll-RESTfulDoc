var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/RESTDoc');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('MONGOOSE IS READY :D');
});

var RESTEndPointSchema = mongoose.Schema({
    endpoint: String,
    input: String,
    output: String,
    actions: [String]
});
var RESTEndPoint = mongoose.model('RESTEndPoint', RESTEndPointSchema);

var mongoCache = {};
function requestSearch(endpointName){
    RESTEndPoint.find({endpoint:endpointName.toLowerCase()}, function(err, mongoData){
        if(!err){
            mongoCache[endpointName] = mongoData;
            console.log('search is a success!', mongoCache);
        }
    });
}

function fetchSearch(endpointName){
    var res = {};
    if(typeof mongoCache[endpointName] !== 'undefined'){
        res.data = mongoCache[endpointName];
    }
    return res;
}

function setData(rawData){
    var data = JSON.parse(rawData);
    data.endpoint = data.endpoint.toLowerCase();
    RESTEndPoint.find({endpoint:data.endpoint}, function(err, mongoData){
        if(err){
            console.log('data retrieval failed');
        }else {
            if(mongoData.length >= 1){
                mongoData[0].endpoint = data.endpoint;
                mongoData[0].input = data.input;
                mongoData[0].output = data.output;
                mongoData[0].actions = data.actions;
                mongoData[0].save();
            } else {            // assume there are no duplicates
                var RESTData = new RESTEndPoint({
                    endpoint: data.endpoint,
                    input: data.input,
                    output: data.output,
                    actions: data.actions
                });
                console.log(data);
                RESTData.save();
            }
        }
    });
    //console.log(RESTEndPoint.find({endpoint:'/test/Charles/test'}));
    //console.log(RESTEndPoint.find({endpoint:'/test/Charles/test2'}));
}


module.exports = {
    setData: setData,
    fetchSearch: fetchSearch,
    requestSearch: requestSearch
};