import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StorySegment {
  id: string;
  imageUrl: string;
  duration: number;
}

export interface Story {
  id: string;
  username: string;
  avatarUrl: string;
  segments: StorySegment[];
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const currentStory = stories[currentStoryIndex];
  const currentSegment = currentStory.segments[currentSegmentIndex];
  const segmentDuration = currentSegment.duration * 1000;
  
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextSegment = useCallback(() => {
    clearTimer();
    if (currentSegmentIndex < currentStory.segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentSegmentIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentSegmentIndex, currentStory, currentStoryIndex, stories.length, onClose, clearTimer]);

  const prevSegment = useCallback(() => {
    clearTimer();
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentSegmentIndex(stories[currentStoryIndex - 1].segments.length - 1);
      setProgress(100);
    } else {
      setProgress(0);
    }
  }, [currentSegmentIndex, currentStoryIndex, stories, clearTimer]);

  useEffect(() => {
    if (isPaused) {
      clearTimer();
      return;
    }

    const step = 100 / (segmentDuration / 50);
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextSegment();
          return 0;
        }
        return prev + step;
      });
    }, 50);

    return clearTimer;
  }, [currentSegmentIndex, isPaused, segmentDuration, nextSegment, clearTimer]);

  const handleTapLeft = () => prevSegment();
  const handleTapRight = () => nextSegment();

  const getProgressWidth = (segmentIdx: number) => {
    if (segmentIdx < currentSegmentIndex) return 100;
    if (segmentIdx > currentSegmentIndex) return 0;
    return progress;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black"
        onClick={onClose}
      >
        <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
          <img
            src={currentSegment.imageUrl}
            alt={`${currentStory.username}'s story`}
            className="w-full h-full object-cover"
          />

          <div 
            className="absolute inset-0"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div 
              className="absolute top-0 left-0 w-1/2 h-full"
              onClick={handleTapLeft}
            />
            <div 
              className="absolute top-0 right-0 w-1/2 h-full"
              onClick={handleTapRight}
            />
          </div>

          <div className="absolute top-0 left-0 right-0 p-4 pt-8">
            <div className="flex gap-1">
              {currentStory.segments.map((_, idx) => (
                <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-[width] duration-50"
                    style={{ width: `${getProgressWidth(idx)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-20 left-0 right-0 px-4 flex items-center gap-3">
            <img
              src={currentStory.avatarUrl}
              alt={currentStory.username}
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
            <span className="text-white font-bold text-sm">{currentStory.username}</span>
          </div>

          <button
            onClick={onClose}
            className="absolute top-8 right-4 w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          <div className="absolute bottom-8 left-4 right-4 flex justify-between items-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white text-xs font-medium">Segment {currentSegmentIndex + 1}/{currentStory.segments.length}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleTapLeft}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                disabled={currentStoryIndex === 0 && currentSegmentIndex === 0}
              >
                <span className="material-symbols-outlined">skip_previous</span>
              </button>
              <button
                onClick={handleTapRight}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">skip_next</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
