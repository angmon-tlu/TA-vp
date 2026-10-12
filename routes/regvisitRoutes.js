const express = require('express');
const router = express.Router();
const regTextRef = 'public/txt/visits.txt';

//kontrollerid
const{
	regvisit,
	regvisitPost} = require('../controllers/regvisitControllers');


router.route('/regvisit').get(regvisit);

router.route('/regvisit').get(regvisitPost);

module.exports = router;

/* app.get('/eestifilm', (req, res)=>{
	res.render('eestifilm');
}); */