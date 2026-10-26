# Apple Design Manifest by Emil Kowalski

1. Direct Manipulation: Use pointer events with near-zero latency. Interface must track fingers 1:1.
2. Spring Physics: No fixed durations. Use fluid spring math (Damping and Response parameters).
   - Default Damping: 1.0 (smooth deceleration, zero bounce for steady windows).
   - Momentum Bounce: Damping 0.8 only when swipe velocity triggers momentum fling/throw.
   - Response: 0.3s for popups/sheets, 0.4s for picture-in-picture/draggables.
3. Rubber-banding: Implement non-linear progressive resistance at boundaries. No hard stops.
4. Translucent Chrome: Use high-quality backdrop-filter (blur/saturate) for menus and navigation bars.
5. Frame-level Smoothness: Animate composite properties only (transform, opacity) with will-change hints.
6. Reduced Motion: Support `prefers-reduced-motion` natively (replace springs with quick 150ms opacity fades).
7. High Contrast: Support `prefers-contrast` by switching translucent shadows to crisp 1px borders.