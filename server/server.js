const express = require('express');
const cors = require('cors');
const db = require('./db');
const { specializationsFlags, areasFlags, generalFlags, errorFlags } = require('./flags')

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userData = await db.login(username, password);
        return res.status(200).json({ message: 'Login successful', user: userData });
    } catch (error) {
        if (error.message === errorFlags.userNotFound) {
            return res.status(404).json({ message: errorFlags.userNotFound });
        } else if (error.message === errorFlags.incorrectPassword) {
            return res.status(401).json({ message: errorFlags.incorrectPassword });
        } else {
            return res.status(500).json({ message: errorFlags.internalServerError });
        }
    }
});
app.get('/api/therapists', authentication, badTherapistsReqChecker, async (req, res) => {
    const { area, specialization, name, date } = req.query;

    try {
        const therapistsData = await db.getTherapists(area, specialization, name, date);

        if (!therapistsData || therapistsData.length === 0) {
            return res.status(200).json({ message: 'No therapists found' });
        }

        return res.status(200).json({ message: 'got relevant therapists', data: therapistsData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


async function authentication(req, res, next) {
    const userId = req.headers.authorization;
    try {
        const isExist = await db.getUserData(userId);
        next()
    } catch (error) {
        if (error.message === errorFlags.userNotFound) {
            return res.status(401).json({ message: errorFlags.authenticationFailed });
        }
        return res.status(500).json({ message: errorFlags.internalServerError });
    }
};

function badTherapistsReqChecker(req, res, next) {
    const { area, specialization, name, date } = req.query;
    if (!Object.values(areasFlags).includes(area) && area !== generalFlags.all) {
        return res.status(400).json({ message: errorFlags.notAValidArea });
    };
    if (!Object.values(specializationsFlags).includes(specialization) && specialization !== generalFlags.all) {
        return res.status(400).json({ message: errorFlags.notAValidSpecialization });
    };
    if (date && date < Date.now()) {
        return res.status(400).json({ message: errorFlags.notAValidDate });
    };
    next()
};

app.listen(port, () => console.log(`Listening on port ${port}...`));