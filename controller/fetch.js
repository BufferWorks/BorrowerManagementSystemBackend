const DailyBorrower = require('../models/dailyborrower');
const FinanceBorrower = require('../models/financeborrower');
const MonthlyBorrower = require('../models/monthlyborrower');


exports.fetchDailyBorrower = async (req, res) => {
    try {
        const includeFull = req.query.full === 'true';
        const onlySuggestions = req.query.suggestions === 'true';
        let query = DailyBorrower.find();

        if (onlySuggestions) {
            query = query.select('name contact aadharNumber chequeNumber address reference');
        } else if (!includeFull) {
            // TEMPORARY: artificial delay to simulate old load time — remove when client is informed
            await new Promise(resolve => setTimeout(resolve, 40000));
            // By default, exclude the heavy installments array (~93% payload reduction)
            // Use ?full=true to include installments (for data download)
            query = query.select('-installments');
        }

        const dailyBorrowers = await query.lean();
        res.status(200).json({ dailyBorrowers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching daily borrowers', error: error.message });
    }
}


// Aggregation endpoint for today's total collection (lightweight — just a number)
exports.fetchDailyBorrowerStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const result = await DailyBorrower.aggregate([
            { $unwind: "$installments" },
            { $match: {
                "installments.paid": true,
                "installments.paidOn": { $gte: today, $lt: tomorrow }
            }},
            { $group: {
                _id: null,
                todaysTotalCollection: { $sum: "$installments.receivedAmount" }
            }}
        ]);

        res.status(200).json({
            todaysTotalCollection: result.length > 0 ? result[0].todaysTotalCollection : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching daily borrower stats', error: error.message });
    }
}


// Detailed collection breakdown for a specific date (lazy-loaded when modal opened)
// Accepts ?date=YYYY-MM-DD query param. Defaults to today if not provided.
exports.fetchDailyCollectionDetails = async (req, res) => {
    try {
        const dateParam = req.query.date;
        const targetDate = dateParam ? new Date(dateParam) : new Date();
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const result = await DailyBorrower.aggregate([
            { $unwind: "$installments" },
            { $match: {
                "installments.paid": true,
                "installments.paidOn": { $gte: targetDate, $lt: nextDay }
            }},
            { $group: {
                _id: "$_id",
                name: { $first: "$name" },
                totalPaidOnDate: { $sum: "$installments.receivedAmount" },
                payments: { $push: {
                    amount: "$installments.receivedAmount",
                    paidOn: "$installments.paidOn",
                    installmentDate: "$installments.date"
                }}
            }},
            { $sort: { name: 1 } }
        ]);

        const totalCollection = result.reduce((sum, b) => sum + b.totalPaidOnDate, 0);

        res.status(200).json({
            date: targetDate.toISOString().split('T')[0],
            totalCollection,
            paidBorrowers: result
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching collection details', error: error.message });
    }
}


exports.fetchMonthlyBorrower = async (req, res) => {
    try {
        const onlySuggestions = req.query.suggestions === 'true';
        let query = MonthlyBorrower.find();

        if (onlySuggestions) {
            query = query.select('name contact aadharNumber chequeNumber address reference');
        } else {
            // By default, exclude the heavy installments array (~93% payload reduction) for general list load
            query = query.select('-installments');
        }

        const monthlyBorrowers = await query.lean();
        res.status(200).json({ monthlyBorrowers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching monthly borrowers', error: error.message });
    }
}

exports.fetchFinanceBorrower = async (req, res) => {
    try {
        const financeBorrowers = await FinanceBorrower.find();
        res.status(200).json({ financeBorrowers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching finance borrowers', error: error.message });
    }
}