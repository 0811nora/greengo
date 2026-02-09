import { NavLink } from "react-router-dom";

const CommentCard = ({
  commentContent, // 留言內容
  customer, // 留言顧客帳號名稱
  star, // 內文
}) => {
  return (
    <div className="comment-card bg-brown-100 text-primary shadow">
      <p className="text-brown-300 fw-semibold mb-0">{commentContent}</p>
      <hr className="m-0 p-0" />
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        {" "}
        <p className="fw-bold mb-0">{customer}</p>
        <p className="text-gray-300 mb-0">{star}</p>
      </div>
    </div>
  );
};

export default CommentCard;
