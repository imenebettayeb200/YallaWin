import Avatar from '../common/Avatar.jsx';
import { timeAgo } from '../../utils/format.js';

/** Blue box under a review: the organization's public reply. */
export default function ReplyCard({ orgName, reply }) {
  return (
    <div className="reply-card">
      <Avatar name={orgName} size={24} square />
      <div>
        <p className="reply-meta">
          Reply from {orgName} · {timeAgo(reply.createdAt)}
        </p>
        <p className="reply-text">{reply.text}</p>
      </div>
    </div>
  );
}
