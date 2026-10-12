const regTextRef = 'public/txt/visits.txt';

//@desc last visitor site
//@route GET /regvisit
//@access public

const regvisit = (req, res) => {
	res.render('regvisit');
};

//@desc last visitor entry
//@route POST /regvisit
//@access public

const regvisitPost = async (req, res) => {
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
};

module.exports = {
	regvisit,
	regvisitPost
}