
var API_KEY = "009a4e32df45a5a69cd1f13fd2a1660b";
var num = 0;  
var courses = [];

var link = "http://api.uwaterloo.ca/v2/courses/MATH/135.json?key=$(009a4e32df45a5a69cd1f13fd2a1660b)";





function ttt(){
    $.getJSON("https://api.uwaterloo.ca/v2/terms/1181/CS/115/schedule.json?key=$(009a4e32df45a5a69cd1f13fd2a1660b)", function(data) {
        console.log(data);
    //data is the JSON string
});
}

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

function StoreCourse(){
    //make sure the array is empty
    courses = [];
    var temp = document.getElementById("NumCourse");
    num = temp.options[temp.selectedIndex].text;
    // check if there are any invalid input
    for (var i = 1; i<= num; i++){
        if(document.getElementById("put"+i).value == null ||
          document.getElementById("put"+i).value == ""){
            alert("Please input all your courses or change the number of course you will take");
            return;
        }
    }
    
     for (var i = 1; i<= num; i++){
        courses.push(document.getElementById("put"+i).value);
     }
    
         for (var i = 0; i< num; i++){
        console.log(courses[i]);
     }
    
    
}

function LoadDataList(){
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


