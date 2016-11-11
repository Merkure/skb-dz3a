import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (req, res) => {

	var str = req.query.username;
	str = str.replace(/@/g, '');
	var reg = /(@+)?(http:|https:)?(\/\/)?([^\/?]+\/)?([^\/?&@]+)/i;
	var nickname = str.match(reg);
	console.log(nickname);

	if ( nickname == null )
	{
		nickname = 'Invalid username';
	}
	else
	{
		nickname = nickname[5];
	}

	var reg2 = /(www)|\d+\.|(ru)|(com)/i;
	var test = reg2.test(nickname);
	if ( test )
	{
		nickname = 'Invalid username';
	}

	if ( nickname )
	{
		nickname = `@${nickname}`;
	}
	console.log(nickname);

  res.send(nickname);

});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
