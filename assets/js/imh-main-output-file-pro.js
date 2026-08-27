window.loaded = true;
let ima6310Timeout;
let ima6310LastId = "";
var imhPointerType = 0;

window.initialWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

// This code is loaded after the page is fully loaded or reach in the viewPort Start

function imh_6310_isInViewport(element) {
  const elementTop = element.offset().top;
  const elementBottom = elementTop + element.outerHeight();

  const viewportTop = jQuery(window).scrollTop();
  const viewportBottom = viewportTop + jQuery(window).height();

  return elementBottom > viewportTop && elementTop < viewportBottom;
}

function imh_6310_onAnnotationInView() {
  console.log("Element reached viewport");

  imh_6310_init();

  setTimeout(function () {
    jQuery(".imh-6310-hover-content").each(function () {
      jQuery("body").append(jQuery(this).clone());
      jQuery(this).remove();
    });
    jQuery(".imh-6310-modal").each(function () {
      jQuery("body").append(jQuery(this).clone());
      jQuery(this).remove();
    });
  }, 300);

  setTimeout(function () {
    imh_6310_slider_init();
  }, 300);
  window.loaded = false;
  // Your function here
}

jQuery(window).on("load", function () {
  imh_6310_onAnnotationInView();
  setTimeout(function () {
    mh_6310_adjust_position();
  }, 500);
});

window.addEventListener("resize", function (event) {
  imh_6310_adjust_position();
});
// This code is loaded after the page is fully loaded or reach in the viewPort End

function imh_6310_init() {
  //Default load set
  setTimeout(function () {
    jQuery("div[data-json]").each(function () {
      if (
        jQuery(this).attr("data-always-show") == 1 &&
        window.innerWidth > 768
      ) {
        jQuery(this).trigger("mouseenter");
      }
    });
    imh_6310_load_modal_image();
  }, 700);
  setTimeout(function () {
    jQuery(".imh-6310-drag").each(function () {
      let that = jQuery(this);
      let pointId = that.attr("data-id");
      let id = that.closest(".imh-6310-annotation-box").attr("data-id");
      imh_6310_setTooltipPosition(jQuery(this), pointId, id);
    });
    jQuery(".imh-6310-hover-content").each(function () {
      if (
        jQuery(this).attr("data-always-show") == 1 &&
        window.innerWidth > 768
      ) {
        jQuery(this).css("transform", "scale(1)");
      } else {
        jQuery(this).css("transform", "scale(0)");
        jQuery(this).hide();
        const closestShortCode = jQuery(this).closest(
          ".imh-6310-plugin-shortcode"
        );
        if (closestShortCode.length) {
          closestShortCode.css("display", "none");
        }
      }
    });

    let hoverContent = jQuery(".imh-6310-hover-content iframe");
    if (hoverContent.length) {
      hoverContent.each(function () {
        jQuery(this)
          .closest(".imh-6310-template-02-hover-content")
          .removeAttr("style");
      });
    }

    jQuery(".imh-6310-drag").each(function () {
      let type = Number(
        jQuery(this)
          .closest(".imh-6310-annotation-box")
          .attr("data-display-type")
      );

      if (type === 1) {
        jQuery(this)
          .on("click touchstart", function () {
            clearTimeout(ima6310Timeout);
            let pointId = jQuery(this).attr("data-id");
            let id = jQuery(this)
              .closest(".imh-6310-annotation-box")
              .attr("data-id");
            let alwaysShow =
              jQuery(this).attr("data-always-show") == 1 &&
              window.initialWidth > 768
                ? 1
                : 2;
            imh_6310_setTooltipPosition(jQuery(this), pointId, id, alwaysShow);
            if (ima6310LastId && ima6310LastId != pointId) {
              jQuery(".imh-6310-hover-content").each(function () {
                if (
                  jQuery(this).attr("data-always-show") == 1 &&
                  window.innerWidth > 768
                ) {
                  jQuery(this).css("transform", "scale(1)");
                } else {
                  jQuery(this).css("transform", "scale(0)");
                  const closestShortCode = jQuery(this).closest(
                    ".imh-6310-plugin-shortcode"
                  );
                  if (closestShortCode.length) {
                    closestShortCode.css("display", "none");
                  }
                }
              });
            }
            ima6310LastId = pointId;
            jQuery(".imh-6310-hover-content-" + id + "-" + pointId)
              .stop()
              .css("transform", "scale(1)");

            jQuery(".imh-6310-hover-content-" + id + "-" + pointId).show();
            imh_6310_slider_reset(
              jQuery(".imh-6310-popup-" + id + "-" + pointId).length
                ? jQuery(".imh-6310-popup-" + id + "-" + pointId)
                : jQuery(".imh-6310-hover-content-" + id + "-" + pointId)
            );
          })
          .mouseout(function () {
            imh_6310_hide();
          });
      } else {
        jQuery(this)
          .on("mouseover touchstart", function () {
            clearTimeout(ima6310Timeout);
            let pointId = jQuery(this).attr("data-id");
            let id = jQuery(this)
              .closest(".imh-6310-annotation-box")
              .attr("data-id");
            let alwaysShow =
              jQuery(this).attr("data-always-show") == 1 &&
              window.initialWidth > 768
                ? 1
                : 2;
            imh_6310_setTooltipPosition(jQuery(this), pointId, id, alwaysShow);
            if (ima6310LastId && ima6310LastId != pointId) {
              jQuery(".imh-6310-hover-content").each(function () {
                if (
                  jQuery(this).attr("data-always-show") == 1 &&
                  window.innerWidth > 768
                ) {
                  jQuery(this).css("transform", "scale(1)");
                } else {
                  jQuery(this).css("transform", "scale(0)");
                  const closestShortCode = jQuery(this).closest(
                    ".imh-6310-plugin-shortcode"
                  );
                  if (closestShortCode.length) {
                    closestShortCode.css("display", "none");
                  }
                }
              });
            }
            ima6310LastId = pointId;
            jQuery(".imh-6310-hover-content-" + id + "-" + pointId)
              .stop()
              .css("transform", "scale(1)");

            jQuery(".imh-6310-hover-content-" + id + "-" + pointId).show();
            imh_6310_slider_reset(
              jQuery(".imh-6310-popup-" + id + "-" + pointId).length
                ? jQuery(".imh-6310-popup-" + id + "-" + pointId)
                : jQuery(".imh-6310-hover-content-" + id + "-" + pointId)
            );
          })
          .on("mouseout", function () {
            imh_6310_hide();
          });
      }
    });

    jQuery(".imh-6310-hover-content")
      .on("mouseover touchstart", function () {
        clearTimeout(ima6310Timeout);
      })
      .mouseout(function () {
        imh_6310_hide();
      });
  }, 500);

  //Popup Open
  var clicked = false;
  jQuery("body").on(
    "click touchstart",
    ".imh-6310-drag, .imh-6310-drag .imh-6310-point-icons",
    function () {
      let directLink = jQuery(this)
        .closest(".imh-6310-drag")
        .attr("data-link-url");

      if (!clicked) {
        if (directLink != undefined && directLink != null) {
          let target = jQuery(this).closest(".imh-6310-drag").attr("target");
          if (target != undefined && target != null) {
            window.open(directLink, "_blank");
            window.focus();
          } else {
            window.location.href = directLink;
          }
        }
        clicked = true;
        setTimeout(function () {
          clicked = false;
        }, 100);
      }

      let dataId =
        jQuery(this).closest(".imh-6310-annotation-box").attr("data-id") +
        "-" +
        jQuery(this).closest(".imh-6310-drag").attr("data-id");

      let selector = jQuery(".imh-6310-popup-" + dataId);
      if (selector.length) {
        selector = selector.first();
        jQuery(".imh-6310-hover-content-" + dataId).css({
          transform: "scale(0)",
        });
        const closestShortCode = jQuery(
          ".imh-6310-hover-content-" + dataId
        ).closest(".imh-6310-plugin-shortcode");
        if (closestShortCode.length) {
          closestShortCode.css("display", "none");
        }
        let width = selector.find("iframe").attr("width");
        let height = selector.find("iframe").attr("height");
        let windowWidth = jQuery(window).width();

        if (!width) {
          width = windowWidth > 700 ? 700 : windowWidth;
          height = windowWidth > 700 ? 490 : "auto";
        } else if (windowWidth < width) {
          windowWidth -= 20;
          height = (windowWidth * height) / width;
          width = windowWidth;
        }

        selector.find("iframe").css({
          width: width + "px",
          height: height + "px",
        });
        selector.css({
          display: "block",
        });
        selector.find(".imh-6310-modal-content").css({
          display: "block",
          width: width + "px",
          height: height + "px",
        });
        jQuery("body").css({
          overflow: "hidden",
        });
      }
    }
  );

  jQuery("body").on("click touchstart", ".imh-6310-close-button", function () {
    jQuery(".imh-6310-modal").css({
      display: "none",
    });
    jQuery("body").css({
      overflow: "initial",
    });
    var attr = jQuery(this).closest(".imh-6310-modal").attr("data-modal-layer");
    if (typeof attr !== "undefined" && attr !== false) {
      jQuery(this).closest(".imh-6310-modal").remove();
    } else {
      jQuery("body").css({
        overflow: "initial",
      });

      let src = jQuery(this)
        .closest(".imh-6310-modal")
        .find("iframe")
        .attr("src");
      jQuery(this).closest(".imh-6310-modal").find("iframe").attr("src", "");
      jQuery(this).closest(".imh-6310-modal").find("iframe").attr("src", src);
    }

    let src = jQuery(this)
      .closest(".imh-6310-modal")
      .find("iframe")
      .attr("src");
    jQuery(this).closest(".imh-6310-modal").find("iframe").attr("src", "");
    jQuery(this).closest(".imh-6310-modal").find("iframe").attr("src", src);
  });

  //Hover iFrame tooltip responsive
  let hoverContent = jQuery(
    ".imh-6310-hover-content .imh-6310-template-02 iframe"
  );
  if (hoverContent.length) {
    hoverContent.each(function () {
      let iframeWidth = jQuery(this).attr("width");
      let iframeHeight = jQuery(this).attr("height");
      let deviceWidth = jQuery(window).width();
      iframeWidth =
        iframeWidth != undefined && iframeWidth != 0 && iframeWidth != ""
          ? iframeWidth
          : 496;
      iframeHeight =
        iframeHeight != undefined && iframeHeight != 0 && iframeHeight != ""
          ? iframeHeight
          : 397;

      if (deviceWidth < iframeWidth) {
        iframeHeight = (iframeHeight * deviceWidth) / iframeWidth;
        jQuery(this).attr("width", deviceWidth);
        jQuery(this).attr("height", iframeHeight);
      }
    });
  }

  imh6310RemoveLazyLoad(1000);
  imh6310RemoveLazyLoad(2000);
  imh6310RemoveLazyLoad(5000);
  imh6310RemoveLazyLoad(10000);
  setTimeout(function () {
    imh_6310_adjust_position();
  }, 500);

  jQuery("body").on("click", ".imh-6310-close-button-mobile", function () {
    let hoverContent = jQuery(".imh-6310-hover-content iframe");
    if (hoverContent.length) {
      hoverContent.each(function () {
        jQuery(this)
          .closest(".imh-6310-template-02-hover-content")
          .removeAttr("style");
      });
    }
    jQuery(".imh-6310-hover-content").css({ transform: "scale(0)" });
    const closestShortCode = jQuery(".imh-6310-plugin-shortcode");
    if (closestShortCode.length) {
      closestShortCode.css("display", "none");
    }
  });
}

function imh_6310_adjust_position() {
  let windowWidth = jQuery(window).width();
  jQuery(".imh-6310-drag").each(function () {
    let annotationWidth = jQuery(this)
      .closest(".imh-6310-annotation-box")
      .width();
    let annotationHeight = jQuery(this)
      .closest(".imh-6310-annotation-box")
      .height();
    let jsonData = jQuery(this).attr("data-json");
    jsonData = JSON.parse(jsonData);
    let calData =
      (Number(jsonData.iconWidth) * annotationWidth) / Number(jsonData.tWidth);

    let mobileFaIconSize = jsonData.fontAwesomIconSizeInMobile
      ? jsonData.fontAwesomIconSizeInMobile
      : jsonData.fontAwesomIconSize;
    if (windowWidth >= 768 && windowWidth < 1400) {
      mobileFaIconSize = jsonData.fontAwesomIconSizeInIpad || mobileFaIconSize;
    }

    let mobileIconSize = jsonData.fontAwesomIconSizeInMobile
      ? jsonData.fontAwesomIconSizeInMobile
      : jsonData.fontAwesomIconSize;
    let iconDivide = 2.1;
    if (windowWidth >= 768 && windowWidth < 1400) {
      mobileIconSize = jsonData.imgOrIconSizeInIpad || mobileIconSize;
      iconDivide = 3;
    }

    let adjustWidth = 0;
    if (jsonData.iconType == 1) {
      adjustWidth =
        windowWidth < 1400
          ? parseInt(
              (jsonData.fontAwesomIconSize - mobileFaIconSize) / iconDivide
            )
          : 0;
    } else if (jsonData.iconType == 2) {
      adjustWidth =
        windowWidth < 768
          ? parseInt((jsonData.imgOrIconSize - mobileIconSize) / iconDivide)
          : 0;
    }

    if (
      typeof jsonData.tHeight === "undefined" ||
      jsonData.tHeight == "0" ||
      jsonData.tHeight == 0 ||
      jsonData.tHeight == "" ||
      jsonData.iconType == 3
    ) {
      if (annotationWidth > Number(jsonData.iconWidth)) {
        calData = calData / 2 - Number(jsonData.iconWidth) / 2;

        jQuery(this).attr(
          "style",
          "left: calc(" +
            jsonData.xPos +
            "% + " +
            calData +
            "px + " +
            adjustWidth +
            "px) !important; bottom: " +
            jsonData.yPos +
            "%; display: inline-block;"
        );
      } else {
        calData = calData / 2;
        jQuery(this).attr(
          "style",
          "left: calc(" +
            jsonData.xPos +
            "% - " +
            calData +
            "px + " +
            adjustWidth +
            "px) !important; bottom: " +
            jsonData.yPos +
            "%; display: inline-block;"
        );
      }
    } else {
      const original = {
        width: Number(jsonData.tWidth),
        height: Number(jsonData.tHeight),
        x: Number(jsonData.xPos),
        y: Number(jsonData.yPos),
      };
      const target = { width: annotationWidth, height: annotationHeight };
      const result = imh_6310_calculateCorrectPosition(
        original,
        target,
        Number(jsonData.iconWidth),
        { width: jQuery(this).width(), height: jQuery(this).height() }
      );

      let adjustX = 0;
      let adjustY = 0;
      if (
        jsonData.iconType == 1 &&
        jQuery(this).width() !== jQuery(this).height()
      ) {
        let deviceAdjust = 0;
        if (windowWidth >= 768 && windowWidth < 1400) {
          deviceAdjust =
            jsonData.iconWidth -
            (jsonData.fontAwesomIconSizeInIpad || jsonData.fontAwesomIconSize);
        }
        deviceAdjust = deviceAdjust / 2;

        if (jQuery(this).height() > jQuery(this).width()) {
          adjustY = (jQuery(this).height() - jQuery(this).width()) / 2;
          adjustY =
            (target.height * adjustY) / original.height +
            (target.height * deviceAdjust) / original.height;
        } else {
          adjustX = (jQuery(this).width() - jQuery(this).height()) / 2;
          adjustX =
            (target.width * adjustX) / original.width +
            (target.width * deviceAdjust) / original.width;
        }
      }

      jQuery(this)[0].style.setProperty(
        "left",
        "calc(" + result.x + "% + " + adjustX + "px)",
        "important"
      );

      jQuery(this)[0].style.setProperty(
        "bottom",
        "calc(" + result.y + "% + " + adjustY + "px)"
      );
    }
    jQuery(this).css("visibility", "visible");
  });
}

function imh_6310_calculateCorrectPosition(
  original,
  target,
  originalSize,
  currentSize
) {
  // STEP 1: Convert original top-left (%) → pixel (original image space)
  const origLeftPx = (original.x / 100) * original.width;
  const origTopPx = (original.y / 100) * original.height;

  // STEP 2: Get CENTER in original image space
  const centerX = origLeftPx + originalSize / 2;
  const centerY = origTopPx + originalSize / 2;

  // STEP 3: Convert center → ratio (0–1)
  const ratioX = centerX / original.width;
  const ratioY = centerY / original.height;

  // STEP 4: Map center to TARGET image
  const targetCenterX = ratioX * target.width;
  const targetCenterY = ratioY * target.height;

  // STEP 5: Convert center → top-left using CURRENT size
  const newLeftPx = targetCenterX - currentSize.width / 2;
  const newTopPx = targetCenterY - currentSize.height / 2;

  // STEP 6: Convert back → %
  return {
    x: +((newLeftPx / target.width) * 100).toFixed(4),
    y: +((newTopPx / target.height) * 100).toFixed(4),
  };
}

function imh_6310_hide() {
  ima6310Timeout = setTimeout(
    function () {
      jQuery(".imh-6310-hover-content").each(function () {
        if (
          jQuery(this).attr("data-always-show") == 1 &&
          window.innerWidth > 768
        ) {
          jQuery(this).css("transform", "scale(1)");
        } else {
          jQuery(this).css("transform", "scale(0)");
          const closestShortCode = jQuery(this).closest(
            ".imh-6310-plugin-shortcode"
          );
          if (closestShortCode.length) {
            closestShortCode.css("display", "none");
          }
        }
      });

      let hoverContent = jQuery(".imh-6310-hover-content iframe");
      if (hoverContent.length) {
        hoverContent.each(function () {
          let that = jQuery(this);
          setTimeout(function () {
            that
              .closest(".imh-6310-template-02-hover-content")
              .removeAttr("style");
          }, 700);
          let src = jQuery(this).attr("src");
          if (src.includes("youtube") || src.includes("vimeo")) {
            jQuery(this).attr("src", "");
            jQuery(this).attr("src", src);
          }
        });
      }
    },
    imhPointerType ? 1500 : 500
  );
}

function imh6310RemoveLazyLoad(timeValue) {
  //Remove lazyload
  setTimeout(() => {
    var allImages = jQuery(".imh-6310-img");
    allImages.each(function () {
      var image = jQuery(this).attr("data-imh-value");
      var src = jQuery(this).attr("src");
      var alt = jQuery(this).attr("alt");
      var className = jQuery(this).attr("data-imh-cls");

      var attributes = this.attributes;
      var i = attributes.length;
      while (i--) {
        let attrName = attributes[i].name.toLowerCase();
        if (
          attrName != "src" &&
          attrName != "class" &&
          attrName != "alt" &&
          attrName != "data-imh-value" &&
          attrName != "data-imh-cls"
        ) {
          this.removeAttributeNode(attributes[i]);
        }
      }
      if (src != image) {
        jQuery(this).attr({
          src: image,
          class: className,
          alt: alt,
          "data-imh-value": image,
          "data-imh-cls": className,
        });
      } else {
        jQuery(this).attr({ class: className });
      }
    });
  }, timeValue);
}

function imh_6310_setTooltipPosition(event, pointId, id, alwaysShow = 2) {
  var mainDiv = event.closest(".imh-6310-annotation-box");
  imhPointerType = Number(mainDiv.attr("data-tooltip-position"));
  const tooltipType = Number(mainDiv.attr("data-tooltip-position"));
  let el = mainDiv.find("div[data-id='" + pointId + "']");
  let jsonString = el.attr("data-json");

  let jsonData = null;
  const errorMessage =
    "The custom HTML code is invalid. So tooltip not showing properly.";

  if (jsonString && jsonString !== "undefined") {
    try {
      jsonData = JSON.parse(jsonString);
    } catch (e) {
      if (!jQuery("body").attr("imh-6310-error")) {
        console.error(errorMessage);
        jQuery("body").attr("imh-6310-error", "true");
      }
      return;
    }
  }

  if (!jsonData) {
    if (!jQuery("body").attr("imh-6310-error")) {
      console.error(errorMessage);
      jQuery("body").attr("imh-6310-error", "true");
    }
    return;
  }

  if (jsonData.selectedTemplate == "02") {
    let iFrame = jQuery(
      ".imh-6310-hover-content-" + id + "-" + pointId + " iframe"
    );
    let iframeWidth = iFrame.attr("width");
    let iframeHeight = iFrame.attr("height");

    iframeWidth =
      iframeWidth != undefined && iframeWidth != 0 && iframeWidth != ""
        ? iframeWidth
        : 496;
    iframeHeight =
      iframeHeight != undefined && iframeHeight != 0 && iframeHeight != ""
        ? iframeHeight
        : 397;

    jQuery(
      ".imh-6310-hover-content-" +
        id +
        "-" +
        pointId +
        " iframe, .imh-6310-hover-content-" +
        id +
        "-" +
        pointId +
        " .imh-6310-template-02-hover-content"
    ).css({
      width: iframeWidth + "px",
      height: iframeHeight + "px",
    });
  }

  var content = jQuery(".imh-6310-hover-content-" + id + "-" + pointId);
  if (tooltipType === 1) {
    //Tooltip position Top Right
    content.css({
      top: mainDiv.attr("data-top-bottom") + "px",
      right: mainDiv.attr("data-left-right") + "px",
      position: "fixed",
    });
  } else if (tooltipType === 2) {
    //Tooltip position Center Right
    let contentHeight = content.height();
    let windowHeight = jQuery(window).height();
    let topPosition = windowHeight / 2 - contentHeight / 2;
    content.css({
      top: topPosition + "px",
      right: "10px",
      position: "fixed",
    });
  } else if (tooltipType === 3) {
    //Tooltip position Bottom Right
    content.css({
      bottom: mainDiv.attr("data-top-bottom") + "px",
      right: mainDiv.attr("data-left-right") + "px",
      position: "fixed",
    });
  } else if (tooltipType === 4) {
    //Tooltip position Top Left
    content.css({
      top: mainDiv.attr("data-top-bottom") + "px",
      left: mainDiv.attr("data-left-right") + "px",
      position: "fixed",
    });
  } else if (tooltipType === 5) {
    //Tooltip position Center Right
    let contentHeight = content.height();
    let windowHeight = jQuery(window).height();
    let topPosition = windowHeight / 2 - contentHeight / 2;
    content.css({
      top: topPosition + "px",
      left: "10px",
      position: "fixed",
    });
  } else if (tooltipType === 6) {
    //Tooltip position Bottom Right
    content.css({
      bottom: mainDiv.attr("data-top-bottom") + "px",
      left: mainDiv.attr("data-left-right") + "px",
      position: "fixed",
    });
  } else {
    let icons = mainDiv.find(
      "div[data-id='" + pointId + "'] .imh-6310-point-icons"
    );
    let tempIconSize = icons.width() / 2;
    let fromLeft = icons.offset().left;
    let fromRight = jQuery(window).width() - fromLeft;
    let fromTop = icons.offset().top;
    let iconHeight = icons.height();
    let pointWidth = content.width() / 2;
    let contentHeight = content.height();
    let toolTipPosition = calculateToolTipPosition(
      fromTop,
      tempIconSize,
      contentHeight
    );

    if (fromLeft + tempIconSize < pointWidth) {
      content.css({
        left: "0px",
        right: "auto",
      });
    } else if (fromRight + tempIconSize < pointWidth) {
      content.css({
        left: "auto",
        right: "10px",
      });
    } else {
      let temp = fromLeft + tempIconSize - pointWidth;
      content.css({
        left: temp + "px",
        right: "auto",
      });
    }

    let topPos;
    if (toolTipPosition == 1 || alwaysShow == 1) {
      fromTop -= contentHeight + 10;
      topPos = fromTop + "px";
    } else if (toolTipPosition == 2) {
      fromTop += iconHeight + 5;
      topPos = fromTop + "px";
    }
    if (parseInt(topPos) < 15) {
      topPos = "15px";
    }
    content.css({
      top: topPos,
    });
  }
}

function calculateToolTipPosition(fromTop, tempIconSize, contentHeight) {
  let scrollTop = jQuery(window).scrollTop();
  let deviceHeight = jQuery(window).height();
  let center = scrollTop + deviceHeight / 2;
  let iconCenter = fromTop + tempIconSize + 10;

  if (fromTop - contentHeight > scrollTop) {
    //Space available in top
    return 1;
  } else if (iconCenter > center) {
    //Space not available in top but more space than bottom
    return 1;
  } else {
    return 2;
  }
}

function imh_6310_load_modal_image() {
  jQuery("body").on("click", ".imh-6310-hover-content img", function (e) {
    var id = jQuery(this)
      .closest(".imh-6310-hover-content")
      .attr("data-imh-6310-id");
    var attr = Number(
      jQuery(this).closest(".imh-6310-annotation-box").attr("data-image-zoom")
    );
    if (attr) {
      jQuery(this)
        .closest(".imh-6310-hover-content")
        .css("transform", "scale(0)");

      const closestShortCode = jQuery(this).closest(
        ".imh-6310-plugin-shortcode"
      );
      if (closestShortCode.length) {
        closestShortCode.css("display", "none");
      }

      var windowWidth = jQuery(window).width() - 200;
      var imgWidth = jQuery(this).prop("naturalWidth");
      var src = jQuery(this).attr("src");

      if (windowWidth < imgWidth) {
        imgWidth = windowWidth;
      }

      jQuery("body").css({
        overflow: "hidden",
      });

      jQuery("body").append(
        '<div class="imh-6310-modal" style="display: block;" data-modal-layer="' +
          id +
          '"><div class="imh-6310-modal-content imh-6310-modal-xl" style="display: block; width: ' +
          imgWidth +
          'px; height: auto; margin-bottom: 100px"><div class="imh-6310-popup"><div class="imh-6310-close-button"></div><img src="' +
          src +
          '" width="' +
          imgWidth +
          '" style="padding-bottom: 30px" /></div></div></div>'
      );
    }
  });
}
/* ================================================================= */

function imh_6310_slider_reset(selector) {
  var allSlider = jQuery(".imh-6310-slider");
  jQuery(".imh-6310-slider-content").hide();
  imh_6310_calculate_slider_size(selector, 0);
  selector.find(".imh-6310-slider-content-0").show();
  allSlider.each(function () {
    jQuery(this).attr("data-current-slider", 0);
  });
}

function imh_6310_calculate_slider_size(selector, num) {
  var windowWidth = jQuery(window).width();
  if (windowWidth < 768) {
    windowWidth -= 50;
  } else if (windowWidth < 992) {
    windowWidth -= 80;
  } else {
    windowWidth -= 130;
  }

  var sliderWidth = Number(
    selector.find(".imh-6310-slider").attr("imh-slider-width") || 700
  );
  var imgWidth = selector
    .find(".imh-6310-slider-content-" + num + " img")
    .prop("naturalWidth");

  var imgHeight = selector
    .find(".imh-6310-slider-content-" + num + " img")
    .prop("naturalHeight");

  if (sliderWidth > windowWidth) {
    imgHeight = (imgHeight * windowWidth) / imgWidth;
    imgWidth = windowWidth;
  } else {
    imgHeight = (imgHeight * sliderWidth) / imgWidth;
    imgWidth = sliderWidth;
  }

  selector
    .find(".imh-6310-slider, .imh-6310-modal-content")
    .attr(
      "style",
      "width: " +
        imgWidth +
        "px !important; max-width: " +
        imgWidth +
        "px !important; height: " +
        imgHeight +
        "px !important"
    );
}

function imh_6310_slider_init() {
  var allSliderImg = jQuery(
    ".imh-6310-slider .imh-6310-slider-content img, .imh-6310-hover-content img"
  );
  allSliderImg.each(function () {
    var src =
      jQuery(this).attr("imh-image-url") ||
      jQuery(this).attr("data-src") ||
      jQuery(this).attr("data-opt-src") ||
      jQuery(this).attr("data-lazy-src") ||
      jQuery(this).attr("src");
    var attributes = jQuery.map(this.attributes, function (item) {
      return item.name;
    });

    var img = jQuery(this);
    jQuery.each(attributes, function (i, item) {
      img.removeAttr(item);
    });
    img.attr("src", src);
  });

  var allSlider = jQuery(".imh-6310-slider");
  allSlider.each(function () {
    var i = 0;
    var sliderContent = jQuery(this).find(".imh-6310-slider-content");
    jQuery(this).attr("data-total-slider", sliderContent.length);
    jQuery(this).attr("data-current-slider", 0);
    sliderContent.each(function () {
      jQuery(this).addClass(" imh-6310-slider-content-" + i);
      i++;
    });
  });

  jQuery("body").on("click", ".next", function () {
    imh_6310_slider_next(jQuery(this).closest(".imh-6310-slider"));
  });

  jQuery("body").on("click", ".prev", function () {
    imh_6310_slider_prev(jQuery(this).closest(".imh-6310-slider"));
  });
}

function imh_6310_slider_next(selector) {
  var totalSlider = Number(selector.attr("data-total-slider"));
  var currentSlider = Number(selector.attr("data-current-slider"));
  selector.find(".imh-6310-slider-content-" + currentSlider).fadeOut(200);
  currentSlider += 1;
  if (totalSlider <= currentSlider) {
    currentSlider = 0;
  }
  imh_6310_calculate_slider_size(
    selector.closest(".imh-6310-modal"),
    currentSlider
  );
  selector.find(".imh-6310-slider-content-" + currentSlider).fadeIn(300);
  selector.attr("data-current-slider", currentSlider);
}

function imh_6310_slider_prev(selector) {
  var totalSlider = Number(selector.attr("data-total-slider"));
  var currentSlider = Number(selector.attr("data-current-slider"));
  selector.find(".imh-6310-slider-content-" + currentSlider).fadeOut(200);
  currentSlider -= 1;

  if (currentSlider < 0) {
    currentSlider = totalSlider - 1;
  }
  imh_6310_calculate_slider_size(
    selector.closest(".imh-6310-modal"),
    currentSlider
  );
  selector.find(".imh-6310-slider-content-" + currentSlider).fadeIn(300);
  selector.attr("data-current-slider", currentSlider);
}
