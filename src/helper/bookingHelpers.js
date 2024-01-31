const ApiError = require("../utils/ErrorHandler");
const httpStatus = require("http-status");

function getDateDifference(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate) || isNaN(endDate)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid date time format. Please provide valid date strings."
    );
  }

  const diffInMilliseconds = endDate - startDate;

  if (diffInMilliseconds < 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "End date should be greater than start date."
    );
  }

  const MS_PER_HOUR = 1000 * 60 * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;
  const MS_PER_MONTH = MS_PER_DAY * 30.44;

  if (diffInMilliseconds < MS_PER_DAY) {
    return Math.round(diffInMilliseconds / MS_PER_HOUR);
  } else if (diffInMilliseconds < MS_PER_MONTH) {
    return Math.round(diffInMilliseconds / MS_PER_DAY);
  } else {
    return Math.round(diffInMilliseconds / MS_PER_MONTH);
  }
}

function getNoOfHours(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate) || isNaN(endDate)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid date time format. Please provide valid date strings."
    );
  }

  const diffInMilliseconds = endDate - startDate;

  if (diffInMilliseconds < 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "End date should be greater than start date."
    );
  }

  const MS_PER_HOUR = 1000 * 60 * 60;

  return Math.round(diffInMilliseconds / MS_PER_HOUR);
}

function getNoOfDays(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  if (isNaN(startDate) || isNaN(endDate)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid date time format. Please provide valid date strings."
    );
  }


  const diffInMilliseconds = endDate - startDate;

  if (diffInMilliseconds < 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "End date should be greater than start date."
    );
  }

  const MS_PER_HOUR = 1000 * 60 * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;

  return Math.round(diffInMilliseconds / MS_PER_DAY) +1;
}

function getNoOfMonths(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate) || isNaN(endDate)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid date time format. Please provide valid date strings."
    );
  }

  const diffInMilliseconds = endDate - startDate;

  if (diffInMilliseconds < 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "End date should be greater than start date."
    );
  }

  const MS_PER_HOUR = 1000 * 60 * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;
  const MS_PER_MONTH = MS_PER_DAY * 30.44;

  return Math.round(diffInMilliseconds / MS_PER_MONTH) ;
}

function isStartDateTimeValid(dateTimeString) {
  const inputDate = new Date(dateTimeString);
  inputDate.setHours(0, 0, 0, 0);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return (inputDate >= currentDate);
}

module.exports = { getDateDifference, getNoOfHours, getNoOfDays, getNoOfMonths, isStartDateTimeValid };
