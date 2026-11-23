import { useState } from 'react';
import StarPicker from '../common/StarPicker.jsx';

/** Inline "rate this event" form. onSubmit(rating, text). */
export default function QuickReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  return (
    <form
      className="mini-review"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(rating, text);
      }}
    >
      <StarPicker value={rating} onChange={setRating} />
      <input className="input" placeholder="How was it?" value={text} maxLength={500} onChange={(e) => setText(e.target.value)} />
      <button type="submit" className="btn btn-white btn-sm" disabled={!rating || text.trim().length < 5}>
        Post
      </button>
    </form>
  );
}
