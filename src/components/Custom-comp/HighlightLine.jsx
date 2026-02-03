import React from 'react';

const HighlightLine = ({ color = "#FFD700", strokeWidth = 10, opacity = 0.6 }) => {
    return (
        <svg 
            viewBox="0 0 100 20" 
            preserveAspectRatio="none" 
            style={{
                position: 'absolute',
                left: '-5%',
                bottom: '10%',
                width: '110%',
                height: '0.6em',
                zIndex: 1,
                pointerEvents: 'none'
            }}
        >
            <path 
                className="pencil-highlight-loop"
                d="M3,15 Q35,8 65,12 T97,14"
                stroke={color} 
                strokeWidth={strokeWidth} 
                fill="none" 
                strokeLinecap="round" 
                style={{ opacity: opacity }}
            />
        </svg>
    );
};

export default HighlightLine;