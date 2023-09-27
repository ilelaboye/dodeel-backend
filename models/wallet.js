const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    amount: { type: Number, required: true },
}, {
    timestamps: true
});

const Wallet = mongoose.model('wallet', WalletSchema);

module.exports = Wallet;