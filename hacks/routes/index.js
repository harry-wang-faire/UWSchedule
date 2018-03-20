var express = require('express');
var router = express.Router();
var bodyp = require('body-parser');
//Require the module 
var uwaterlooApi = require('uwaterloo-api'); 
const util = require('util');
//Instantiate the client 
var fs = require('fs');
const { Console } = require('console');

/* GET users listing. */
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// custom simple logger
const logger = new Console(output, errorOutput);
// use it like console

var uwclient = new uwaterlooApi({
  API_KEY : '009a4e32df45a5a69cd1f13fd2a1660b'
});


var ScheduleNum = 0;
var schedule = [];
var emptyCourse = {classes : [{start_time : "0:00", end_time : "0:00"}], section : "NULL"};


function buildUrl(name,year,term) {
	var courseName = "/" + name.match(/^([a-z]+)/gi);
	var courseNumber = "/" + name.match(/\d+(E|e)?$/gi);
	var month = "";
	
	if (term === "Fall") {
		month = "9";
	} else if (term === "Winter") {
		month = "1";
	} else {
		month = "5";
	}
	
	var lastDigits = year%100;
	var courseterm = "/1" + lastDigits + month + courseName + courseNumber;
	return courseterm;
}

function StandardTime(time) { // use the minutes only to record time
	var sp = time.split(":");
	return Number(sp[0]) * 60 + Number(sp[1]);
}

function checkValidity(curSchedule) { // check if a schedule contains no conflicts
	var timetable = curSchedule;
    timetable.sort(function (a, b) {
        //logger.log(a.classes[0].date.start_time);
      //  logger.log(util.inspect(curSchedule[0]));

		return StandardTime(a.classes[0].date.start_time) - StandardTime(b.classes[0].date.start_time);
	});
	
	for (var i = 1; i < timetable.length; i++) {
		if (StandardTime(timetable[i - 1].classes[0].end_time) > StandardTime(timetable[i].classes[0].start_time)) {
			return false;
		}
	}
	return true;
}

var count = 0;
function search(courses, year, term, curSchedule, finished, total) {
	if (finished === total) {
		ScheduleNum++;
		schedule.push(curSchedule);
		return;
	}
	
var lec = [], tut = [], lab = [], tst = [], ol = [];


 var url = '/terms'+ buildUrl(courses[finished],year,term)  + '/schedule';
  uwclient.get(url, {}, function(err, res){
  	var data = res.data;
  	//logger.log('LEC 002'.match(/([A-Z]+)/g)[0]);
	for (var i = 0; i < data.length; i++) { // classify the sections for a course
		if (data[i].campus === "ONLN ONLINE") {
			ol.push(data[i]);
		} else if (data[i].section.match(/([A-Z]+)/g)[0] === "LEC") {
			lec.push(data[i]);
		} else if (data[i].section.match(/([A-Z]+)/g)[0] === "TUT") {
			tut.push(data[i]);
		} else if (data[i].section.match(/([A-Z]+)/g)[0] === "LAB") {
			lab.push(data[i]);
		} else {
			tst.push(data[i]);
		}
	}
	
	if (lec.toString() == "") {
		lec.push(emptyCourse);
	}
	if (tut.toString() == "") {
		tut.push(emptyCourse);
	}
	if (lab.toString() == "") {
		lab.push(emptyCourse);
	}
	if (tst.toString() == "") {
		tst.push(emptyCourse);
	}
	/*logger.log(lec);
	logger.log(util.inspect(lec,false,null));
	logger.log(util.inspect(tut,false,null));
	logger.log(util.inspect(lab,false,null));
	logger.log(util.inspect(tst,false,null));
logger.log(lec.length);
logger.log(tut.length);
logger.log(lab.length);
logger.log(tst.length);
	*/
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
					//logger.log(util.inspect(cur[0].classes,false,null));
					if (checkValidity(cur)) {
						search(courses, year, term, cur, finished + 1, total);
						logger.log(++count);

					}
				}
			}
		}
	}
	
	cur = curSchedule;
	for (i = 0; i < ol.length; i++) {
		if (ol[i].section.match(/([A-Z]+)/g) === "LEC") {
			cur.push(ol[i]);
		}
		if (checkValidity(cur)) {
			search(courses, year, term, cur, finished + 1, total);
		}
	}
	});
}

var courses = [];
/* GET home page. */
router.get('/', function(req, res, next) {
 
search(["cs246"], 2016, "Fall", [], 0, 1);
logger.log(schedule);

res.render('index', { title: 'Express' });
});

module.exports = router;
