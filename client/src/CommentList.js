import React from 'react';

const CommentList = ({ comments }) => {
	const renderComments = comments.map((comment) => {
		let content;

		if (comment.status === 'approved') content = comment.content;
		if (comment.status === 'pending') content = 'Awaiting moderation.';
		if (comment.status === 'rejected') content = 'Comment has been rejected.';

		return <li key={comment.id}>{content}</li>;
	});

	return <ul>{renderComments}</ul>;
};

export default CommentList;
