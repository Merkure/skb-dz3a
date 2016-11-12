import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import bodyParser from 'body-parser';
import _ from 'lodash';
/*import saveDataInDb from './saveDataInDb';
import Computer from './models/Computers';*/
import fetch from 'isomorphic-fetch';

mongoose.Promise = Promise;
mongoose.connect('mongodb://publicdb.mgbeta.ru/savinovskih_skb');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("bd connected");
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

/*app.get('/clear', isAdmin, async (req, res) => {
	await User.remove({});
	await Pet.remove({});
	return res.send("OK");
});

app.get('/users', async (req, res) => {
	const users = await User.find();
	return res.json(users);
});

app.get('/pets', async (req, res) => {
	const pets = await Pet.find().populate('owner');;
	return res.json(pets);
});

app.post('/data', async (req, res) => {
	const data = req.body;
	if (!data.user) return res.status(400).send('user required');
	if (!data.pets) data.pets = [];

	const user = await User.findOne({
		name: data.user.name,
	});
	if (user) return res.status(400).send('user.name is exists');
	try {
		const result = await saveDataInDb(data);
		return res.json(result);
	}
	catch (err){
		return res.status(500).json(err);
	}
});*/

let data = {};

async function loadData()
{
	const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
	await fetch(pcUrl)
	  .then(async (res) => {
	    data = await res.json();
	  })
	  .catch(err => {
	    console.log('Чтото пошло не так:', err);
	  });
}

loadData();

app.get('*', (req, res) => {

	let parametrs = req.path.replace('/', '').split('/');
	let result = data;

	if ( parametrs[0] !== undefined  &&  parametrs[0] !== ''  &&  parametrs[0] != 'volumes' )
	{
		result = data[parametrs[0]]
	}

	if ( parametrs[1] !== undefined  &&  result !== undefined )
	{
		console.log('test');
		result = data[parametrs[0]][parametrs[1]];
	}

	if ( parametrs[2] !== undefined  &&  result !== undefined )
	{
		result = data[parametrs[0]][parametrs[1]][parametrs[2]];
	}

	// volumes 

	if ( parametrs[0] == 'volumes' )
	{

		let disks = {};
		_.forEach(data.hdd, (item) => {
	  	if ( disks[item.volume] )
	  	{
	  		disks[item.volume] += item.size;
	  	}
	  	else 
	  	{
	  		disks[item.volume] = item.size;
	  	}
	  });

  	for ( let key in disks )
  	{
  		disks[key] += 'B';
  	}

  	result = disks;

	}

	if ( result === undefined )
	{
		return res.status(404).send('Not found');
	}

	return res.json( result );
	
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
