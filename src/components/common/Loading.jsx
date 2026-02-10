

const PageLoader = ({text = ""}) => {

    const PageLoaderStyles = {
        overlay: {
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(145, 187, 153, 0.6)',
            backdropFilter: 'blur(15px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 100000,
        },
        spinner: {
            height: '50px',
            width: 'max-content',
            fontSize: '26px',
            fontWeight: '600',
            letterSpacing: '.6em',
            color: '#F5F5F5',
            filter: 'drop-shadow(0 0 16px #fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: '.6em',
        },
    };

    return (
        <>
            <style>{`
                @keyframes loading6454 {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-24px); }
                }
            `}</style>

            <div style={PageLoaderStyles.overlay}>
                <div>
                    <div style={PageLoaderStyles.spinner}>
                        {['G', 'R', 'E', 'E', 'N', 'G', 'O'].map((char, index) => (
                            <span  
                                key={index} 
                                style={{ 
                                    animation: `loading6454 1.75s ease infinite`,
                                    animationDelay: `${index * 0.25}s` 
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </div>
                    <p className="text-center text-brown-300 mt-3 " >{text}</p>
                </div>
                
                
                
            </div>

        </>
    );

}

const MaskLoader = ({text = ""}) => {

    const maskLoaderStyles = {
        overlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(239, 239, 239, 0.398)', 
            backdropFilter: 'blur(1px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100000,
        },
        spinner: {
            width: '100px',
            height: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
        },
        dot: {
            width: '20px',
            height: '20px',
            borderRadius: '100%',
            backgroundColor: '#4D7135',
            opacity: 0,
        }
    };

    return (
        <>
            <style>{`
                @keyframes fade {
                    0%, 100% { opacity: 1; }
                    60% { opacity: 0; }
                }
            `}</style>

            <div style={maskLoaderStyles.overlay}>
                <div>
                <div style={maskLoaderStyles.spinner}>
                    {[0, 1, 2].map((i) => (
                        <span 
                            key={i}
                            style={{
                                ...maskLoaderStyles.dot,
                                animation: 'fade 1s ease-in-out infinite',
                                animationDelay: `${i * 0.33}s` 
                            }}
                        />
                    ))}
                </div>
                <p className="text-center text-brown-300 mt-1 " >{text}</p>
                </div>
            </div>
        </>
    );
};

const ButtonLoader = ({className}) => {

    return (<>
        <span class={`spinner-border spinner-border-sm ${className}` }  
            role="status" aria-hidden="true">
        </span>
    </>);
};

const Loader = ({
        mode="page",
        text="",
        className,

    }) => {

    const loadingMode = {
        page: <PageLoader text={text}/>,
        mask: <MaskLoader text={text}/>,
        button: <ButtonLoader className={className} />,
    }

    return loadingMode[mode] || null ;
}

export default Loader ;


