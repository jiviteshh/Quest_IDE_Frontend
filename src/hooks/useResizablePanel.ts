/**
 * useResizablePanel.ts
 * ─────────────────────────────────────────────────────────────
 * Lightweight resizable panel hook using mouse/pointer events.
 * Returns a ref for the drag handle and current size %.
 *
 * Does NOT use any external library.
 * Does NOT touch execution flow.
 * ─────────────────────────────────────────────────────────────
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Direction = "horizontal" | "vertical";

type UseResizablePanelOptions = {
  direction: Direction;
  initialPercent: number;
  minPercent?: number;
  maxPercent?: number;
  /** Container element ref — needed to calculate relative position */
  containerRef: React.RefObject<HTMLElement | null>;
  onResize?: (percent: number) => void;
};

export function useResizablePanel({
  direction,
  initialPercent,
  minPercent = 20,
  maxPercent = 80,
  containerRef,
  onResize,
}: UseResizablePanelOptions) {
  const [percent, setPercent] = useState(initialPercent);
  const isDragging = useRef(false);

  const clamp = useCallback(
    (value: number) => Math.min(maxPercent, Math.max(minPercent, value)),
    [minPercent, maxPercent],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      isDragging.current = true;
      document.body.style.cursor =
        direction === "horizontal" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
    },
    [direction],
  );

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (!isDragging.current || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newPercent: number;

      if (direction === "horizontal") {
        newPercent = ((event.clientX - rect.left) / rect.width) * 100;
      } else {
        newPercent = ((event.clientY - rect.top) / rect.height) * 100;
      }

      const clamped = clamp(newPercent);
      setPercent(clamped);
      onResize?.(clamped);
    }

    function handleMouseUp() {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [direction, clamp, containerRef, onResize]);

  // Sync when initialPercent changes externally (e.g. restore from storage)
  useEffect(() => {
    setPercent(clamp(initialPercent));
  }, [initialPercent, clamp]);

  return { percent, handleMouseDown, isDragging: isDragging.current };
}
