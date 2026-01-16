import { useState, useRef, ReactNode } from "react";
import { motion, useAnimation } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

const PULL_THRESHOLD = 80;
const MAX_PULL = 120;

export function PullToRefresh({ children, onRefresh, className }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      const distance = Math.min(diff * 0.5, MAX_PULL);
      setPullDistance(distance);
      controls.set({ y: distance });
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      controls.start({ y: 60 });
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        controls.start({ y: 0 });
      }
    } else {
      setPullDistance(0);
      controls.start({ y: 0 });
    }
  };

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const showIndicator = pullDistance > 10 || isRefreshing;

  return (
    <div 
      ref={containerRef}
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div 
        className="flex justify-center items-center overflow-hidden transition-all duration-200"
        style={{ 
          height: showIndicator ? Math.max(pullDistance, isRefreshing ? 60 : 0) : 0,
          opacity: showIndicator ? 1 : 0
        }}
      >
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : progress * 180 }}
          transition={{ 
            duration: isRefreshing ? 1 : 0, 
            repeat: isRefreshing ? Infinity : 0,
            ease: "linear"
          }}
          className="text-primary"
        >
          <Loader2 className="h-6 w-6" />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div animate={controls} transition={{ type: "spring", damping: 20, stiffness: 300 }}>
        {children}
      </motion.div>
    </div>
  );
}
