var num = 0;
var courses = [];
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
var courses;
function StoreCourse(){
    var temp = document.getElementById("NumCourse");
    num = temp.options[temp.selectedIndex].text;
    for (var i = 1; i<= num; i++){
        if(document.getElementById("put"+i).value == null ||
          document.getElementById("put"+i).value == ""){
            alert("Please input all your courses or change the number of course you will take");
        }
    }
    
    
}