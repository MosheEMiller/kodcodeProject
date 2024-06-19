function generateWorkingDayTimes() {
    const workdayStartHours = [8, 9, 10];
    const workdayEndHours = [15, 16, 17];
    const sessionLengths = [1, 1.5, 2];
    const intervals = [1, 1.5, 2];

    const randomStartHour = workdayStartHours[Math.floor(Math.random() * workdayStartHours.length)];
    const randomEndHour = workdayEndHours[Math.floor(Math.random() * workdayEndHours.length)];

    const beginningTime = getRandomRoundedTime(randomStartHour);
    const endingTime = getRandomRoundedTime(randomEndHour);

    const maxSessionLength = randomEndHour - randomStartHour;
    const randomSessionLength = sessionLengths[Math.floor(Math.random() * sessionLengths.length)];
    const sessionLength = Math.min(randomSessionLength, maxSessionLength);

    const possibleIntervals = intervals.filter(interval => interval >= sessionLength);
    const randomInterval = possibleIntervals[Math.floor(Math.random() * possibleIntervals.length)];

    return {
        beginningTime: beginningTime,
        endingTime: endingTime,
        sessionLength: sessionLength,
        interval: randomInterval
    };
}

function getRandomRoundedTime(hour) {
    const options = [0, 0.25, 0.5, 0.75];
    const randomOption = options[Math.floor(Math.random() * options.length)];
    return hour + randomOption;
}

module.exports = { generateWorkingDayTimes }