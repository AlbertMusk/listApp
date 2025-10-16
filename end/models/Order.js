const mongoose  = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customName: { type: String, required: true },
    orderName: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    isCompleted: { type: Boolean, default: false },
    completeTime: { type: Date },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
});