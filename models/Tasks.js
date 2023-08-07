const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false,
    }
});

const Tasks = mongoose.model("Tasks", taskSchema);
module.exports = Tasks;