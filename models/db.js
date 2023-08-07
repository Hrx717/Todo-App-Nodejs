const mongoose = require("mongoose");

module.exports.init = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/TodoDB"),{
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }    
}