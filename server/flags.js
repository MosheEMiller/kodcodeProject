const specializationsFlags = {
    psychology: "Psychology",
    psychiatry: "Psychiatry",
    psychotherapy: "Psychotherapy",
    psychoanalysis: "Psychoanalysis",
}

const areasFlags = {
    north: "North",
    south: "South",
    east: "East",
    west: "West",
    central: "Central",
}

const errorFlags = {
    errorConnectingToMongoDB: "Error connecting to MongoDB",
    userNotFound: "User not found",
    incorrectPassword: "Incorrect password",
    internalServerError: "Internal server error",
    authenticationFailed: "Authentication failed",
    notAValidArea: "Not a valid area",
    notAValidSpecialization: "Not a valid specialization",
    notAValidDate: "Not a valid date",
    noFreeAppointments: "No free appointments",
    appointmentNotAvailable: "Appointment not available",
    therapistNotFound: "Therapist not found",
    invalidOrPastDate: "Invalid or past date",
    notAValidHour: "Not a valid hour",
}

const generalFlags = {
    all: "All"
}

module.exports = { specializationsFlags, areasFlags, errorFlags, generalFlags };