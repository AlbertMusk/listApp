const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },

});

userSchema.pre('save', function(next) {
    if(this.isNew) {
        this.createTime = this.updateTime = Date.now();
    } else {
        this.updateTime = Date.now();
    }
    next();
});

userSchema.statics = {
    findByUsername: function(username) {
        return this.findOne({ username });
    },
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
    }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
