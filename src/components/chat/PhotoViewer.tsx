import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface PhotoViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoViewer({ images, initialIndex, onClose }: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const touchStartX = useRef<number>(0);

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasMultiple) goNext();
      if (e.key === 'ArrowLeft' && hasMultiple) goPrev();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.25, 3));
      if (e.key === '-') setZoom((z) => Math.max(z - 0.25, 0.5));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goNext, goPrev, hasMultiple]);

  // Mouse drag for panning when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50 && hasMultiple) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = currentImage;
    a.download = `chat-image-${currentIndex + 1}`;
    a.target = '_blank';
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-sm"
      style={{ animation: 'fadeInViewer 0.2s ease' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/60 shrink-0">
        <span className="text-white/60 text-sm font-medium">
          {hasMultiple ? `${currentIndex + 1} / ${images.length}` : 'Photo'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white/50 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Reset zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-red-500/80 rounded-lg transition-colors ml-2"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        {/* Prev button */}
        {hasMultiple && (
          <button
            onClick={goPrev}
            className="absolute left-3 z-10 p-2.5 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm border border-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          key={currentImage}
          src={currentImage}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
            animation: 'fadeInImg 0.25s ease',
          }}
          draggable={false}
        />

        {/* Next button */}
        {hasMultiple && (
          <button
            onClick={goNext}
            className="absolute right-3 z-10 p-2.5 bg-black/40 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm border border-white/10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip for multiple images */}
      {hasMultiple && (
        <div className="flex items-center justify-center gap-2 p-3 bg-black/60 overflow-x-auto shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setZoom(1); setOffset({ x: 0, y: 0 }); }}
              className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                i === currentIndex ? 'border-emerald-400 scale-110' : 'border-white/20 opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInViewer { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInImg { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
