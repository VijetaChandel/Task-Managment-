import React from 'react';

const HandshakeAnimation = () => {
    return (
        <div style={{ width: '200px', height: '120px', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <svg width="180" height="100" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <style>
                    {`
            @keyframes leftHandMove {
              0% { transform: translateX(-10px) rotate(0deg); }
              50% { transform: translateX(0px) rotate(-5deg); }
              100% { transform: translateX(-10px) rotate(0deg); }
            }
            @keyframes rightHandMove {
              0% { transform: translateX(10px) rotate(0deg); }
              50% { transform: translateX(0px) rotate(5deg); }
              100% { transform: translateX(10px) rotate(0deg); }
            }
            @keyframes shake {
              0%, 100% { transform: translateY(0); }
              25% { transform: translateY(-5px); }
              75% { transform: translateY(5px); }
            }
            .left-hand { animation: leftHandMove 2s infinite ease-in-out; }
            .right-hand { animation: rightHandMove 2s infinite ease-in-out; }
            .shake-group { animation: shake 1s infinite ease-in-out; transform-origin: center; }
          `}
                </style>

                <g className="shake-group">
                    {/* Left Arm/Hand */}
                    <path className="left-hand" d="M10 50C10 50 40 40 60 50C80 60 90 55 95 50" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round" />
                    {/* Right Arm/Hand */}
                    <path className="right-hand" d="M170 50C170 50 140 40 120 50C100 60 90 55 85 50" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round" />

                    {/* Connection Point (Glow) */}
                    <circle cx="90" cy="50" r="4" fill="white">
                        <animate attributeName="r" values="4;8;4" dur="1s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                    </circle>
                </g>
            </svg>
        </div>
    );
};

export default HandshakeAnimation;
