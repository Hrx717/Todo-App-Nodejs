const express = require("express");
const fs = require("fs");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(express.json());
app.use(express.static("uploads"))
const PORT = process.env.PORT || 8000;

app.use(upload.single('pic'));

let readDB;
function readFromFile(){
    readDB = fs.readFileSync("./taskData.txt", "utf-8");
    readDB = JSON.parse(readDB);
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

app.post('/task/media', (req,res) => {
    // console.log(req.body.taskEntered);
    // console.log(req.file);
    readFromFile();
    const user = {
        task: req.body.taskEntered,
        complete: false,
        id: (readDB.length)+1,
        file: req.file.filename
    }

    readDB.push(user);
    writeToFile(JSON.stringify(readDB));
    res.redirect('/');
})

app.listen(PORT, ()=> {
    console.log("server is running at " + PORT);
});