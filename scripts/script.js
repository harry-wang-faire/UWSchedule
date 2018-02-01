
var API_KEY = "009a4e32df45a5a69cd1f13fd2a1660b";
var num = 0;  
var courses = [];


var prefix="https://api.uwaterloo.ca/v2/terms/"
var postfix = "/schedule.json?key=$(009a4e32df45a5a69cd1f13fd2a1660b)"




function ttt(){
    $.getJSON("https://api.uwaterloo.ca/v2/terms/1181/CS/115/schedule.json?key=$(009a4e32df45a5a69cd1f13fd2a1660b)", function(data) {
        console.log(data);
    //data is the JSON string
});
}

function buildUrl(name,year,term){
    var courseName = "/"+ name[0];
    var courseNumber = "/"+name[1];
    if (term === "fall"){
        var num = "9";
    }else if (term === "winter"){
        var num = "1";
    }else if  (term === "spring"){
        var num = "5";
    }
    var lastDigit = year%100;
    var courseterm = "1" + lastDigit + num + courseName + courseNumber;
    return prefix+courseterm+postfix;
}
// request the Api from uw
function requestApi(CourseName,year,term){
    var course_str = CourseName.split(" ");
    var url = buildUrl(course_str,year,term);
    //this method can't handle errors, write a function to determine
    // if it did successfully
     $.getJSON(url, function(data) {
        console.log(data);
    //data is the JSON string
});
}

// Display different input bars
function DisplayCourseNum(){

    for (var i = 1; i<= 7; i++){
        document.getElementById("class"+i).style.visibility = "hidden";
    }
    var temp = document.getElementById("NumCourse");
    num = temp.options[temp.selectedIndex].text;
    for (var i = 1; i<= num; i++){
        document.getElementById("class"+i).style.visibility = "visible";
    }
   document.getElementById("confirm").style.visibility = "visible";
    
}

// Store the courses after user clicking confirm
function StoreCourse(){
    //make sure the array is empty
    courses = [];
    var temp = document.getElementById("NumCourse");
    num = temp.options[temp.selectedIndex].text;
    temp = document.getElementById("year");
    var year = temp.value;
    
    if (year < 2000 || year > ((new Date()).getFullYear() +1)) 
    {
        alert("Please input a valid year");
        return;
    }
    temp = document.getElementById("term");
    var term = temp.value;
    console.log(term);
    // check if there are any invalid input
    for (var i = 1; i<= num; i++){
        var val = document.getElementById("put"+i).value;
        var sp = val.split(" ");
        if(val === null || val === ""){
            alert("Please input all your courses or change the number of course you will take");
            return;
        }
       if (sp[1] === undefined || sp[2] != undefined) {
        alert("Some courses you inputed is not a valid course");
        return;
    }
    }
     for (var i = 1; i<= num; i++){
        courses.push(document.getElementById("put"+i).value);
     }
    for (var i = 0; i< num; i++){
        if (i!=num-1)   {
        for (var j = i+1; j < num; j++){
            if (courses[j] === courses[i]){
                alert("Please don't put same coure twice");
                return;
            }
            }
        }
    }
        for (var i = 0; i< num; i++){
       // console.log(courses[i]);
        requestApi(courses[i],year,term);
     }
    
    
}

var notbuild = true;
function LoadDataList(){
    if (notbuild)
    {
        notbuild = false;
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
request.send();
        
    }
}


