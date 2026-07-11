"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Crop, RotateCcw } from "lucide-react";

type CropData = { x: number; y: number; width: number; height: number };

type ImageCropperProps = {
  file: File | null;
  aspectRatio?: number; // width/height, e.g. 4/5 = 0.8
  onCrop: (crop: CropData | null) => void;
};

export default function ImageCropper({ file, aspectRatio = 4 / 5, onCrop }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState<CropData | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!file) {
      setImageUrl(null);
      setCrop(null);
      onCrop(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new window.Image();
    img.onload = () => {
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
      // Default crop: centered, max size with aspect ratio
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let cw: number, ch: number;
      if (imgAspect > aspectRatio) {
        ch = img.naturalHeight;
        cw = ch * aspectRatio;
      } else {
        cw = img.naturalWidth;
        ch = cw / aspectRatio;
      }
      const defaultCrop = {
        x: (img.naturalWidth - cw) / 2,
        y: (img.naturalHeight - ch) / 2,
        width: cw,
        height: ch,
      };
      setCrop(defaultCrop);
      onCrop(defaultCrop);
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file, aspectRatio]);

  // Calculate display scale
  useEffect(() => {
    if (!containerRef.current || !imgSize.w) return;
    const containerWidth = containerRef.current.clientWidth;
    setScale(Math.min(1, containerWidth / imgSize.w));
  }, [imgSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !crop) return;
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;

      const newX = Math.max(0, Math.min(imgSize.w - crop.width, crop.x + dx));
      const newY = Math.max(0, Math.min(imgSize.h - crop.height, crop.y + dy));

      const newCrop = { ...crop, x: newX, y: newY };
      setCrop(newCrop);
      onCrop(newCrop);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [dragging, crop, dragStart, scale, imgSize, onCrop]
  );

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const resetCrop = () => {
    if (!imgSize.w) return;
    const imgAspect = imgSize.w / imgSize.h;
    let cw: number, ch: number;
    if (imgAspect > aspectRatio) {
      ch = imgSize.h;
      cw = ch * aspectRatio;
    } else {
      cw = imgSize.w;
      ch = cw / aspectRatio;
    }
    const defaultCrop = {
      x: (imgSize.w - cw) / 2,
      y: (imgSize.h - ch) / 2,
      width: cw,
      height: ch,
    };
    setCrop(defaultCrop);
    onCrop(defaultCrop);
  };

  if (!imageUrl || !crop) return null;

  const displayW = imgSize.w * scale;
  const displayH = imgSize.h * scale;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-muted">
          <Crop className="h-3.5 w-3.5" /> Recadrer l&apos;image
        </p>
        <button
          type="button"
          onClick={resetCrop}
          className="flex items-center gap-1 text-xs text-muted hover:text-accent"
        >
          <RotateCcw className="h-3 w-3" /> Réinitialiser
        </button>
      </div>
      <div
        ref={containerRef}
        className="relative inline-block overflow-hidden rounded-sm border border-border"
        style={{ width: displayW, height: displayH, maxWidth: "100%" }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Aperçu"
          style={{ width: displayW, height: displayH }}
          className="block"
          draggable={false}
        />
        {/* Dark overlay outside crop */}
        <div
          className="absolute inset-0 bg-black/60 pointer-events-none"
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${crop.x * scale}px ${crop.y * scale}px, ${crop.x * scale}px ${(crop.y + crop.height) * scale}px, ${(crop.x + crop.width) * scale}px ${(crop.y + crop.height) * scale}px, ${(crop.x + crop.width) * scale}px ${crop.y * scale}px, ${crop.x * scale}px ${crop.y * scale}px)`,
          }}
        />
        {/* Crop area (draggable) */}
        <div
          className="absolute border-2 border-white/80 cursor-move"
          style={{
            left: crop.x * scale,
            top: crop.y * scale,
            width: crop.width * scale,
            height: crop.height * scale,
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-muted">
        Glissez la zone de recadrage pour ajuster. Ratio : {aspectRatio.toFixed(2)}
      </p>
    </div>
  );
}
