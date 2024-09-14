import React from 'react';
import { WinbaUi } from '.'; // Changed from GambaUi to WinbaUi
import useAnimationFrame from './hooks/useAnimationFrame';

export function EffectTest({ src }: { src: string }) {
  const parts = React.useRef(
    Array.from({ length: 25 }).map(() => ({
      x: Math.random(),
      y: -Math.random() * 600,
    }))
  );

  const image = React.useMemo(() => {
    const img = document.createElement('img');
    img.src = src;
    return img;
  }, [src]);

  useAnimationFrame(() => {
    parts.current.forEach((part, i) => {
      const speed = (1 + Math.sin(i * 44213.3) * 0.1) * 5;
      part.y += speed;
    });
  });

  return (
    <WinbaUi.Canvas
      zIndex={99}
      style={{ pointerEvents: 'none' }}
      render={({ ctx, size }, clock) => {
        ctx.save();
        ctx.clearRect(0, 0, size.width, size.height);
        ctx.fillStyle = '#00000011';
        ctx.fillRect(0, 0, size.width, size.height);

        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#22ff11';
        parts.current.forEach((part, i) => {
          ctx.save();
          ctx.translate(part.x * size.width, size.height - part.y - 25);
          ctx.scale(0.5, 0.5);
          ctx.drawImage(image, 0, 0);
          ctx.restore();
        });
        ctx.restore();
      }}
    />
  );
}
