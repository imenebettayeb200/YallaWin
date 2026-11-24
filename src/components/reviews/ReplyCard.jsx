import Avatar from "../common/Avatar";
import { timeAgo } from "../../utils";

/** Blue box under a review: the organization's public reply. */
function ReplyCard({ orgName, reply }) {
  return (
    <div className="reply-card">
      <Avatar name={orgName} size={24} square />
      <div>
        <p className="reply-meta">
          Reply from {orgName} · {timeAgo(reply.date)}
        </p>
        <p className="reply-text">{reply.text}</p>
      </div>
    </div>
  );
}

export default ReplyCard;
