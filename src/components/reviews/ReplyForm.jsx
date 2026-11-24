import { useState } from "react";
import Icon from "../common/Icon";

/** "Write a public reply..." input + Reply button. onSubmit(text) returns true when saved. */
function ReplyForm({ authorName, onSubmit }) {
  const [text, setText] = useState("");
  return (
    <form
      className="reply-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit(text)) setText("");
      }}
    >
      <input
        placeholder="Write a public reply..."
        value={text}
        maxLength={500}
        onChange={(e) => setText(e.target.value)}
        aria-label={`Reply to ${authorName}`}
      />
      <button type="submit" className="btn btn-white btn-sm" disabled={!text.trim()}>
        Reply <Icon name="message" size={13} />
      </button>
    </form>
  );
}

export default ReplyForm;
