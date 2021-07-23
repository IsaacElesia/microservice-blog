const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json({ extended: false }));
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex');
	const { content } = req.body;

	const comments = commentsByPostId[req.params.id] || [];
	comments.push({ id: commentId, content, ststus: 'pending' });

	commentsByPostId[req.params.id] = comments;

	await axios
		.post('http://localhost:4005/events', {
			type: 'CommentCreated',
			data: {
				id: commentId,
				postId: req.params.id,
				content,
				status: 'pending',
			},
		})
		.catch((err) => console.log(err));

	res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
	console.log('Received Event', req.body.type);

	const { type, data } = req.body;

	if (type === 'CommentModerated') {
		const { postId, id, content, status } = data;

		const comments = commentsByPostId[postId];
		const comment = comments.find((comment) => {
			return comment.id === id;
		});

		comment.status = status;

		await axios
			.post('http://localhost:4005/events', {
				type: 'CommentUpdated',
				data: {
					id,
					postId,
					content,
					status,
				},
			})
			.catch((err) => console.log(err));
	}

	return res.status(200);
});

app.listen(4001, () => {
	console.log('Comments server listening on pot 4001.');
});
