const {MongoClient} = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const db = client.db("Team-users");
const coll = db.collection("Users-list");

let userinfo = {};
let username1 = " ";
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

    const express = require("express");
    const PORT = 3600;
    const bodyParser = require("body-parser");
    const app = express();
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(express.static(__dirname + '/Home'));
    app.use(express.json());

    app.get("/signin.html",(req,res)=>{
        res.sendFile(__dirname + "/signin.html");
    });
    app.get("/signup",(req,res)=>{
        res.sendFile(__dirname + "/signup.html");
    });
    app.get("/signup.html",(req,res)=>{
        res.sendFile(__dirname + "/signup.html");
    });

    app.get("/problem.html",(req,res)=>{
        res.sendFile(__dirname + "/problem.html");
    });

    app.get("/profile.html",(req,res)=>{
        res.sendFile(__dirname + "/profile.html");
    });

    app.get("/team.html",(req,res)=>{
        res.sendFile(__dirname + "/team.html");
    });

    app.get("/profile",(req,res)=>{
        res.sendFile(__dirname + "/profile.html");
    });
   
    app.post("/new-user-info" , (req,res)=>{
        req.body.username = (req.body.name).slice(0,3) + (req.body.phone).slice(0,3);
        console.log(req.body);
        userdetails = req.body;
        coll.insertOne(req.body);
        res.sendFile(__dirname + "/signup.html");
    });

    app.post('/user-login', async (req, res) => {
        try {
            const query = {};
            if (req.body.username) {
                query.name = req.body.username;
            }
            if (req.body.password) {
                query.password = req.body.password;
            }
    
            const data = await db.collection('Users-list').find(query).toArray();
            userinfo = data;
             username1 =  userinfo[0].name + userinfo[0].phone.slice(0, 4) ;
             

            if (data.length === 0) {
                res.send('No data found..');
            } 
            if(req.body.role === "User"){
                res.sendFile(__dirname + "/index.html");
            }
            else{
                res.sendFile(__dirname + "/developer.html");
            }
        } catch (err) {
            console.error('Error searching data:', err);
            res.status(500).send('Error searching data');
        }
    });

    app.get("/user-data",(req,res)=>{
        res.json(userinfo);
    });

    app.listen(PORT , ()=>{
        console.log("Server is listening on port number: " + PORT);
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

