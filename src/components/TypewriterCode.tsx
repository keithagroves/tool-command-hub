
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";

interface TypewriterCodeProps {
  code: string;
  title: string;
  badge: string;
  speed?: number;
}

const TypewriterCode: React.FC<TypewriterCodeProps> = ({ 
  code, 
  title, 
  badge, 
  speed = 50 
}) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timer = setTimeout(() => {
        setDisplayedCode(prev => prev + code[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, code, speed]);

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20 max-w-2xl mx-auto">
      <div className="text-left">
        <div className="flex items-center justify-between mb-4">
          <span className="text-cyan-400 font-mono text-sm">{title}</span>
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
            {badge}
          </Badge>
        </div>
        <pre className="text-white/90 font-mono text-sm leading-relaxed min-h-[72px]">
          {displayedCode}
          {currentIndex < code.length && (
            <span className="animate-pulse text-cyan-400">|</span>
          )}
        </pre>
      </div>
    </div>
  );
};

export default TypewriterCode;
