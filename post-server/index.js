const express = require('express');
const app = express();
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

app.use(express.json({ extended: false }));
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/posts/create', async (req, res) => {
	const id = randomBytes(4).toString('hex');
	const { title } = req.body;

	posts[id] = {
		id,
		title,
	};

	await axios
		.post('http://events-bus-srv:4005/events', {
			type: 'PostCreated',
			data: {
				id,
				title,
			},
		})
		.catch((err) => console.log(err));

	res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
	console.log('Received Event', req.body.type);

	return res.status(200);
});

app.listen(4000, () => {
	console.log('v20');
	console.log('Posts server listing on pot 4000.');
});
