
// Takes a day name ("Monday, "tues", "Thu", etc) and turns it to an int
// Example: Sunday = 0, Monday = 1
function dayStrToNum(dayName) {
	const weekdays = ["sun","mon","tue","wed","thu","fri","sat"];
	return weekdays.indexOf(dayName.slice(0,3).toLowerCase());
}

// Takes a weekday number and returns the day's name
function dayNumToStr(dayNumber) {
	const weekdayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	return weekdayNames[dayNumber];
}

/*
	Returns a Date object for the next date of the given day
		dayName - The weekday as a string
		excludeToday - Should today be used if the day matches
		refDate - They day to start looking ahead from
*/
function getNextDayOfTheWeek(dayName, excludeToday = true, refDate = new Date()) {
	const dayOfWeek = dayStrToNum(dayName);

	if (dayOfWeek < 0) return;
	refDate.setHours(0,0,0,0);
	refDate.setDate(refDate.getDate() + !!excludeToday + 
			(dayOfWeek + 7 - refDate.getDay() - !!excludeToday) % 7);

	return refDate;
}


// Takes an Egencia date string ("YYYY-MM-DD", e.g. "2020-02-05")
// and turns it into a JS date object
function egenciaDateStrToDate(egenciaDateStr) {
	const year = egenciaDateStr.slice(0, 4);
	const month = parseInt(egenciaDateStr.slice(5, 7)) - 1; // Month is zero-indexed
	const date = egenciaDateStr.slice(8, 10);
	const dateObj = new Date(year, month, date);

	return dateObj;
}

// Coverts date object to string date format used by Egencia
function dateToEgenciaDateStr(date) {
	const year = date.getFullYear(); 
	let month = date.getMonth() + 1;
	let day = date.getDate();
	
	if(month < 10) month = '0' + month;
	if(day < 10) day = '0' + day;
	
	return year + "-" + month + "-" + day;
}