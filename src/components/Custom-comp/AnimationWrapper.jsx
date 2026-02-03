import { motion, AnimatePresence } from "framer-motion";

export const PageSwitch = ({ children, nodeKey }) => {
    return (
        <AnimatePresence mode="wait">
        <motion.div
            key={nodeKey}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}  
            exit={{ opacity: 0, x: -10 }}  
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ width: '100%', height: '98%', display: 'flex', flexDirection: 'column' }}
        >
            {children}
        </motion.div>
        </AnimatePresence>
    );
};

