"use client";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-ink">
      {/* Background with gradient and glowing circle */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-primary/20">
        {/* Soft glowing circle at bottom */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(147, 109, 255, 0.3) 0%, rgba(147, 109, 255, 0.1) 50%, transparent 100%)'
          }}
        ></div>
        
        {/* Additional subtle glow effects */}
        <div 
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(84, 163, 136, 0.2) 0%, transparent 100%)'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full blur-xl"
          style={{
            background: 'radial-gradient(circle, rgba(147, 109, 255, 0.15) 0%, transparent 100%)'
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Track and Manage Your{" "}
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(to right, #936DFF, #54A388)'
              }}
            >
              Coding Interviews
            </span>{" "}
            Like a Pro
          </h1>

          {/* Sub headline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-muted mb-12 max-w-3xl mx-auto leading-relaxed">
            A clean, secure platform to track problems and applications. 
            Organize your coding journey with powerful tools designed for developers.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="w-full sm:w-auto px-8 py-4 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: '#936DFF',
                boxShadow: '0 0 0 0 rgba(147, 109, 255, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(147, 109, 255, 0.9)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(147, 109, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#936DFF';
                e.currentTarget.style.boxShadow = '0 0 0 0 rgba(147, 109, 255, 0.25)';
              }}
            >
              Sign Up
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
