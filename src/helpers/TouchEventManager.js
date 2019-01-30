import core from 'core';
import { isIOS } from 'helpers/device';
import getNumberOfPagesToNavigate from 'helpers/getNumberOfPagesToNavigate';
import { getMinZoomLevel, getMaxZoomLevel } from 'constants/zoomFactors';

const TouchEventManager = {
  initialize(document, container) {
    this.document = document;
    this.container = container;
    this.horizontalSwipe = true;
    this.verticalSwipe = false;
    this.touch = {
      clientX: 0,
      clientY: 0,
      distance: 0,
      horizontalDistance: 0,
      verticalDistance: 0,
      scale: 1,
      zoom: 1,
      type: ''
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

  updateOrientation(newOrientation) {
    if (newOrientation === "both"){
      this.verticalSwipe = true;
      this.horizontalSwipe = true;
    } else if (newOrientation === "vertical"){
      this.verticalSwipe = true;
      this.horizontalSwipe = false;
    } else if (newOrientation === "horizontal"){
      this.verticalSwipe = false;
      this.horizontalSwipe = true;
    } else {
      console.warn (newOrientation + " is not a valid orientation. Try 'vertical,' 'horizontal,' or 'both.'");
      return;
    }
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
        const isDoubleTap = this.touch.type === 'tap' && this.getDistance(this.touch, touch) <= 10;
        this.touch = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          distance: 0,
          scale: scrollWidth / viewerWidth,
          zoom: core.getZoom(),
          type: isDoubleTap ? 'doubleTap' : 'tap'
        };
        clearTimeout(this.doubleTapTimeout);
        break;
      }
      case 2: {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const clientX = (t1.clientX + t2.clientX) / 2;
        const clientY = (t1.clientY + t2.clientY) / 2;
        const docX = clientX - this.document.offsetLeft + this.container.scrollLeft;
        const docY = clientY - this.document.offsetTop + this.container.scrollTop;
        this.touch = {
          marginLeft: this.document.offsetLeft,
          marginTop: parseFloat(window.getComputedStyle(this.document).marginTop),
          clientX,
          clientY,
          docX,
          docY,
          distance: this.getDistance(t1, t2),
          scale: 1,
          zoom: core.getZoom(),
          type: 'pinch'
        };
        if (!isIOS) {
          this.document.style.transformOrigin = `${docX}px ${docY}px`;
        }
        break;
      }
    }
  },
  handleTouchMove(e) {
    switch (e.touches.length) {
      case 1: {
        const t = e.touches[0];
        this.touch.horizontalDistance = this.touch.clientX - t.clientX;
        this.touch.verticalDistance = this.touch.clientY - t.clientY;
        if (this.getDistance(this.touch, t) > 10) {
          this.touch.type = 'swipe';
        }
        break;
      }
      case 2: {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
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
  },
  handleTouchEnd() {
    switch (this.touch.type) {
      case 'tap': {
        this.doubleTapTimeout = setTimeout(() => {
          this.touch.type = ''; 
        }, 300);
        break;
      }
      case 'swipe': {
        const toolName = core.getToolMode().name;
        const usingAnnotationTools = toolName !== 'AnnotationEdit' && toolName !== 'Pan'; 
        if (
          core.getSelectedText().length || 
          core.isContinuousDisplayMode() || 
          usingAnnotationTools || 
          core.getSelectedAnnotations().length
        ) {
          return;
        }

        const { scrollLeft, scrollTop } = this.container;
        const swipingRight = scrollLeft <= 0 && this.touch.horizontalDistance < -100;
        const viewerWidth = this.document.clientWidth;
        const scrollWidth = this.container.clientWidth;
        const viewerHeight = this.document.clientHeight;
        const scrollHeight = this.container.clientHeight;
        const swipingLeft = scrollWidth + scrollLeft >= viewerWidth && this.touch.horizontalDistance > 100;
        const swipingUp = scrollHeight + scrollTop >= viewerHeight && this.touch.verticalDistance > 100;
        const swipingDown = scrollTop <= 0 && this.touch.verticalDistance < -100;
        const currentPage = core.getCurrentPage();
        const displayMode = core.getDisplayMode();
        const verticalSwipe = this.verticalSwipe;
        const horizontalSwipe = this.horizontalSwipe;
        
        if ((swipingRight && horizontalSwipe) || (swipingDown && verticalSwipe)) {
          core.setCurrentPage(Math.max(1, currentPage - getNumberOfPagesToNavigate(displayMode)));
        } else if ((swipingLeft && horizontalSwipe) || (swipingUp && verticalSwipe)) {
          core.setCurrentPage(Math.min(core.getTotalPages(), currentPage + getNumberOfPagesToNavigate(displayMode)));
        }
        break;
      }
      case 'doubleTap': {
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
        break;
      }
      case 'pinch': {
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
  },
  handleTouchCancel(e) {
    this.handleTouchEnd(e);
  },
  getDistance(t1, t2) {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  },
  getPointAfterScale() {
    const x = (this.touch.clientX + this.container.scrollLeft - this.document.offsetLeft) * this.touch.scale - this.touch.clientX + this.container.offsetLeft;
    const y = (this.touch.clientY + this.container.scrollTop - this.document.offsetTop) * this.touch.scale - this.touch.clientY + this.container.offsetTop;

    return { x, y };
  }
};

export default TouchEventManager;

