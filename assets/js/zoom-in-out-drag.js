jQuery(document).ready(function () {
  let scale = 1;
  const scaleStep = 0.15;
  const minScale = 1;
  const maxScale = 3.0;
  let isDragging = false;
  let currentSelector;
  let startX,
    startY,
    initialPosX = 0,
    initialPosY = 0;
  // Zoom In
  jQuery(".imh-6310-zoom-in").click(function () {
    if (!isDragging && scale < maxScale) {
      scale += scaleStep;
      jQuery(this)
        .closest(".imh-6310-annotation-box-wrapper")
        .find(".imh-6310-annotation-box-inner")
        .css(
          "transform",
          "translate(" +
            initialPosX +
            "px, " +
            initialPosY +
            "px) scale(" +
            scale +
            ")"
        );
    }
  });

  // Zoom Out
  jQuery(".imh-6310-zoom-out").click(function () {
    if (!isDragging && scale > minScale) {
      const scaleOffset = scale - 1;
      scale -= scaleStep;

      initialPosX =
        Math.sign(initialPosX) *
        Math.max(
          0,
          Math.abs(initialPosX) -
            (Math.abs(initialPosX) / scaleOffset) * scaleStep
        );
      initialPosY =
        Math.sign(initialPosY) *
        Math.max(
          0,
          Math.abs(initialPosY) -
            (Math.abs(initialPosY) / scaleOffset) * scaleStep
        );

      jQuery(this)
        .closest(".imh-6310-annotation-box-wrapper")
        .find(".imh-6310-annotation-box-inner")
        .css(
          "transform",
          "translate(" +
            initialPosX +
            "px, " +
            initialPosY +
            "px) scale(" +
            scale +
            ")"
        );
    }
  });

  // Start Dragging
  jQuery(".imh-6310-annotation-box-inner").on(
    "mousedown touchstart",
    function (e) {
      currentSelector = jQuery(this);
      isDragging = true;
      startX = e.pageX || e.originalEvent.touches[0].pageX;
      startY = e.pageY || e.originalEvent.touches[0].pageY;
      if (jQuery(window).width() > 991) {
        e.preventDefault(); // Prevent default behavior to avoid any unexpected interactions
      }
    }
  );

  // Perform Dragging
  jQuery(document).on("mousemove touchmove", function (e) {
    if (isDragging) {
      const height = currentSelector.height();
      const width = currentSelector.width();

      let moveX = (e.pageX || e.originalEvent.touches[0].pageX) - startX;
      let moveY = (e.pageY || e.originalEvent.touches[0].pageY) - startY;
      startX = e.pageX || e.originalEvent.touches[0].pageX;
      startY = e.pageY || e.originalEvent.touches[0].pageY;

      const scaledWidthOffset = (width * scale - width) / 2;
      const scaledHeightOffset = (height * scale - height) / 2;

      if (Math.abs(initialPosX + moveX) < scaledWidthOffset) {
        initialPosX += moveX;
      } else {
        initialPosX = Math.sign(initialPosX) * scaledWidthOffset;
      }
      if (Math.abs(initialPosY + moveY) < scaledHeightOffset) {
        initialPosY += moveY;
      } else {
        initialPosY = Math.sign(initialPosY) * scaledHeightOffset;
      }

      currentSelector.css({
        transform:
          "translate(" +
          initialPosX +
          "px, " +
          initialPosY +
          "px) scale(" +
          scale +
          ")",
      });
    }
  });

  // End Dragging
  jQuery(document).on("mouseup touchend", function () {
    isDragging = false;
  });
});
