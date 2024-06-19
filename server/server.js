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
app.get('/api/therapists', authentication, isValidArea, isValidSpecialization, isValidDate, async (req, res) => {
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
app.get('/api/freeAppointment', authentication, anExistingTherapist, isValidDate, async (req, res) => {
    const { therapistId, date } = req.body;
    try {
        const freeAppointmentData = await db.freeappointment(therapistId, date);
        return res.status(200).json({ message: 'These are the free appointmentData', freeAppointment: freeAppointmentData });
    } catch (error) {
        return res.status(500).json({ message: errorFlags.internalServerError })
    }
})
app.post('/api/createAppointment', authentication, anExistingUser, anExistingTherapist, isValidDate, isValidHour, async (req, res) => {
    const { userId, therapistId, date, hour } = req.body;
    try {
        const appointmentData = await db.createAppointment(userId, therapistId, date, hour);
        res.status(201).json({ message: 'Meeting successfully created', appointment: appointmentData });
    } catch (error) {
        if (error.message === errorFlags.noFreeAppointments) {
            return res.status(409).json({ message: errorFlags.noFreeAppointments });
        }
        if (error.message === errorFlags.appointmentNotAvailable) {
            return res.status(409).json({ message: errorFlags.appointmentNotAvailable });
        }
        else { return res.status(500).json({ message: errorFlags.internalServerError }); }
    }
});


async function authentication(req, res, next) {
    const userId = req.headers.authorization;
    try {
        const isExist = await db.getUser(userId);
        next()
    } catch (error) {
        if (error.message === errorFlags.userNotFound) {
            return res.status(401).json({ message: errorFlags.authenticationFailed });
        }
        return res.status(500).json({ message: errorFlags.internalServerError });
    }
};
function isValidArea(req, res, next) {
    const { area } = req.query;
    if (!Object.values(areasFlags).includes(area) && area !== generalFlags.all) {
        return res.status(400).json({ message: errorFlags.notAValidArea });
    };
    next();
};
function isValidSpecialization(req, res, next) {
    const { specialization } = req.query;
    if (!Object.values(specializationsFlags).includes(specialization) && specialization !== generalFlags.all) {
        return res.status(400).json({ message: errorFlags.notAValidSpecialization });
    };
    next();
};
function isValidDate(req, res, next) {
    const dateString = req.body.date || req.query.date;
    if (dateString === generalFlags.all) {
       return next();
    }
    const dateParts = dateString.split(/[/\.]/).map(Number);
    if (dateParts.length !== 3) {
        return res.status(400).json({ message: errorFlags.invalidOrPastDate });
    }

    const [day, month, year] = dateParts;

    if (!day || !month || !year || month < 1 || month > 12) {
        return res.status(400).json({ message: errorFlags.invalidOrPastDate });
    }

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        daysInMonth[1] = 29;
    }

    if (day < 1 || day > daysInMonth[month - 1]) {
        return res.status(400).json({ message: errorFlags.invalidOrPastDate });
    }

    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (inputDate.getTime() === todayDate.getTime()) {
      return  next();
    }

    if (inputDate < todayDate) {
        return res.status(400).json({ message: errorFlags.invalidOrPastDate });
    }

    next();
};
function isValidHour(req, res, next) {
    const { hour } = req.body;
    if (hour < 0 || hour > 23) {
        return res.status(400).json({ message: errorFlags.notAValidHour });
    }
    next();
};
async function anExistingTherapist(req, res, next) {
    try {
        await db.getOneTherapist(req.body.therapistId);
        next();
    } catch (error) {
        return res.status(404).json({ message: errorFlags.therapistNotFound });
    }
};
async function anExistingUser(req, res, next) {
    try {
        await db.getUser(req.body.userId);
        next();
    } catch (error) {
        return res.status(404).json({ message: errorFlags.userNotFound });
    }
};


app.listen(port, () => console.log(`Listening on port ${port}...`));