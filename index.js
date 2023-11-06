import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();  
const port = 3000;

const uri = "mongodb://127.0.0.1";
// const client = new MongoClient(uri);
  
var things = [];        
var map = [];      
var descriptions = [];
  
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

async function getFromDB(){
    const client = new MongoClient(uri);
    try{
        const database = client.db("ToDoList");
        const collection = database.collection("Things");

        var size = await collection.countDocuments();
        console.log(size);
        for(var i=0; i<size; i++){
            const doc = await collection.findOne({_id: i+1});

            if(doc){
                things.push(doc.work);

                if(doc.instruct){
                    descriptions.push(doc.instruct);
                    map.push(descriptions.length - 1);
                }
                else
                    map.push(-1);
            }
        }
    }
    finally{
        await client.close();
    }
}

app.get("/", async (req, res)=>{  
    await getFromDB().catch(console.dir);
    res.render("index.ejs", {
        things: things,
        descriptions: descriptions, 
        map: map
    });   
});      

async function putIntoDB(){
    const client = new MongoClient(uri);
    try{
        const database = client.db("ToDoList");
        const collection = database.collection("Things");

        var index = await collection.countDocuments();
        var doc;

        for(var i=index; i<things.length; i++){
            if(map[i] !== -1){
                doc = {
                    _id: i+1,
                    work: things[i],
                    instruct: descriptions[map[i]]
                }
            }
            else{
                doc = {
                    _id: i+1,
                    work: things[i]
                }
            }

            await collection.insertOne(doc);
        }
    }
    finally{
        await client.close();
    }
}
    
app.post("/add", async (req, res)=>{   
    var description = req.body["description"]; 
    things.push(req.body["thing"]);  
 
    if(description.length > 0){
        map.push(descriptions.length); 
        descriptions.push(description); 
    }  
    else{      
        map.push(-1);
    }  

    // console.log(req.body);
    await putIntoDB().catch(console.dir);
       
    res.render("index.ejs", {
        things: things,
        descriptions: descriptions, 
        map: map
    });   
});     

app.listen(port, ()=>{
    console.log(`Listening on port ${port}.`);
});    