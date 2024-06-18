const specializationsFlags = {
    psychology: "Psychology",
    psychiatry: "Psychiatry",
    psychotherapy: "Psychotherapy",
    psychoanalysis: "Psychoanalysis",
    psychotherapy: "Psychotherapy",
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
    incorrectPassword:"Incorrect password",
    internalServerError: "Internal server error",
    authenticationFailed: "Authentication failed",
    notAValidArea: "Not a valid area",
    notAValidSpecialization: "Not a valid specialization",
    notAValidDate: "Not a valid date"
}

const generalFlags = {
    all: "All"
}

module.exports = { specializationsFlags, areasFlags, errorFlags,generalFlags };