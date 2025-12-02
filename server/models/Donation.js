import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donorName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    itemsDescription: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Food', 'Medical', 'Clothing', 'Education', 'Other'],
        required: true
    },
    weightKg: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    impactMessage: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pending', 'Collected', 'Shipped', 'Delivered'],
        default: 'Pending'
    }
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
