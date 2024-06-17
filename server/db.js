const mongoose = require('mongoose');
const Schema = mongoose.Schema;

async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://moshe:1q2w3e4r@cluster0.09oog7i.mongodb.net/mentalHealthSystem", {
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const user = mongoose.model('user', userSchema);

async function DBInitialization() {
    try {
        await user.collection.drop();
        console.log('Users collection dropped');

        const usersList = [];
        for (let i = 1; i <= 20; i++) {
            usersList.push({ username: 'user' + i, password: 'password' + i });
        }

        await user.insertMany(usersList);
        console.log('Users inserted successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
}

async function login(username, password) {
    try {
        const userData = await user.findOne({ username: username });
        if (!userData) {
            throw new Error('User not found');
        }
        const isMatch = password === userData.password;
        if (!isMatch) {
            throw new Error('Incorrect password');
        }
        return userData;
    } catch (error) {
        throw new Error(error.message);
    }
}

connectDB();

module.exports = {
    DBInitialization,
    login
};
