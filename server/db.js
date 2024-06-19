const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { specializationsFlags, areasFlags, errorFlags, generalFlags } = require('./flags')
const { generateWorkingDayTimes } = require('./utils')

async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://moshe:1q2w3e4r@cluster0.09oog7i.mongodb.net/mentalHealthSystem", {
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(errorFlags.errorConnectingToMongoDB, error);
        process.exit(1);
    }
}

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const user = mongoose.model('user', userSchema);

const therapistSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    area: { type: String, required: true },
    phone: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
    beginningTime: { type: Number, required: true },
    endingTime: { type: Number, required: true },
    sessionLength: { type: Number, required: true },
    interval: { type: Number, required: true },
});
const therapist = mongoose.model("therapist", therapistSchema)

const appointmentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    therapist: { type: Schema.Types.ObjectId, ref: 'therapist', required: true },
    date: { type: Date, required: true },
    hour: { type: Number, required: true },
});
const appointment = mongoose.model("appointment", appointmentSchema);


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

        await therapist.collection.drop();
        console.log("Therapists collection dropped");

        const therapistsList = [];
        for (let i = 1; i <= 50; i++) {
            const { beginningTime, endingTime, sessionLength, interval } = generateWorkingDayTimes();
            therapistsList.push({
                name: "therapist" + i,
                address: "addressStreet" + i,
                area: Object.values(areasFlags)[i % Object.values(areasFlags).length],
                phone: i + "-12345678",
                mail: "mail" + i + "@gmail.com",
                specialization: Object.values(specializationsFlags)[i % Object.values(specializationsFlags).length],
                beginningTime: beginningTime,
                endingTime: endingTime,
                sessionLength: sessionLength,
                interval: interval,
            });
        }

        await therapist.insertMany(therapistsList);
        console.log("Therapists inserted successfully");
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
            throw new Error(errorFlags.userNotFound);
        }
        const isMatch = password === userData.password;
        if (!isMatch) {
            throw new Error(errorFlags.incorrectPassword);
        }
        return userData;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getUserData(userId) {
    try {
        const userData = await user.findOne({ _id: userId });
        if (!userData) {
            throw new Error(errorFlags.userNotFound);
        }
        return userData;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getTherapists(area, specialization, name, date) {
    try {
        const filter = {};
        if (area != generalFlags.all) {
            filter.area = area;
        }
        if (specialization != generalFlags.all) {
            filter.specialization = specialization;
        }
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        // check if these therapists have at least one free appointment on the received date       
        const therapistData = await therapist.find(filter);
        return therapistData;
    } catch (error) {
        throw new Error(error.message);
    }
}

connectDB();
// DBInitialization()

module.exports = {
    login,
    getUserData,
    getTherapists,
};