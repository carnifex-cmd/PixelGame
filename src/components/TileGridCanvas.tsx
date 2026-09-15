import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Scenario } from '../types/game';
import { generateSatelliteImage } from '../utils/satelliteImageGenerator';
import { audio } from '../utils/audio';

interface TileGridCanvasProps {
  scenario: Scenario;
  revealedTiles: Set<number>;
  onRevealTile: (tileIndex: number) => void;
  disabled?: boolean;
}

export const TileGridCanvas: React.FC<TileGridCanvasProps> = ({
  scenario,
  revealedTiles,
  onRevealTile,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const [activeShiftMode, setActiveShiftMode] = useState<'before' | 'after'>('before');

  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const afterImageRef = useRef<HTMLImageElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const gridSize = scenario.gridSize || 4;
  const totalTiles = gridSize * gridSize;

  // Preload and cache current challenge imagery
  useEffect(() => {
    setImagesLoaded(false);
    const baseImg = new Image();
    const baseDataUrl = generateSatelliteImage(scenario.imageKey);
    baseImg.src = baseDataUrl;
    baseImageRef.current = baseImg;

    let afterImg: HTMLImageElement | null = null;
    if (scenario.imageAfterKey) {
      afterImg = new Image();
      afterImg.src = generateSatelliteImage(scenario.imageAfterKey);
      afterImageRef.current = afterImg;
    } else {
      afterImageRef.current = null;
    }

    let loadedCount = 0;
    const required = afterImg ? 2 : 1;

    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= required) {
        setImagesLoaded(true);
      }
    };

    baseImg.onload = checkLoaded;
    if (afterImg) {
      afterImg.onload = checkLoaded;
    }

    // Default to 'before' for new round
    setActiveShiftMode('before');
  }, [scenario.id, scenario.imageKey, scenario.imageAfterKey]);

  // Main Canvas render loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded || !baseImageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 600;
    const tileSize = size / gridSize;

    // Pick active image (Before or After in Time Shift mode)
    const activeImg =
      activeShiftMode === 'after' && afterImageRef.current
        ? afterImageRef.current
        : baseImageRef.current;

    // Clear and draw base satellite image
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(activeImg, 0, 0, size, size);

    // Draw tile cover overlay for unrevealed tiles
    for (let i = 0; i < totalTiles; i++) {
      const isRevealed = revealedTiles.has(i);
      const isHovered = hoveredTile === i && !disabled && !isRevealed;

      const col = i % gridSize;
      const row = Math.floor(i / gridSize);
      const x = col * tileSize;
      const y = row * tileSize;

      if (!isRevealed) {
        // Tile background
        if (isHovered) {
          ctx.fillStyle = 'rgba(15, 30, 60, 0.96)';
        } else {
          ctx.fillStyle = 'rgba(7, 14, 28, 0.94)';
        }
        ctx.fillRect(x, y, tileSize, tileSize);

        // Tile inner border
        ctx.strokeStyle = isHovered ? '#00e5ff' : 'rgba(0, 229, 255, 0.2)';
        ctx.lineWidth = isHovered ? 2.5 : 1;
        ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

        // Coordinate Label (e.g. A1, B3)
        const colLetter = String.fromCharCode(65 + col);
        const rowNum = row + 1;
        const coordText = `${colLetter}${rowNum}`;

        ctx.font = `600 ${tileSize * 0.19}px 'Chakra Petch', sans-serif`;
        ctx.fillStyle = isHovered ? '#00e5ff' : 'rgba(148, 163, 184, 0.65)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(coordText, x + tileSize / 2, y + tileSize / 2);

        // Subtle crosshair tick in center
        ctx.strokeStyle = isHovered ? 'rgba(0, 229, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        const cx = x + tileSize / 2;
        const cy = y + tileSize / 2;
        const tLen = tileSize * 0.28;

        ctx.beginPath();
        ctx.moveTo(cx - tLen, cy);
        ctx.lineTo(cx - 14, cy);
        ctx.moveTo(cx + 14, cy);
        ctx.lineTo(cx + tLen, cy);
        ctx.moveTo(cx, cy - tLen);
        ctx.lineTo(cx, cy - 14);
        ctx.moveTo(cx, cy + 14);
        ctx.lineTo(cx, cy + tLen);
        ctx.stroke();
      } else {
        // Revealed tile thin subtle boundary
        ctx.strokeStyle = 'rgba(0, 245, 160, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }

    // Outer viewfinder border
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
  }, [gridSize, totalTiles, revealedTiles, hoveredTile, disabled, activeShiftMode, imagesLoaded]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Click & Hover Coordinate Calculations
  const getTileIndexAtEvent = (e: React.MouseEvent<HTMLCanvasElement>): number | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const scaleX = 600 / rect.width;
    const scaleY = 600 / rect.height;

    const canvasX = clientX * scaleX;
    const canvasY = clientY * scaleY;

    if (canvasX < 0 || canvasX >= 600 || canvasY < 0 || canvasY >= 600) return null;

    const tileSize = 600 / gridSize;
    const col = Math.floor(canvasX / tileSize);
    const row = Math.floor(canvasY / tileSize);

    if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
      return row * gridSize + col;
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const tileIndex = getTileIndexAtEvent(e);
    setHoveredTile(tileIndex);
  };

  const handleMouseLeave = () => {
    setHoveredTile(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const tileIndex = getTileIndexAtEvent(e);
    if (tileIndex !== null && !revealedTiles.has(tileIndex)) {
      audio.playTileReveal();
      onRevealTile(tileIndex);
    }
  };

  return (
    <div className="challenge-stage">
      <div className={`canvas-wrapper ${scenario.difficulty}`}>
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="satellite-canvas"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          title="Click to reveal tile [reduces available points]"
        />

        {/* Technical Satellite Sensor Overlay */}
        <div className="sensor-meta-chip">
          <span style={{ color: '#00f5a0' }}>●</span>
          {scenario.sensor.toUpperCase()} · {scenario.intendedBands}
        </div>

        <div className="meta-crop-tag">
          LOC: {scenario.crop}
        </div>

        {/* Time Shift Before / After Toggle if present */}
        {scenario.imageAfterKey && (
          <div className="time-shift-controls">
            <button
              type="button"
              className={`shift-btn ${activeShiftMode === 'before' ? 'active' : ''}`}
              onClick={() => {
                audio.playTileClick();
                setActiveShiftMode('before');
              }}
            >
              STATE A (PAST)
            </button>
            <button
              type="button"
              className={`shift-btn ${activeShiftMode === 'after' ? 'active' : ''}`}
              onClick={() => {
                audio.playTileClick();
                setActiveShiftMode('after');
              }}
            >
              STATE B (PRESENT)
            </button>
          </div>
        )}

        {/* Instruction Tip */}
        <div className="tile-tip-banner">
          {scenario.imageAfterKey
            ? 'COMPARE STATES & IDENTIFY CHANGE'
            : 'CLICK TILE TO REVEAL'}
        </div>
      </div>
    </div>
  );
};
