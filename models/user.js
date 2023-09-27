const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    university: { type: String, trim: true },
    course: { type: String, trim: true },
    state: { type: String, trim: true },
    year: { type: String, trim: true },
    code: { type: String, trim: true },
    stream: { type: String, trim: true },
    profile: { type: String, trim: true },
    batch: { type: String, trim: true },
    picture: { type: String, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, trim: true, required: true },
    phone: { type: String, required: true, minlength: 10, maxlength: 11 },
    status: { type: String, default: "inactive" },
    role: {
        type: String, 
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        },
    },
    timestamps: true
});

const User = mongoose.model('users', UserSchema);

module.exports = User;