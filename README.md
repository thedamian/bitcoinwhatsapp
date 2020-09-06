# Bitcoin WhatsApp Message Example

This is a quick example of how to receive whatsapp Messages through twillio and reply with something from the internet (in this example we look up the bitcoin price and reply with it.)

To install it just:
1) copy the .env-sample and make a .env then enter the right twilio information
2) then run the following commands to install all dependencies and start the project
```
npm i
npm start
```

but you'll need to host it somewhere (like now.sh) that is public and HTTPS since twilio has to hit that endpoint when you get an SMS or WhatAPP message.

You can also use a service like nGrok or localhost.run
