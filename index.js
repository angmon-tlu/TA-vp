const express = require('express');
//async programming allowed
const fs = require('fs').promises;
//moodul urli lahtiharutamiseks, et saaks post osad ka kättesaadavaks
const bodyparser = require('body-parser');
const dateET = require('./src/dateTimeET');

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visists.txt';

//käivitan express.js funktsiooni ja annan nimeks "app"
const app = express();

//määrame veebilehtedele mallide renderdamise mootori
app.set('view engine', 'ejs');

//määran ühe päris kataloogi virtuaalses serveris kättesaadavaks
app.use(express.static('public'));

//marsruudid
app.get('/', (req, res)=>{
	//res.send('Express.js läks käima ja serveerib meile veebi.');
	const dayNow = dateET.fullWeekday();
	const dateNow = dateET.fullDate(0);
	const timeNow = dateET.fullTime();
	//typing .ejs at the end is not needed
	res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
});

app.get('/vanasona', async (req, res)=>{
	console.log('Päringu sisu on: ' + req.body);
	try {
		//read txt
		const data = await fs.readFile(textRef, "utf8");
		let folkWisdom = data.split(";");
		res.render('vanasona', {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]});
	}
	catch (err) {
		//error
		res.render('vanasona', {wisdom: 'Ei leidnud ühtegi vanasõna!'});
	}
});

app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
});

app.post('/regvisit', async (req, res)=>{
	try {
		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.nameInput + ';');
		res.render('regvisit');
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}
});

app.listen(5108);