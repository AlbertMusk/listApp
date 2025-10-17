const mongoose  = require('mongoose');
const User = require('./User');

const OrderSchema = new mongoose.Schema({
    customName: { type: String, required: true },
    orderName: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    isCompleted: { type: Boolean, default: false },
    hasCompleteAmount: {type: Number, default: 0 },
    notCompleteAmount: { type: Number, default: 0 },
    completeTime: { type: Date },
    completeUserName: { type: String },
    completeUserId: { type: String },
    remarks: { type: String },
    requirements: { type: String },
    weight: { type: String },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
});

OrderSchema.pre('save', function(next) {
    if(this.isNew) {
        this.createTime = this.updateTime = Date.now();
        this.notCompleteAmount = this.totalAmount - this.hasCompleteAmount;
    } else {
        this.updateTime = Date.now();
    }
    next();
});

OrderSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('updateTime')
            .exec(cb);
    },
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb);
    },
    deleteById: function(id, cb) {
        return this.deleteOne({ _id: id }).exec(cb);
    },
    fetchByCustomName: function(customName, cb) {
        return this
            .find({ customName: customName })
            .sort('updateTime')
            .exec(cb);
    },
    fetchByOrderName: function(orderName, cb) {
        return this
            .find({ orderName: orderName })
            .sort('updateTime')
            .exec(cb);
    },
    fetchCompleted: function(cb) {
        return this
            .find({ isCompleted: true })
            .sort('completeTime')
            .exec(cb);
    },
    fetchPending: function(cb) {
        return this
            .find({ isCompleted: false })
            .sort('orderDate')
            .exec(cb);
    },
    fetchByCompleter: function(completeUserId, cb) {
        return this
            .find({ completeUserId: completeUserId })
            .sort('completeTime')
            .exec(cb);
    },
    fetchSortedByDate: function(cb) {
        return this
            .find({})
            .sort('orderDate')
            .exec(cb);
    },
    fetchByOrderName: function(orderName, cb) {
        return this
            .find({ orderName: orderName })
            .sort('orderDate')
            .exec(cb);
    },
};


const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
