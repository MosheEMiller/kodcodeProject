function generateWorkingDayTimes() {
    const workdayStartHours = [8, 9, 10];
    const workdayEndHours = [15, 16, 17];
    const sessionLengths = [1, 1.5, 2];
    const intervals = [0.25, 0.5, 0.75];
    const randomStartHour = workdayStartHours[Math.floor(Math.random() * workdayStartHours.length)];
    const randomEndHour = workdayEndHours[Math.floor(Math.random() * workdayEndHours.length)];

    const beginningTime = getRandomRoundedTime(randomStartHour);
    const endingTime = getRandomRoundedTime(randomEndHour);

    const maxsessionLength = randomEndHour - randomStartHour;
    const randomsessionLength = sessionLengths[Math.floor(Math.random() * sessionLengths.length)];
    const sessionLength = Math.min(randomsessionLength, maxsessionLength);

    const randominterval = intervals[Math.floor(Math.random() * intervals.length)];
    const interval = Math.max(randominterval, sessionLength);

    return {
        beginningTime: beginningTime,
        endingTime: endingTime,
        sessionLength: sessionLength,
        interval: interval
    };
}
function getRandomRoundedTime(hour) {
    const options = [0, 0.25, 0.5, 0.75];
    const randomOption = options[Math.floor(Math.random() * options.length)];
    return hour + randomOption;

}

module.exports = { generateWorkingDayTimes }