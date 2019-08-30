
const app = require('express')();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const twilio = require('twilio');
//const VoiceResponse = require('twilio').twiml.VoiceResponse;
const MessagingResponse = require('twilio').twiml.MessagingResponse;
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/price/", async (req,res) => {
    getPrice().then(price => res.end(`<HTML><BODY><H1>${price}</H1></BODY></HTML>`))
});
let getPrice =  () =>  {
    let url = `https://api.coinbase.com/v2/prices/spot?currency=USD`;
    let headers =  { 'Content-Type': 'application/json'};
    return fetch(url,{headers:headers})
    .then(res => res.json())
    .then(json => `1 BTC = $${json.data.amount.toLocaleString()}USD`);
}

app.post('/message', twilio.webhook(), (req, res) => {
    // Twilio Messaging URL - receives incoming messages from Twilio
    const response = new MessagingResponse();
    const text = req.body.Body;
    const phone = req.body.From;
    console.log("Receive the following string: "+ text +"from phone: "+phone);
    //console.dir(req.body);
    //let joke = getJoke(phone);

    getPrice().then(   
        price =>  {
            response.message(price);
            
              res.set('Content-Type', 'text/xml');
              res.end(response.toString());
        }
    )
  });

// setup the web server using EXPRESS... NEEDED for testing?
const http = require('http');
const port = 5000;
var server = http.createServer(app); // Start express
server.listen(port); // Point it to the port we defined above.
console.log("Started on port 5000;")