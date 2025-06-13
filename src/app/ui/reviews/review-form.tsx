"use client";

import {useState, useEffect} from "react";
import {Comment} from "@/app/lib/definitions";
import {addReview, updateReview, deleteReview} from "@/app/lib/actions";

interface ReviewFormProps {
	productId: string;
	existingComments: Comment[];
	currentUser: {
		id: string;
		name: string;
		email: string;
		artisanId: number;
	} | null;
}

export default function ReviewForm({
	productId,
	existingComments,
	currentUser,
}: ReviewFormProps) {
	const [commentText, setCommentText] = useState("");
	const [rating, setRating] = useState(5);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [comments, setComments] = useState<Comment[]>(existingComments);

	useEffect(() => {
		setComments(existingComments);
	}, [existingComments]);

	if (!currentUser) {
		return <p>You must be logged in to leave a comment.</p>;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!commentText.trim()) return;

		if (editingId) {
			const updated: Comment | null = await updateReview(editingId, {
				user_id: currentUser.id,
				username: currentUser.name,
				comment: commentText,
				rating,
			});
			if (updated) {
				setComments(comments.map((c) => (c.id === editingId ? updated : c)));
				setEditingId(null);
			}
		} else {
			const newComment: Comment | null = await addReview(productId, {
				user_id: currentUser.id,
				username: currentUser.name,
				comment: commentText,
				rating,
			});
			if (newComment) {
				setComments([newComment, ...comments]);
			}
		}

		setCommentText("");
		setRating(5);
	};

	const handleEdit = (id: string) => {
		const c = comments.find((c) => c.id === id);
		if (!c) return;
		// Only allow editing if currentUser is the comment owner
		if (c.user_id !== currentUser.id) return;

		setCommentText(c.comment);
		setRating(c.rating);
		setEditingId(id);
	};

	const handleDelete = async (id: string) => {
		const c = comments.find((c) => c.id === id);
		if (!c) return;
		// Only allow deleting if currentUser is the comment owner
		if (c.user_id !== currentUser.id) return;

		const success = await deleteReview(id);
		if (success) {
			setComments(comments.filter((c) => c.id !== id));
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<textarea
					placeholder='Write your comment'
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
					rows={3}
					style={{display: "block", width: "100%", marginBottom: "8px"}}
				/>
				<label>
					Rating:
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
				</label>
				<br />
				<button type='submit'>
					{editingId ? "Update Comment" : "Submit Comment"}
				</button>
			</form>

			<ul>
				{comments.map((c) => (
					<li key={c.id}>
						<strong>{c.username}</strong> – Rating: {c.rating} <br />
						{c.comment} <br />
						<small>{new Date(c.created_at).toLocaleDateString()}</small> <br />
						{c.user_id === currentUser.id && (
							<>
								<button onClick={() => handleEdit(c.id)}>Edit</button>
								<button
									onClick={() => handleDelete(c.id)}
									style={{marginLeft: "8px"}}
								>
									Delete
								</button>
							</>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
