'use strict';

var ScheduleNum = 0;
var schedule = [];
var emptyCourse = {classes : [{start_time : "0:00", end_time : "0:00"}], section : "NULL"};

function StandardTime(time) { // use the minutes only to record time
	var sp = time.split(":");
	return Number(sp[0]) * 60 + Number(sp[1]);
}

function checkValidity(curSchedule) { // check if a schedule contains no conflicts
	var timetable = curSchedule;
	timetable.sort(function(a, b) {
		return StandardTime(a.classes[0].start_time) - StandardTime(b.classes[0].start_time);
	});
	
	for (var i = 1; i < timetable.length; i++) {
		if (StandardTime(timetable[i - 1].classes[0].end_time) > StandardTime(timetable[i].classes[0].start_time)) {
			return false;
		}
	}
	return true;
}

function search(courses, year, term, curSchedule, finished, total) {
	if (finished === total) {
		ScheduleNum++;
		schedule.push(curSchedule);
		return;
	}
	
	var lec = [], tut = [], lab = [], tst = [], ol = [];
	var data = requestApi(courses[finished], year, term);
	for (var i = 0; i < data.length; i++) { // classify the sections for a course
		if (data[i].campus === "ONLN ONLINE") {
			ol.push(data[i]);
		} else if (data[i].section.match(/([A-Z]+)/g) === "LEC") {
			lec.push(data[i]);
		} else if (data[i].section.match(/([A-Z]+)/g) === "TUT") {
			tut.push(data[i]);
		} else if (data[i].section.match(/([A-Z]+)/g) === "LAB") {
			lab.push(data[i]);
		} else {
			tst.push(data[i]);
		}
	}
	
	if (lec === []) {
		lec.push(emptyCourse);
	}
	if (tut === []) {
		tut.push(emptyCourse);
	}
	if (lab === []) {
		lab.push(emptyCourse);
	}
	if (tst === []) {
		tst.push(emptyCourse);
	}
	
	var cur = [];
	for (var i1 = 0; i1 < lec.length; i1++) {
		for (var i2 = 0; i2 < tut.length; i2++) {
			for (var i3 = 0; i3 < lab.length; i3++) {
				for (var i4 = 0; i4 < tst.length; i4++) {
					cur = curSchedule;
					cur.push(lec[i1]);
					cur.push(tut[i2]);
					cur.push(lab[i3]);
					cur.push(tst[i4]);
					if (checkValidity(cur)) {
						search(courses, year, term, cur, finished + 1, total);
					}
				}
			}
		}
	}
	
	cur = curSchedule;
	for (i = 0; i < ol.length; i++) {
		if (ol[i].section.match(/([A-Z]+)/g) === "TST") {
			cur.push(ol[i]);
		}
		if (checkValidity(cur)) {
			search(courses, year, term, cur, finished + 1, total);
		}
	}
}
