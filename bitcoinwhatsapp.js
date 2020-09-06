
const app = require('express')();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
var twilio = require('twilio');
var twilioSend = new twilio(accountSid, authToken);
//const VoiceResponse = require('twilio').twiml.VoiceResponse;
const MessagingResponse = twilio.twiml.MessagingResponse;
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/price/", async (req,res) => {
    getPrice().then(price => res.end(`<HTML><BODY><H1>${price}</H1></BODY></HTML>`))
});


// Twillio endpoint
app.get("/send",(req,res) => {

     getPrice("BTC").then(
        btcprice =>  {
                getPrice("BCH").then(
                bchprice =>  {
                        getPrice("BSV").then(
                                bsvprice =>  {
let messageText = `BTC:$${btcprice} BCH:$${bchprice} BSV:$${bsvprice}`;
twilioSend.messages
  .create({
     body: messageText,
     from: '+19542803239',
     to: '+15614060926'
   })   
  .then(message => console.log(message.sid));
              res.end("sent");
	
                                }) // BSV
                }) // BCH
	}) //  BTC
}); // get /send


app.post("/sms",(req,res) => {
  console.log("incolming sms!");
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


app.post("/message",(req,res)=> {
     const updatetime = (new Date()).toLocaleTimeString();
    const response = new MessagingResponse(); 
    const text = req.body.Body;
    const phone = req.body.From;
    console.log("Receive the following string: "+ text +" from phone: "+phone);

     getPrice("BTC").then(
        btcprice =>  {
     		getPrice("BCH").then(
	        bchprice =>  {
     			getPrice("BSV").then(
			        bsvprice =>  {
let messageText = `BTC:$${btcprice} BCH:$${bchprice} BSV:$${bsvprice}`;
console.log("message",messageText);
					response.message(messageText);
              res.set('Content-Type', 'text/xml');
              res.end(response.toString());

			        }
			)
	        }
	    )
        }
    )
});

let getPrice =  (cur) =>  {
    let url = `https://api.coinbase.com/v2/prices/${cur}-USD/spot`;
    let headers =  { 'Content-Type': 'application/json'};
    return fetch(url,{headers:headers})
    .then(res => res.json())
    .then(json => two(json.data.amount.toLocaleString()));
}

function two(num) {
return (Math.round(num * 100) / 100).toLocaleString();
}


// setup the web server using EXPRESS... NEEDED for testing?
const http = require('http');
const port = 5005; // port on the server.
var server = http.createServer(app); // Start express
server.listen(port); // Point it to the port we defined above.
console.log("Started on port "+port)
