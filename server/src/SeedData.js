const axios = require('axios');
const mongoose = require('mongoose');
const Transaction = require('./Schema');

mongoose.connect('mongodb://localhost:27017/transactions', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function seedDatabase() {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding the database', error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();
