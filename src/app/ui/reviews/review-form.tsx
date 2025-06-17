'use client';

import { useState } from 'react';
import styles from './review-form.module.css';
import { Comment } from '@/app/lib/definitions';
import { addReview, updateReview, deleteReview } from '@/app/lib/actions';

interface ReviewFormProps {
	productId: string;
	existingComments: Comment[];
}

export default function ReviewForm({ productId, existingComments }: ReviewFormProps) {
	const [username, setUsername] = useState('');
	const [commentText, setCommentText] = useState('');
	const [rating, setRating] = useState(5);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [comments, setComments] = useState<Comment[]>(existingComments);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!username.trim()) {
			setError('Username is required.');
			return;
		}

		if (!commentText.trim()) {
			setError('Comment is required.');
			return;
		}

		if (rating < 1 || rating > 5) {
			setError('Rating must be between 1 and 5.');
			return;
		}

		if (editingId) {
			const updated = await updateReview(editingId, {
				username,
				comment: commentText,
				rating,
			});
			if (updated) {
				setComments(comments.map((c) => (c.id === editingId ? updated : c)));
				setEditingId(null);
			}
		} else {
			const newComment = await addReview(productId, {
				username,
				comment: commentText,
				rating,
			});
			if (newComment) {
				setComments([newComment, ...comments]);
			}
		}

		setUsername('');
		setCommentText('');
		setRating(5);
	};

	const handleEdit = (id: string) => {
		const c = comments.find((c) => c.id === id);
		if (!c) return;
		setUsername(c.username);
		setCommentText(c.comment);
		setRating(c.rating);
		setEditingId(id);
	};

	const handleDelete = async (id: string) => {
		const success = await deleteReview(id);
		if (success) {
			setComments(comments.filter((c) => c.id !== id));
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				{error && <p style={{ color: 'red' }}>{error}</p>}

				<input
					type="text"
					placeholder="Your name"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					style={{ display: 'block', width: '100%', marginBottom: '8px' }}
				/>
				<textarea
					placeholder="Write your comment"
					value={commentText}
					onChange={(e) => setCommentText(e.target.value)}
					rows={3}
					style={{ display: 'block', width: '100%', marginBottom: '8px' }}
				/>
				<label>
					Rating:
					<select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
						{[1, 2, 3, 4, 5].map((r) => (
							<option key={r} value={r}>
								{r}
							</option>
						))}
					</select>
				</label>
				<br />
				<button type="submit" className={styles.submitButton}>
					{editingId ? 'Update Comment' : 'Submit Comment'}
				</button>
			</form>

			<ul>
				{comments.map((c) => (
					<li key={c.id}>
						<strong>{c.username}</strong> – Rating: {c.rating} <br />
						{c.comment} <br />
						<small>{c.created_at.toLocaleDateString()}</small> <br />
						<button onClick={() => handleEdit(c.id)} className={styles.submitButton}>Edit</button>
						<button onClick={() => handleDelete(c.id)} className={styles.submitButton} style={{ marginLeft: '8px' }}>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
