const {Wit,log} = require('node-wit');
const accessToken = 'PVDS7JELD3ANAGJCUROC6R4WCZIDEIVX';

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};
const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve,reject){
      //console.log('sending...',JSON.stringify(response));
      return resolve();
    });
  },
  getForecast({context, entities}) {
    return new Promise(function(resolve,reject){
      var location = firstEntityValue(entities,"location");
      if(location){
        context.forecast = 'sunny in ' + location;
        //delete context.missingLocation;
      }else{
        context.forecast = 'where?';
        //context.missingLocation = true;
        //delete context.forecast;
      }
      return resolve(context);
    });
  },
};
const client = new Wit({accessToken: accessToken,actions});



const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
app.use(bodyParser.json());

app.post('/chat',function(req,res){
  //res.send({msg: "hola que tal"});
  const sessionId = req.body.sessionId;
  const message = req.body.message;
  const context = {};
  client.runActions(sessionId,message,context)
    .then((newContext)=> {
      //console.log(response);
      res.send(newContext);
    })
});

server.listen(3000, function(){
  console.log('Bot running at port 3000');
  //client.runActions();
})






/*
const sessionId = 'session1';
const context0 = {};
client.runActions(sessionId,'What is the weather?',context0)
.then(
  function(context){
    //console.log('The session state is now:' +JSON.stringify(sessionState))
    if(context.missingLocation){
      console.log("Missing location");
      return client.runActions(sessionId,'In paris',context);
    }else{
      console.log(context.forecast);
    }
    //return client.runActions(sessionId,)
  }
)
.then(
  function(context){
    console.log(JSON.stringify(context));
  }
)
.catch((e)=>{
  console.log('Oops! got an error: ' +e);
})
*/
