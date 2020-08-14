const express = require("express");
const http = require('http');
const bodyParser = require('body-parser');
const routes = require('./routes');
const helper = require('./helper');
var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();
class Server {

    constructor() {
        this.port = process.env.PORT || 3000;
        this.host = `localhost`;
        this.app = express();
        // this.app.use(multipart());       // to support JSON-encoded bodies
        this.app.use(bodyParser.json() );       // to support JSON-encoded bodies
        this.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
            extended: true
        })); 
        this.http = http.Server(this.app);
    }

    appConfig() {
        // this.app.use(
        //     bodyParser.json()
        // );
    }

    /* Including app Routes starts*/
    includeRoutes() {
        new routes(this.app).routesConfig();
    }
    /* Including app Routes ends*/

    appExecute() {
        this.appConfig();
        this.includeRoutes();
        this.http.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });
		
    }

}


const app = new Server();
app.appExecute();