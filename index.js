import express from "express";
import bodyParser from "body-parser";

const app = express();  
const port = 3000;
  
var things = [];        
var map = [];      
var descriptions = [];
  
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{  
    res.render("index.ejs");      
});      
    
app.post("/add", (req, res)=>{   
    var description = req.body["description"]; 
    things.push(req.body["thing"]);  
 
    if(description.length > 0){
        map.push(descriptions.length); 
        descriptions.push(description); 
    }  
    else{      
        map.push(-1);
    }  

    console.log(req.body);
       
    res.render("index.ejs", {
        things: things,
        descriptions: descriptions, 
        map: map
    });   
});     

app.listen(port, ()=>{
    console.log(`Listening on port ${port}.`);
});    