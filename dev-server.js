/**
 * dev-server - serves static resources for developing "earth" locally
 */

"use strict";

console.log("============================================================");
console.log(new Date().toISOString() + " - Starting");

var util = require("util");

/**
 * Returns true if the response should be compressed.
 */
function compressionFilter(req, res) {
    return (/json|text|javascript|font/).test(res.getHeader('Content-Type'));
}

/**
 * Adds headers to a response to enable caching.
 */
function cacheControl() {
    return function(req, res, next) {
        res.setHeader("Cache-Control", "public, max-age=300");
        return next();
    };
}

function logger() {
    express.logger.token("date", function() {
        return new Date().toISOString();
    });
    express.logger.token("response-all", function(req, res) {
        return (res._header ? res._header : "").trim();
    });
    express.logger.token("request-all", function(req, res) {
        return util.inspect(req.headers);
    });
    return express.logger(
        ':date - info: :remote-addr :req[cf-connecting-ip] :req[cf-ipcountry] :method :url HTTP/:http-version ' +
        '":user-agent" :referrer :req[cf-ray] :req[accept-encoding]\\n:request-all\\n\\n:response-all\\n');
}

var port = process.argv[2];
var express = require("express");
var app = express();
var request = require("request");

//Cause crashes
app.use(cacheControl());
//app.use(express.compress({filter: compressionFilter}));
app.use(logger());
app.use(express.static("public"));


app.get('/api/NASA/:place', function (req, res){
    var place = req.params.place;
    var url = "https://images-api.nasa.gov/search?q=" + place;
    request(url, function (error, response, body){
        //Request error
        if (error) {
            res.json({"Error":"There has been some problems with NASA's servers"});
        }
        //Request success
        else {
            var items = JSON.parse(body)["collection"]["items"];
            var readyToSend = [];
            var ready = 0;

            for (var i = 0; i < items.length; i++) {
                var item = new DataNasa(items[i]);

                request(item.multimedia_url, function (error, response, body){
                    //Error while trying to pull image
                    if(error) {
                        ready += 1
                    }
                    //Request success
                    else {
                        item.multimedia_url = JSON.parse(body)[0];

                        ready += 1;

                        readyToSend.push(item);
                    }
                    //Do anyways
                    if(ready==items.length-1){
                        res.json(readyToSend);
                    }
                });
            }
        }
    });

    class DataNasa {
        constructor(input) {
            var data = input["data"][0];
            this.keywords = data["keywords"];
            this.title = data["title"];
            this.description = data["description"];
            this.center = data["center"];
            this.media_type = data["media_type"];
            this.multimedia_url = input["href"];
        }
    }
});

app.get('/api/basic', function(req, res){
    var latitude = +req.query.lat;
    var longitude = +req.query.lon;

    //I have to cache the information
    const options = {
        url: "https://nominatim.openstreetmap.org/reverse?format=json&lat="+latitude+"&lon="+longitude+"&zoom=1&addressdetails=1&accept-language=en",
        headers: {
            'User-Agent': 'Orbis Pictus'
        }
    }

    //Nominatim API wikipedia
    //https://wiki.openstreetmap.org/wiki/Nominatim#Reverse_Geocoding
    request(options, function(error, response, body){
        //Request errors
        if(error){
            res.json({
                "Error": "Something has happend to Nominatim API"
            });
        }

        //No errors
        else {
            var content = JSON.parse(body);
            //User hits land
            console.log(content);
            if(content.hasOwnProperty("address")) {
                res.json({
                    "Country": content["address"]["country"]
                });
            }
            //User hits ocean
            else {
                res.json({
                    "Error": "The user has clicked on water"
                });
            }
        }
        


        /*
        if(content.hasOwnProperty("address")){
            request("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles="+content.address.country, function(error, response, body){
                res.send(body);
            });
        }*/
    });
});


app.listen(port);
console.log("Listening on port " + port + "...");