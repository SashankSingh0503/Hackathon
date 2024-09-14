const {MongoClient} = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const db = client.db("Team-users");
const coll = db.collection("Users-list");


async function connectToMongo(){
    try{
        await client.connect();
        console.log("Connected to mongodb");
    }
    catch(err){
        console.log("Error : " + err);
    }
};

connectToMongo().then(()=>{

    const express = require('express');
    const app = express();
    const port = 4200;
    let str="";
    app.use(express.json()); // Middleware to parse JSON bodies
    app.get("/h",(req,res)=>{
        res.sendFile(__dirname+"/try.html");
    })
    app.get("/searchapi",(req,res)=>{
        res.sendFile(__dirname+"/page.html");
    })
    app.post('/searchapi', (req, res) => {
        const axios = require('axios');
        let str = req.body.inp;
        async function createChatSession(apiKey, externalUserId) {
          const url = 'https://api.on-demand.io/chat/v1/sessions';
          const headers = { apikey: apiKey };
          const body = { pluginIds: [], externalUserId: externalUserId };
        
          try {
            const response = await axios.post(url, body, { headers });
            return response.data.data.id; // Extract session ID
          } catch (error) {
            console.error('Error creating chat session:', error);
            throw error;
          }
        }
        
        async function submitQuery(apiKey, sessionId, query) {
          const url = `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`;
          const headers = { apikey: apiKey };
          const body = {
            endpointId: 'predefined-openai-gpt4o',
            query: query,
            pluginIds: ['plugin-1712327325', 'plugin-1713962163'],
            responseMode: 'sync'
          };
        
          try {
            const response = await axios.post(url, body, { headers });
            return response.data;
          } catch (error) {
            console.error('Error submitting query:', error);
            throw error;
          }
        }
        
        (async () => {
          const apiKey = 'GHdGPGkCkGLTQC1jcVmEY8togHOsluYX';
          const externalUserId = '66e4280927d9681bcca75ed7';
          const query = `${str}. Is it reated to a educational stuff or not. Answer in yes or no only.`;
        
          try {
            const sessionId = await createChatSession(apiKey, externalUserId);
            const queryResponse = await submitQuery(apiKey, sessionId, query);
            console.log('Query Response:', queryResponse.data.answer);
            let ans = queryResponse.data.answer;
            if(ans === "yes." || ans==="Yes."){
                console.log("Yes");
                res.sendFile(__dirname+"/index.html");
            }
            else{
                console.log("No");
                res.sendFile(__dirname+"/try.html");
            }
          } catch (error) {
            console.error('Error in chat process:', error);
          }
        })();
        
    
    });
    
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
    

})


process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log("MongoDB connection closed");
        process.exit(0);
    } catch (err) {
        console.error("Error closing MongoDB connection:", err);
        process.exit(1);
    }
});

