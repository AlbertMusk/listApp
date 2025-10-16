const mongoose  = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    dueDate: { type: Date },
    todoPersonID: { type: String, required: true },
    todoPersonName: { type: String, required: true },
    completionImages: { type: [String], default: [] },
    isCompleted: { type: Boolean, default: false },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;