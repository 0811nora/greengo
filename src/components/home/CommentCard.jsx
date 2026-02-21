import { NavLink } from 'react-router-dom';
import { CommentContent } from '../../data/homeData';

const CommentCard = ({
  commentContent, // 留言內容
  customer, // 留言顧客帳號名稱
  star, // 內文
}) => {
  return (
    <div className='comment-card bg-brown-100 text-primary shadow'>
      <div className='flex-grow-1'>
        <p className='text-brown-300 fw-semibold mb-2'>{commentContent}</p>
      </div>
      <div className='d-flex justify-content-between align-items-center mt-2 pt-2 flex-wrap border-top border-gray-200'>
        <p className='fw-medium m-0'>{customer}</p>
        <p className='m-0'>
          {Array.from({ length: star }).map((item, index) => (
            <span key={index}>💖</span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default CommentCard;
