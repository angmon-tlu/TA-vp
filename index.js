const express = require('express');
//async programming allowed
const fs = require('fs').promises;
//moodul urli lahtiharutamiseks, et saaks post osad ka kättesaadavaks
const bodyparser = require('body-parser');
//moodul andmebaasiga suhtlemiseks, promises osaga async programmeerimise jaoks
const mysql = require('mysql2/promise');
//moodul .env faili lugemiseks, keskkonnamuutujate parsimiseks
require('dotenv').config();
const dateET = require('./src/dateTimeET');
const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';
//käivitan express.js funktsiooni ja annan nimeks "app"
const app = express();

//määrame veebilehtedele mallide renderdamise mootori
app.set('view engine', 'ejs');
//määran ühe päris kataloogi virtuaalses serveris kättesaadavaks
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: false}))

//loon andmebaasiühenduse
/* const conn = mysql.createConnection({
	host: 'localhost',
	user: 'if26',
	password: 'ifikas26',
	database: 'if26_angmon_TA'
}); */

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

app.get('/vlr', async (req, res)=>{
	res.render('vlr');
});

/* app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
}); */

/* app.post('/regvisit', async (req, res)=>{
	try {
		const dayNow = dateET.fullWeekday();
		const dateNow = dateET.fullDate(0);
		const timeNow = dateET.fullTime();
		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.nameInput + ", " + timeNow + ", " + dateNow + "; ");
		res.render('regvisit', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
	}
	catch (err) {
		console.log(err);
		res.render('regvisit');
	}
}); */

app.get('/viimane', async (req, res)=>{
	try {
		//read txt
		const data = await fs.readFile(textRef, "utf8");
		let regTextRef = data.split(";");
		res.render('viimane');
	}
	catch (err) {
		//error
		console.log('viga');
	}
});

const regvisitRouter = require('./routes/regvisitRoutes');
app.use('/regvisit', regvisitRouter);

//EESTI FILMI marsruudid
const eestifilmRouter = require('./routes/eestifilmRoutes');
app.use('/eestifilm', eestifilmRouter);

/* app.get('/eestifilm', (req, res)=>{
	res.render('eestifilm');
}); */

/* app.get('/eestifilm/inimesed', async (req, res)=>{
	//console.log('Andmebaasiserver on: ' + process.env.DB_HOST);
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = 'SELECT * FROM person ORDER by last_name';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('eestifilminimesed', {personList: sqlRes});
	}
	catch (err) {
		console.log('Viga andmebaasist lugemisel: ' + err);
		res.render('eestifilminimesed', {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
}); */

/* app.get('/eestifilm/inimesed_add', (req, res)=>{
	res.render('eestifilminimesed_add', {notice: 'Ootan sisestust!'});
}); */

/* app.post('/eestifilm/inimesed_add', async (req, res)=>{
	console.log(req.body);
	//kontrollime andmete olemasolu
	if(!req.body.firstNameInput || !req.body.lastNameInput || req.body.bornInput >= new Date()) {
		console.log('Andmed pole korrektsed');
		return res.render('eestifilminimesed_add', {notice: 'Andmed on puudulikud!'});
	}
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?, ?, ?, ?)';
		let deceasedDate = null;
		if(req.body.deceasedInput !=''){
			deceasedDate = req.body.deceasedInput;
		}
		await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
		]);
		res.render('eestifilminimesed_add', {notice: 'Andmed salvestati! Ootan uut sisestust!'});
	}
	catch (err) {
		console.log('Viga andmebaasiga suhtlemisel: ' + err);
		res.render('eestifilminimesed_add', {notice: 'Tekkis viga, andmed ei salvestatud!'});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
}); */

app.listen(5108);