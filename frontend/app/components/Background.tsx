"use client";

export default function Background() {
  return (
    <div 
      className="absolute inset-0 min-h-screen overflow-hidden"
      style={{ backgroundColor: '#161316' }}
    >
      {/* Background with gradient and glowing circle */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, #161316, #161316, rgba(147, 109, 255, 0.2))'
        }}
      >
        {/* Main soft glowing circle at bottom - bouncing only */}
        <div 
          className="absolute rounded-full"
          style={{
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%) translateY(50%)',
            width: '800px',
            height: '800px',
            filter: 'blur(60px)',
            background: 'radial-gradient(circle, rgba(147, 109, 255, 0.4) 0%, rgba(147, 109, 255, 0.2) 50%, transparent 100%)',
            animation: 'bounce 2s ease-in-out infinite'
          }}
        ></div>
        
        {/* Static glow effect - top right */}
        <div 
          className="absolute rounded-full"
          style={{
            top: '25%',
            right: '25%',
            width: '400px',
            height: '400px',
            filter: 'blur(40px)',
            background: 'radial-gradient(circle, rgba(84, 163, 136, 0.3) 0%, transparent 100%)'
          }}
        ></div>
        
        {/* Static glow effect - bottom left */}
        <div 
          className="absolute rounded-full"
          style={{
            bottom: '25%',
            left: '25%',
            width: '300px',
            height: '300px',
            filter: 'blur(30px)',
            background: 'radial-gradient(circle, rgba(147, 109, 255, 0.25) 0%, transparent 100%)'
          }}
        ></div>

        {/* Additional static particles */}
        <div 
          className="absolute rounded-full"
          style={{
            top: '15%',
            left: '15%',
            width: '200px',
            height: '200px',
            filter: 'blur(20px)',
            background: 'radial-gradient(circle, rgba(147, 109, 255, 0.2) 0%, transparent 100%)'
          }}
        ></div>

        <div 
          className="absolute rounded-full"
          style={{
            top: '60%',
            right: '10%',
            width: '150px',
            height: '150px',
            filter: 'blur(15px)',
            background: 'radial-gradient(circle, rgba(84, 163, 136, 0.2) 0%, transparent 100%)'
          }}
        ></div>

        <div 
          className="absolute rounded-full"
          style={{
            bottom: '60%',
            right: '40%',
            width: '250px',
            height: '250px',
            filter: 'blur(25px)',
            background: 'radial-gradient(circle, rgba(147, 109, 255, 0.15) 0%, transparent 100%)'
          }}
        ></div>
      </div>
    </div>
  );
}
