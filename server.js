const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

let readDB;
function readFromFile(){
    readDB = fs.readFileSync("./taskData.txt", "utf-8");
}

readFromFile();

const writeToFile = (content) => {
    fs.writeFileSync("./taskData.txt", content);
}

//get requests
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/styles.css", (req,res) => {
    res.sendFile(__dirname + "/public/styles.css");
});
app.get("/images/bg.jpg", (req,res) => {
    res.sendFile(__dirname + "/public/images/bg.jpg");
});

app.get("/script.js", (req,res) => {
    res.sendFile(__dirname + "/public/script.js");
});

app.get("/api/todo", (req,res) => {
    readFromFile();
    if(!readDB) res.json("");
    else res.json(readDB);
});

// post request
app.post("/", (req,res) => {
    const response = req.body;
    if(!response) {
        console.log("no response data, error")
    }
    writeToFile(JSON.stringify(response));
    // readFromFile();
    res.end();
});

app.listen(8000, ()=> {
    console.log("server is running at 8000");
});