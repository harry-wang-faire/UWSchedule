'use strict';

var API_KEY = "009a4e32df45a5a69cd1f13fd2a1660b"; // the key for UW-API
var num = 0;
var courses = [];

var prefix = "https://api.uwaterloo.ca/v2/terms/";
var postfix = `/schedule.json?key=$(${API_KEY})`;
// components of url for API


var test_url = "https://api.uwaterloo.ca/v2/terms/1181/CS/115/schedule.json?key=$(009a4e32df45a5a69cd1f13fd2a1660b)";
function Test1() {
	$.getJSON(test_url, function(data) {
		console.log(data);
    //data is the JSON string
	});
}

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
	var courseterm = "1" + lastDigits + month + courseName + courseNumber;
	return prefix+courseterm+postfix;
}

// request the Api from uw
function requestApi(CourseName,year,term) {
	var url = buildUrl(CourseName,year,term);
	//this method can't handle errors, write a function to determine
	// if it did successfully
	$.getJSON(url, function(data) {
		console.log(data.data);
		//data is the JSON string
	 });
}

// Display different input bars
function DisplayCourseNum() {
	for (var i = 1; i <= 7; i++) {
		document.getElementById("class" + i).style.visibility = "hidden";
	}
	
	var temp = document.getElementById("NumCourse");
    num = temp.options[temp.selectedIndex].text;
	
    for (var i = 1; i <= num; i++) {
        document.getElementById("class"+i).style.visibility = "visible";
    }
   document.getElementById("confirm").style.visibility = "visible";
}

// Store the courses after user click confirm
function StoreCourse() {
	courses = []; // make sure the array is empty
	var temp = document.getElementById("NumCourse");
	num = temp.options[temp.selectedIndex].text;
	temp = document.getElementById("year");
	var year = temp.value;
	
	if (year < 2000 || year > ((new Date()).getFullYear() + 1)) {
		alert("Please input a valid year");
		return;
	}
	
	temp = document.getElementById("term");
	var term = temp.value;
	
	for (var i = 1; i <= num; i++) {
		var val = document.getElementById("put"+i).value;
		if(val === null || val === ""){
			alert("Please input all your courses or change the number of course you will take");
			return;
		}
		var courseName = "/" + val.toUpperCase().match(/([A-Z])+/g);
		var courseNumber = "/" + val.match(/\d+/g);
		if (courseName === "" || courseNumber === "") {
			alert(`Course${i} is invalid`);
			return;
		}
	}
	
	for (var i = 1; i <= num; i++) {
		courses.push(document.getElementById("put"+i).value);
	}
	
	for (var i = 0; i < num; i++) {
		for (var j = i + 1; j < num; j++) {
			if (courses[j] === courses[i]) {
				alert("Please do not input same courses more than once");
				return;
			}
		}
	}
	
	for (var i = 0; i < num; i++) {
		// console.log(courses[i]);
		requestApi(courses[i],year,term);
	}
}

var built = false;
function LoadDataList() {
	if (!built)
	{
		built = true;
		var dataList = document.getElementById('coursename');
		var input = document.getElementById('put1');
		// Create a new XMLHttpRequest.
		var request = new XMLHttpRequest();
		// Handle state changes for the request.
		request.onreadystatechange = function(response) {
			if (request.readyState === 4) {
				if (request.status === 200) {
					// Parse the JSON
					var jsonOptions = JSON.parse(request.responseText);
					
					// Loop over the JSON array.
					jsonOptions.forEach(function(item) {
						// Create a new <option> element.
						var option = document.createElement('option');
						// Set the value using the item in the JSON array.
						option.value = item;
						// Add the <option> element to the <datalist>.
						dataList.appendChild(option);
					});
					
					// Update the placeholder text.
					input.placeholder = "e.g. CS100";
				} else {
					// An error occured :(
					input.placeholder = "Couldn't load datalist options :(";
				}
			}
		};
		
		// Update the placeholder text.
		input.placeholder = "Loading options...";
		
		// Set up and make the request.
		request.open('GET', 'html-elements.json', true);
		//request.send();
	}
}


