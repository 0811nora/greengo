import { motion } from 'framer-motion';
import { PageLinks, Ingredients } from '../../data/homeData';

const IngredientCard = ({ item }) => {
  const size = 70;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;

  return (
    <motion.div
      className={`ingredient-card ${item.pos}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.8, y: 0 }}
      whileHover={{ opacity: 1, scale: 1.05, y: -5 }}
    >
      <img src={item.img} alt={item.name} />
      <div className='progress-container'>
        <div className='circle-content'>
          <span className='label'>{item.nur}</span>
          <span className='value'>{item.protein}</span>
        </div>
        {/* 圓圈 */}
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke='#E0E0E0'
            strokeWidth={strokeWidth}
            fill='transparent'
          />
          {/* 進度條 */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={item.color}
            strokeWidth={strokeWidth}
            fill='transparent'
            strokeLinecap='round'
            initial={{ pathLength: 0 }}
            animate={{ pathLength: item.percentage }}
            transition={{ duration: 3, ease: 'easeOut' }}
          />
        </svg>
      </div>
    </motion.div>
  );
};
export default IngredientCard;
