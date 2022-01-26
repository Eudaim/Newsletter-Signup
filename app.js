const express= require("express"); 
const bodyParser = require("body-parser"); 
const https = require("https"); 
const res = require("express/lib/response");
const { response } = require("express");
const app = express();
//specify a static folder{which is our public folder}
app.use(express.static("public")); //to send static{local} files which is everything in our public folder

//PLEASE NOTE YOU HAVE TO OMMIT THE PUBLIC FOLDER FROM THE PATH WHEN LINKING ANY STATIC FILES

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(request, response){
    response.sendFile(__dirname + "/signup.html");
});

app.post("/" , function(request, res){ //post route that targets the home route
                //  remember this is how we receive the information of the forms
    const firstName = request.body.fname;
    const lastName = request.body.lname; 
    const email = request.body.email; 
    
    //putting the informaiton we got in a sort of JSON object so that we can start the process making a https request
    const data = {
        members: [
            {
                email_address: email, 
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    //turn JSON{data variable} into it's string notation
    const jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/ae6e6d3e56";
    const options = {
        method: "POST", 
        auth: "ardonniss1:27751e64a8764b238d27822e4956e7f4-us20"
    }
    const req = https.request(url, options, function(response){
        
        if(response.statusCode === 200)
        {
            res.sendfile(__dirname + "/success.html"); 
        }
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data){//calls when we get data back
            console.log(JSON.parse(data));
        }); 
    });

    req.write(jsonData); 
    req.end();
});

app.post("/failure", function(request, response){
    response.sendFile(__dirname + "/signup.html")
})

app.listen(2000, function(){
    console.log("Sever is Running...")
});

//27751e64a8764b238d27822e4956e7f4-us20
//ae6e6d3e56