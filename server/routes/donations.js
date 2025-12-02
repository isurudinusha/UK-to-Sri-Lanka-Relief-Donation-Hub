import express from 'express';
import Donation from '../models/Donation.js';

const router = express.Router();

// Create donation
router.post('/', async (req, res) => {
    try {
        const donation = new Donation(req.body);
        await donation.save();

        // Convert _id to id for frontend
        const donationObj = donation.toObject();
        donationObj.id = donationObj._id.toString();
        delete donationObj._id;
        delete donationObj.__v;

        res.status(201).json(donationObj);
    } catch (error) {
        console.error('Create donation error:', error);
        res.status(500).json({ error: 'Failed to create donation' });
    }
});

// Get all donations
router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ date: -1 });

        // Convert _id to id for frontend
        const donationsWithId = donations.map(d => {
            const obj = d.toObject();
            obj.id = obj._id.toString();
            delete obj._id;
            delete obj.__v;
            return obj;
        });

        res.json(donationsWithId);
    } catch (error) {
        console.error('Get donations error:', error);
        res.status(500).json({ error: 'Failed to fetch donations' });
    }
});

// Get user's donations
router.get('/user/:userId', async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.params.userId }).sort({ date: -1 });

        // Convert _id to id for frontend
        const donationsWithId = donations.map(d => {
            const obj = d.toObject();
            obj.id = obj._id.toString();
            delete obj._id;
            delete obj.__v;
            return obj;
        });

        res.json(donationsWithId);
    } catch (error) {
        console.error('Get user donations error:', error);
        res.status(500).json({ error: 'Failed to fetch user donations' });
    }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const donations = await Donation.find();

        const totalWeight = donations.reduce((acc, curr) => acc + curr.weightKg, 0);
        const totalDonations = donations.length;
        const uniqueDonors = new Set(donations.map(d => d.userId.toString())).size;

        // Calculate category breakdown
        const categoryMap = {};
        donations.forEach(d => {
            categoryMap[d.category] = (categoryMap[d.category] || 0) + d.weightKg;
        });

        const categoryBreakdown = Object.keys(categoryMap).map(key => ({
            name: key,
            value: categoryMap[key]
        }));

        // Convert donations to frontend format
        const recentDonations = donations.slice(0, 5).map(d => {
            const obj = d.toObject();
            obj.id = obj._id.toString();
            delete obj._id;
            delete obj.__v;
            return obj;
        });

        res.json({
            totalWeight,
            totalDonations,
            donorsCount: uniqueDonors,
            categoryBreakdown,
            recentDonations
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Update donation
router.put('/:id', async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        // Convert _id to id for frontend
        const donationObj = donation.toObject();
        donationObj.id = donationObj._id.toString();
        delete donationObj._id;
        delete donationObj.__v;

        res.json(donationObj);
    } catch (error) {
        console.error('Update donation error:', error);
        res.status(500).json({ error: 'Failed to update donation' });
    }
});

// Delete donation
router.delete('/:id', async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        res.json({ message: 'Donation deleted successfully' });
    } catch (error) {
        console.error('Delete donation error:', error);
        res.status(500).json({ error: 'Failed to delete donation' });
    }
});

export default router;
