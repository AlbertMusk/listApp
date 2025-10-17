const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
    token: { type: String },
    role: { type: String, default: 'leader' },
    roleName: { type: String, default: '班组长' }
});

userSchema.pre('save', function(next) {
    if(this.isNew) {
        this.createTime = this.updateTime = Date.now();
    } else {
        this.updateTime = Date.now();
    }
    if(!this.token) {
        const salt = bcrypt.genSaltSync(10);
        this.token = bcrypt.hashSync(this.username + Date.now(), salt);
    }
    if(this.role === 'admin') {
        this.roleName = '管理员';
    } else if(this.role === 'leader') {
        this.roleName = '班组长';
    } else {
        this.roleName = '主任';
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
    },
    findByToken: function(token, cb) {
        return this.findOne({ token });
    },
    deleteById: function(id, cb) {
        return this.deleteOne({ _id: id }).exec(cb);
    }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
