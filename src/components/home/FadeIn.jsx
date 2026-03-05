import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0.2 }) => {
  const MotionDiv = motion.div;
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </MotionDiv>
  );
};
export default FadeIn;
