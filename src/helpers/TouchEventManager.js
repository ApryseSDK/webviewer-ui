import core from 'core';
import { isIOS } from 'helpers/device';
import getNumberOfPagesToNavigate from 'helpers/getNumberOfPagesToNavigate';
import { getDataWithKey, mapToolNameToKey } from 'constants/map';
import { getMinZoomLevel, getMaxZoomLevel } from 'constants/zoomFactors';

const touchType = {
  TAP: 'tap',
  DOUBLE_TAP: 'doubleTap',
  PINCH: 'pinch',
  PAN: 'pan',
  SWIPE: 'swipe'
};

const TouchEventManager = {
  initialize(document, container) {
    this.document = document;
    this.container = container;
    this.allowSwipe = true;
    this.allowHorizontalSwipe = true;
    this.allowVerticalSwipe = false;
    this.verticalMomentum = 0;
    this.horziontalMomentum = 0;
    this.verticalLock = false;
    this.horziontalLock = false;
    this.enableTouchScrollLock = true;
    this.startingScrollLeft = null;
    this.startingScrollTop = null;
    this.useNativeScroll = false;
    this.touch = {
      clientX: 0,
      clientY: 0,
      distance: 0,
      horizontalDistance: 0,
      verticalDistance: 0,
      scale: 1,
      zoom: 1,
      type: '',
    };
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);
    this.container.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.container.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.container.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    this.container.addEventListener('touchcancel', this.handleTouchCancel, { passive: false });
  },
  terminate() {
    this.container.removeEventListener('touchstart', this.handleTouchStart);
    this.container.removeEventListener('touchmove', this.handleTouchMove);
    this.container.removeEventListener('touchend', this.handleTouchEnd);
    this.container.removeEventListener('touchcancel', this.handleTouchCancel);
  },
  handleTouchStart(e) {
    switch (e.touches.length) {
      case 1: {
        const touch = e.touches[0];
        const scrollWidth = this.container.clientWidth;
        const viewerWidth = this.document.clientWidth;
        const isDoubleTap = this.touch.type === touchType.TAP && this.getDistance(this.touch, touch) <= 10;
        this.touch = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          distance: 0,
          scale: scrollWidth / viewerWidth,
          zoom: core.getZoom(),
          type: isDoubleTap ? touchType.DOUBLE_TAP : touchType.TAP,
          touchStartTimeStamp: Date.now(),
          stopMomentumScroll: true,
          touchMoveCount: 0,
        };
        this.startingScrollLeft = this.container.scrollLeft;
        this.startingScrollTop = this.container.scrollTop;
        clearTimeout(this.doubleTapTimeout);
        break;
      }
      case 2: {
        if (e.cancelable) {
          e.preventDefault();
        }

        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const clientX = (t1.clientX + t2.clientX) / 2;
        const clientY = (t1.clientY + t2.clientY) / 2;
        const docX = clientX - this.document.offsetLeft + this.container.scrollLeft;
        const docY = clientY - this.document.offsetTop + this.container.scrollTop;
        this.touch = {
          previousPinchScale: 0,
          marginLeft: this.document.offsetLeft,
          marginTop: parseFloat(window.getComputedStyle(this.document).marginTop),
          clientX,
          clientY,
          docX,
          docY,
          distance: this.getDistance(t1, t2),
          scale: 1,
          zoom: core.getZoom(),
          touchStartTimeStamp: Date.now(),
          stopMomentumScroll: true,
          touchMoveCount: 0,
        };
        if (!isIOS) {
          this.document.style.transformOrigin = `${docX}px ${docY}px`;
        }
        this.startingScrollLeft = this.container.scrollLeft;
        this.startingScrollTop = this.container.scrollTop;
        break;
      }
    }
  },
  axisLockThreshold: 8,
  isScrollingVertically() {
    return (Math.abs(this.verticalMomentum) > 0 && this.horziontalMomentum === 0) || (Math.abs(this.touch.verticalDistance) > this.axisLockThreshold * Math.abs(this.touch.horizontalDistance));
  },
  isScrollingHorziontally() {
    return (Math.abs(this.horziontalMomentum) > 0 && this.verticalMomentum === 0) || (Math.abs(this.touch.horizontalDistance) > this.axisLockThreshold * Math.abs(this.touch.verticalDistance));
  },
  canLockScrolling() {
    const { container, document: doc } = this;
    const doesPagesFitOnScreen = doc.clientWidth < container.clientWidth || doc.clientHeight < container.clientHeight;
    const alreadyLocked = this.verticalLock || this.horziontalLock;

    // using 'touchMoveCount' to disable scroll locking when user is dragging
    return !doesPagesFitOnScreen && this.enableTouchScrollLock && this.touch.touchMoveCount < 6 && !alreadyLocked;
  },

  handleScroll(t) {
    if (this.useNativeScroll) {
      return;
    }
    this.touch.horizontalDistance = this.touch.clientX - t.clientX;
    this.touch.verticalDistance = this.touch.clientY - t.clientY;

    if (this.canLockScrolling()) {
      this.verticalLock = this.isScrollingVertically();
      this.horziontalLock = this.isScrollingHorziontally();
    }

    if (this.enableTouchScrollLock) {
      // scroll vertically
      if (this.verticalLock) {
        // calc the position in container
        this.container.scrollTo(this.startingScrollLeft, this.container.scrollTop);
        this.touch.horizontalDistance = 0;
      }

      // scroll horizontally
      if (this.horziontalLock) {
        // calc the position in container
        this.container.scrollTo(this.container.scrollLeft, this.startingScrollTop);
        this.touch.verticalDistance = 0;
      }
    }
  },
  handleTouchMove(e) {
    switch (e.touches.length) {
      case 1: {
        if (e.cancelable) {
          e.preventDefault();
        }

        const t = e.touches[0];

        if (this.getDistance(this.touch, t) > 10) {
          this.touch.type = touchType.SWIPE;
        }

        this.handleScroll(t);

        this.touch.touchMoveCount++;
        break;
      }
      case 2: {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const panTool = core.getTool('Pan');
        const isPanning = panTool.isPanning();
        const isPinching = panTool.isPinching();

        if (isPanning) {
          this.touch.type = touchType.PAN;
          if (e.cancelable) {
            e.preventDefault();
          }

          const t = {
            clientX: (t1.clientX + t2.clientX) / 2,
            clientY: (t1.clientY + t2.clientY) / 2
          };

          if (this.getDistance(this.touch, t) > 10) {
            this.touch.type = touchType.SWIPE;
          }

          this.handleScroll(t);
          this.touch.touchMoveCount++;
          break;
        }

        if (isPinching) {
          this.touch.type = touchType.PINCH;
          if (e.cancelable) {
            e.preventDefault();
          }
          this.touch.scale = this.getDistance(t1, t2) / this.touch.distance;

          if (this.touch.scale * this.touch.zoom < getMinZoomLevel()) {
            this.touch.scale = getMinZoomLevel() / this.touch.zoom;
          } else if (this.touch.scale * this.touch.zoom > getMaxZoomLevel()) {
            this.touch.scale = getMaxZoomLevel() / this.touch.zoom;
          }

          if (isIOS) {
            const marginLeft = (this.touch.marginLeft + (1 - this.touch.scale) * this.touch.docX) / this.touch.scale;
            const marginTop = (this.touch.marginTop + (1 - this.touch.scale) * this.touch.docY) / this.touch.scale;
            this.document.style.marginLeft = `${marginLeft}px`;
            this.document.style.marginTop = `${marginTop}px`;
            this.document.style.zoom = this.touch.scale;
          } else {
            this.document.style.transform = `scale(${this.touch.scale})`;
          }
          break;
        }
      }
    }
  },
  handleTouchEnd(e) {
    switch (this.touch.type) {
      case touchType.TAP: {
        this.doubleTapTimeout = setTimeout(() => {
          this.touch.type = '';
        }, 300);

        this.horziontalLock = false;
        this.verticalLock = false;
        break;
      }
      case touchType.SWIPE: {
        if (
          !this.allowSwipe ||
          this.isUsingAnnotationTools() ||
          core.getSelectedText().length ||
          core.getSelectedAnnotations().length
        ) {
          return;
        }

        const { reachedLeft, reachedTop, reachedRight, reachedBottom } = this.reachedBoundary();
        const threshold = 0.1 * this.container.clientWidth;
        const swipedToBottom = reachedBottom && this.touch.verticalDistance > threshold;
        const swipedToTop = reachedTop && this.touch.verticalDistance < -threshold;
        const swipedToRight = reachedRight && this.touch.horizontalDistance > threshold;
        const swipedToLeft = reachedLeft && this.touch.horizontalDistance < -threshold;

        const currentPage = core.getCurrentPage();
        const totalPages = core.getTotalPages();
        const numberOfPagesToNavigate = getNumberOfPagesToNavigate();

        const isFirstPage = currentPage === 1;
        const isLastPage = currentPage === totalPages;
        const isSingleDisplayMode = !core.isContinuousDisplayMode();
        const shouldGoToPrevPage = isSingleDisplayMode && !isFirstPage && ((swipedToLeft && this.allowHorizontalSwipe) || (swipedToTop && this.allowVerticalSwipe));
        const shouldGoToNextPage = isSingleDisplayMode && !isLastPage && ((swipedToRight && this.allowHorizontalSwipe) || (swipedToBottom && this.allowVerticalSwipe));

        if (shouldGoToPrevPage) {
          core.setCurrentPage(Math.max(1, currentPage - numberOfPagesToNavigate));
        } else if (shouldGoToNextPage) {
          core.setCurrentPage(Math.min(totalPages, currentPage + numberOfPagesToNavigate));
        } else if (!this.useNativeScroll) {
          const millisecondsToSeconds = 1000;
          const touchDuration = (Date.now() - this.touch.touchStartTimeStamp) / millisecondsToSeconds;

          if (touchDuration < 0.2) {
            this.touch.stopMomentumScroll = false;
            this.startMomentumScroll(touchDuration);
          } else {
            this.horziontalLock = false;
            this.verticalLock = false;
          }
        }
        break;
      }
      case touchType.DOUBLE_TAP: {
        const annotationUnderMouse = core.getAnnotationByMouseEvent(e);
        const isFreeTextUnderMouse = annotationUnderMouse && annotationUnderMouse instanceof Annotations.FreeTextAnnotation;

        if (this.isUsingAnnotationTools()) {
          const tool = core.getToolMode();
          tool.finish && tool.finish();
        } else if (!isFreeTextUnderMouse) {
          if (this.oldZoom) {
            this.touch.scale = Math.max(this.oldZoom / this.touch.zoom, getMinZoomLevel() / this.touch.zoom);
            this.oldZoom = null;
          } else {
            this.touch.scale = Math.min(3, getMaxZoomLevel() / this.touch.zoom);
            this.oldZoom = this.touch.zoom;
          }
          const zoom = core.getZoom() * this.touch.scale;
          const { x, y } = this.getPointAfterScale();
          core.zoomTo(zoom, x, y);
        }

        if (isFreeTextUnderMouse) {
          core
            .getAnnotationManager()
            .trigger('annotationDoubleClicked', annotationUnderMouse);
        }

        break;
      }
      case touchType.PINCH: {
        // sometimes handleTouchEnd will be called twice with the same value of this.touch.scale
        // depending on how fast two fingers are away of the screen
        // as a result the document will be zoomed in twice, and we do this check to prevent that from happening
        if (this.touch.previousPinchScale === this.touch.scale) {
          return;
        }

        this.touch.previousPinchScale = this.touch.scale;

        if (isIOS) {
          this.document.style.zoom = 1;
          this.document.style.margin = 'auto';
        } else {
          this.document.style.transform = 'none';
        }
        const zoom = core.getZoom() * this.touch.scale;
        const { x, y } = this.getPointAfterScale();
        core.zoomTo(zoom, x, y);
        break;
      }
    }
    this.touch.touchMoveCount = 0;
    // Want to use momentum values during 'TouchMove' event, so clear values in 'touchEnd' instead of 'touchStart'
    this.verticalMomentum = 0;
    this.horziontalMomentum = 0;
  },
  handleTouchCancel(e) {
    this.handleTouchEnd(e);
  },
  startMomentumScroll(touchDuration) {
    let currentIteration = 1;
    const iterationsCount = 70;
    const momentumUnlockThreshold = 1;
    const initScrollLeft = this.container.scrollLeft;
    const initScrollTop = this.container.scrollTop;
    const dHorizontal = this.touch.horizontalDistance / touchDuration / 1.85;
    const dVertical = this.touch.verticalDistance / touchDuration / 1.85;
    const momentumScroll = () => {
      const nextLeft = this.easeOutQuad(currentIteration, initScrollLeft, dHorizontal, iterationsCount);
      const nextTop = this.easeOutQuad(currentIteration, initScrollTop, dVertical, iterationsCount);
      this.verticalMomentum = dVertical;
      this.horziontalMomentum = dHorizontal;

      // 'handleTouchEnd' should set 'touchMoveCount' to 0, using that to determine if a new touch event happened
      const isNotNewTouchEvent = !this.touch.touchMoveCount;
      const horzDiff = this.container.scrollLeft - nextLeft;
      const vertDiff = this.container.scrollTop - nextTop;
      // if momentum is small enought that it doesn't look like it's moving, disable scroll locking
      const isMomentumScrollAlmostFinish = (Math.abs(horzDiff) < momentumUnlockThreshold) && (Math.abs(vertDiff) < momentumUnlockThreshold);

      this.container.scrollLeft = nextLeft;
      this.container.scrollTop = nextTop;

      if (isNotNewTouchEvent && isMomentumScrollAlmostFinish) {
        // disable lock when momentum scrolling is mostly done and not in the middle of another touch event
        this.horziontalLock = false;
        this.verticalLock = false;
      }

      if (currentIteration < iterationsCount && !this.touch.stopMomentumScroll) {
        currentIteration++;
        requestAnimationFrame(momentumScroll);
      }
      if (isNotNewTouchEvent && currentIteration === iterationsCount) {
        // if the page is against the sides and the users swipe quickly, it tries to set Scroll to a value that is outside the range and 'isMomentumScrollAlmostFinish' is never true
        this.horziontalLock = false;
        this.verticalLock = false;
        this.verticalMomentum = 0;
        this.horziontalMomentum = 0;
      }
    };

    requestAnimationFrame(momentumScroll);
  },
  easeOutQuad(currentTime, startValue, changeInValue, duration) {
    // http://gizma.com/easing/#quad2
    currentTime /= duration;

    return -changeInValue * currentTime * (currentTime - 2) + startValue;
  },
  reachedBoundary() {
    const { clientHeight: scrollHeight, clientWidth: scrollWidth, scrollLeft, scrollTop } = this.container;
    const { clientHeight: viewerHeight, clientWidth: viewerWidth } = this.document;

    return {
      reachedLeft: scrollLeft <= 0,
      reachedTop: scrollTop <= 0,
      reachedBottom: scrollHeight + scrollTop >= viewerHeight,
      reachedRight: scrollWidth + scrollLeft >= viewerWidth,
    };
  },
  getDistance(t1, t2) {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  },
  getPointAfterScale() {
    const x = (this.touch.clientX + this.container.scrollLeft - this.document.offsetLeft) * this.touch.scale - this.touch.clientX + this.container.offsetLeft;
    const y = (this.touch.clientY + this.container.scrollTop - this.document.offsetTop) * this.touch.scale - this.touch.clientY + this.container.offsetTop;

    return { x, y };
  },
  isUsingAnnotationTools() {
    const tool = core.getToolMode();

    return getDataWithKey(mapToolNameToKey(tool.name)).annotationCheck;
  },
};

export default Object.create(TouchEventManager);
