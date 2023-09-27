const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String },
    details: { type: String },
    spec: { type: String },
    feature: { type: String },
    status: { type: Number, default: 1 },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: "categories"
    }
}, {
    timestamps: true
});

const Product = mongoose.model('products', ProductSchema);

module.exports = Product

