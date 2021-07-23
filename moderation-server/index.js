const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json({ extended: false }));

app.post('/events', async (req, res) => {
	const { type, data } = req.body;

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;

		const statusValue = content.includes('orange') ? 'rejected' : 'approved';

		await axios
			.post('http://localhost:4005/events', {
				type: 'CommentModerated',
				data: {
					id,
					postId,
					content,
					status: statusValue,
				},
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return res.status(200);
});

app.listen(4003, () => {
	console.log('Moderation-server listening on port 4003.');
});
