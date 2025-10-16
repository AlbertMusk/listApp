const mongoose  = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedPersonName: { type: String, required: true },
    assignedPersonID: { type: String, required: true },
    dueDate: { type: Date },
    isCompleted: { type: Boolean, default: false },
    completionImages: { type: [String], default: [] },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
});

TaskSchema.pre('save', function(next) {
    if(this.isNew) {
        this.createTime = this.updateTime = Date.now();
    } else {
        this.updateTime = Date.now();
    }
    next();
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;