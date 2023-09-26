import express from "express";
import bodyParser from "body-parser";

const app = express();  
const port = 3000;
  
var things = [];        
var check = [];      
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
        check.push(descriptions.length); 
        descriptions.push(description); 
    }  
    else{      
        check.push(-1);
    }  
       
    res.render("index.ejs", {
        things: things,
        descriptions: descriptions, 
        check: check,
    });   
});    

app.listen(port, ()=>{
    console.log(`Listening on port ${port}.`);
});    