module.exports = {
    /**
     * Add time to a date
     * @param {Date} date The date to add time to
     * @param {number} minutes The amount of minutes to add
     */
    addTime: (date, minutes) => {
        return new Date(date.getTime() + minutes * 60000);
    },
};