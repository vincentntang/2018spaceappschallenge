function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

//------------------------------------------------

function NasaImageAndVideo(input){
    const url = "https://images-api.nasa.gov/search?q=" + input;

    var items = JSON.parse(httpGet(url));
    items = items["collection"]["items"];

    for (var i = 0; i < items.length; i++) {
        items[i] = new DataNasa(items[i]);
    }

    return items;

    function DataNasa(input){
        var data = input["data"][0];
    
        this.keywords = data["keywords"];
        this.title = data["title"];
        this.description = data["description"];
        this.center = data["center"];
        this.media_type = data["media_type"];
        this.multimedia_url = input["href"];
    
        this.picture_ready = false;
    
        this.get_picture = () => {
            if(!this.picture_ready){
                var multimedia = JSON.parse(httpGet(this.multimedia_url));
                this.multimedia_url = multimedia[0];
                this.picture_ready = true;
                return this.multimedia_url;
            }
        }
    }
}

