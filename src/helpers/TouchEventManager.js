import core from 'core';
import { isIOS } from 'helpers/device';
import { ZOOM_MIN, ZOOM_MAX } from 'constants/zoomFactors';

const TouchEventManager = {
  initialize(document, container) {
    this.document = document;
    this.container = container;
    this.touch = {
      clientX: 0,
      clientY: 0,
      distance: 0,
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
        this.holdTimeout = setTimeout(() => {
          this.touch.type = 'hold';
          const textSelectTool = core.getTool('TextSelect');
          textSelectTool.mouseLeftDown(e);
          textSelectTool.mouseLeftUp(e);
          textSelectTool.mouseDoubleClick();
          core.setToolMode('TextSelect');
        }, 5000);
        break;
      }
      case 2: {
        e.preventDefault();
        clearTimeout(this.holdTimeout);
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
    clearTimeout(this.holdTimeout);
    switch (e.touches.length) {
      case 1: {
        const t = e.touches[0];
        this.touch.distance = this.touch.clientX - t.clientX;
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

        if (this.touch.scale * this.touch.zoom < ZOOM_MIN) {
          this.touch.scale = ZOOM_MIN / this.touch.zoom;
        } else if (this.touch.scale * this.touch.zoom > ZOOM_MAX) {
          this.touch.scale = ZOOM_MAX / this.touch.zoom;
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
  handleTouchEnd(e) {
    clearTimeout(this.holdTimeout);
    switch (this.touch.type) {
      case 'hold': {
        e.preventDefault();
        if (core.getSelectedText().length < 1) {
          window.docViewer.setToolMode(window.docViewer.getTool('AnnotationEdit'));
        }
        break;
      }
      case 'tap': {
        this.doubleTapTimeout = setTimeout(() => {
          this.touch.type = '';
        }, 300);
        core.setToolMode('AnnotationEdit');
        break;
      }
      case 'swipe': {
        if (core.getSelectedText().length > 0 || core.isContinuousDisplayMode()) {
          return;
        }

        const { scrollLeft } = this.container;
        const scrollWidth = this.container.clientWidth;
        const viewerWidth = this.document.clientWidth;
        if (scrollLeft === 0 && this.touch.distance < -100) {
          core.setCurrentPage(core.getCurrentPage() - 1);
        } else if (scrollWidth + scrollLeft >= viewerWidth && this.touch.distance > 100) {
          core.setCurrentPage(core.getCurrentPage() + 1);
        }
        break;
      }
      case 'doubleTap': {
        if (this.oldZoom) {
          this.touch.scale = Math.max(this.oldZoom / this.touch.zoom, ZOOM_MIN / this.touch.zoom);
          this.oldZoom = null;
        } else {
          this.touch.scale = Math.min(3, ZOOM_MAX / this.touch.zoom);
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

