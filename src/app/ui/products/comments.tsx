"use client";

import {useState} from "react";

interface Comment {
	id: string;
	username: string;
	comment: string;
	rating: number;
}

export default function CommentSection({
	productId,
	initialComments,
}: {
	productId: string;
	initialComments: Comment[];
}) {
	const [comments, setComments] = useState(initialComments);
	const [username, setUsername] = useState("");
	const [commentText, setCommentText] = useState("");
	const [rating, setRating] = useState(5);
	const [editingId, setEditingId] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const payload = {
			username,
			comment: commentText,
			rating,
			productId,
		};

		const res = editingId
			? await fetch(`/api/reviews/${editingId}`, {
					method: "PUT",
					body: JSON.stringify(payload),
			})
			: await fetch("/api/reviews", {
					method: "POST",
					body: JSON.stringify(payload),
			});

		const newComment = await res.json();

		if (editingId) {
			setComments(comments.map((c) => (c.id === editingId ? newComment : c)));
			setEditingId(null);
		} else {
			setComments([newComment, ...comments]);
		}

		setUsername("");
		setCommentText("");
		setRating(5);
	};

	const handleDelete = async (id: string) => {
		await fetch(`/api/reviews/${id}`, {method: "DELETE"});
		setComments(comments.filter((c) => c.id !== id));
	};

	const handleEdit = (comment: Comment) => {
		setUsername(comment.username);
		setCommentText(comment.comment);
		setRating(comment.rating);
		setEditingId(comment.id);
	};

	return (
		<>
			<h2>{editingId ? "Edit Comment" : "Leave a Comment"}</h2>
			<form onSubmit={handleSubmit}>
				<input
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder='Your name'
				/>
				<textarea
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
				/>
				<select
					value={rating}
					onChange={(e) => setRating(Number(e.target.value))}
				>
					{[1, 2, 3, 4, 5].map((r) => (
						<option key={r} value={r}>
							{r}
						</option>
					))}
				</select>
				<button type='submit'>{editingId ? "Update" : "Submit"}</button>
			</form>

			<hr />
			<h2>Comments</h2>
			{comments.length === 0 ? (
				<p>No comments yet.</p>
			) : (
				<ul>
					{comments.map((c) => (
						<li key={c.id}>
							<strong>{c.username}</strong> – Rating: {c.rating} <br />
							{c.comment} <br />
							<button onClick={() => handleEdit(c)}>Edit</button>
							<button onClick={() => handleDelete(c.id)}>Delete</button>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
