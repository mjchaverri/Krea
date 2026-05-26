import { useRef } from 'react';

/**
 * Drag-to-pan for CSS background-image divs.
 * - Mutates DOM directly during drag for 60fps smoothness (no re-renders).
 * - Calls onSave(posString) on mouseup only if the user actually dragged.
 * - Does nothing if no imageUrl.
 */
export function useImagePan(imageUrl, position, onSave) {
    const dragRef    = useRef(null);
    const movedRef   = useRef(false);
    const onSaveRef  = useRef(onSave);
    onSaveRef.current = onSave;

    const onMouseDown = (e) => {
        if (!imageUrl) return;
        if (e.target.closest('button, textarea, input')) return;

        const el   = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const parts = (position || '50% 50%').split(' ');
        const startPosX = parseFloat(parts[0]) || 50;
        const startPosY = parseFloat(parts[1]) || 50;

        e.preventDefault(); // prevent text-selection while dragging
        movedRef.current = false;

        dragRef.current = {
            el,
            startX: e.clientX,
            startY: e.clientY,
            startPosX,
            startPosY,
            w: rect.width,
            h: rect.height,
            lastX: startPosX,
            lastY: startPosY,
        };

        const onMove = (me) => {
            const d = dragRef.current;
            if (!d) return;
            const dx = me.clientX - d.startX;
            const dy = me.clientY - d.startY;
            if (!movedRef.current && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;

            movedRef.current = true;
            d.lastX = Math.min(100, Math.max(0, d.startPosX - dx / d.w * 100));
            d.lastY = Math.min(100, Math.max(0, d.startPosY - dy / d.h * 100));
            d.el.style.backgroundPosition = `${d.lastX}% ${d.lastY}%`;
        };

        const onUp = () => {
            const d = dragRef.current;
            if (movedRef.current && d) {
                onSaveRef.current(`${d.lastX.toFixed(1)}% ${d.lastY.toFixed(1)}%`);
            }
            dragRef.current = null;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    return {
        onMouseDown,
        /** Call this at the start of onClick to cancel activation when a drag just ended. */
        consumeClick: () => {
            if (movedRef.current) { movedRef.current = false; return true; }
            return false;
        },
        cursor: imageUrl ? 'grab' : undefined,
    };
}
