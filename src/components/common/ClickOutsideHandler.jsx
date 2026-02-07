import { useClickAway } from 'react-use';
import { useRef } from 'react';

const ClickOutsideHandler = ({ children, onOutsideClick }) => {
    const ref = useRef(null);

    useClickAway(ref, () => {
        onOutsideClick();
    });

    return (
        <div ref={ref} className=" click-outside-wrapper" style={{ display: 'contents' }}>
            {children}
        </div>
    );
};

export default ClickOutsideHandler;