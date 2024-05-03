import { updateLayerVisibililty } from './updateLayerVisibililty';

describe('Tests for updateLayerVisibililty', () => {
  describe('Tests for single layer', () => {
    it('should be able to update single layer visibililty if default visibililty is true', () => {
      const testLayer = {
        visible: true
      };
      const newTestLayer = updateLayerVisibililty(testLayer, !testLayer.visible);
      expect(newTestLayer.visible).toEqual(!testLayer.visible);
    });
    it('should be able to update single layer visibililty if default visibililty is false', () => {
      const testLayer = {
        visible: false
      };
      const newTestLayer = updateLayerVisibililty(testLayer, !testLayer.visible);
      expect(newTestLayer.visible).toBe(!testLayer.visible);
    });
    it('should not be able to update single layer visibililty if layer is locked', () => {
      const testLayer = {
        visible: false,
        locked: true
      };
      const newTestLayer = updateLayerVisibililty(testLayer, !testLayer.visible);
      expect(newTestLayer.visible).toBe(testLayer.visible);
    });
    it('should not be able to update single layer visibililty if layer is disabled', () => {
      const testLayer = {
        visible: false,
        disabled: true
      };
      const newTestLayer = updateLayerVisibililty(testLayer, !testLayer.visible);
      expect(newTestLayer.visible).toBe(testLayer.visible);
    });
  });

  describe('Tests for parent layer with 1 child', () => {
    it('should be able to set children layer visibililty appropriately if parent layer is toggled', () => {
      const testLayer = {
        visible: true,
        prevVisibleState: true,
        children: [
          {
            visible: true,
            prevVisibleState: true,
          }
        ]
      };
      const newTestLayer = updateLayerVisibililty(testLayer, !testLayer.visible);
      expect(newTestLayer.visible).toBe(false);
      expect(newTestLayer.children[0].visible).toBe(false);
      expect(newTestLayer.children[0].prevVisibleState).toBe(true);
      expect(newTestLayer.children[0].disabled).toBe(true);

      // turn it back on
      const newTestLayer2 = updateLayerVisibililty(newTestLayer, !newTestLayer.visible);
      expect(newTestLayer2.visible).toBe(true);
      expect(newTestLayer2.children[0].visible).toBe(true);
      expect(newTestLayer2.children[0].prevVisibleState).toBe(true);
      expect(newTestLayer2.children[0].disabled).toBe(false);
    });

    it('should be able to set children layer visibililty appropriately if child is toggled and then parent layer is toggled', () => {
      const testLayer = {
        visible: true,
        prevVisibleState: true,
        children: [
          {
            visible: true,
            prevVisibleState: true,
          }
        ]
      };

      // toggle child layer first
      testLayer.children[0] = updateLayerVisibililty(testLayer.children[0], !testLayer.children[0].visible);

      const newTestLayer = updateLayerVisibililty(testLayer, !testLayer.visible);
      expect(newTestLayer.visible).toBe(false);
      expect(newTestLayer.children[0].visible).toBe(false);
      expect(newTestLayer.children[0].prevVisibleState).toBe(false);
      expect(newTestLayer.children[0].disabled).toBe(true);

      // turn it back on
      const newTestLayer2 = updateLayerVisibililty(newTestLayer, !newTestLayer.visible);
      expect(newTestLayer2.visible).toBe(true);
      expect(newTestLayer2.children[0].visible).toBe(false);
      expect(newTestLayer2.children[0].prevVisibleState).toBe(false);
      expect(newTestLayer2.children[0].disabled).toBe(false);
    });

    it('should not be able to set children layer visibililty if parent is locked', () => {
      const testLayer = {
        visible: true,
        locked: true,
        prevVisibleState: true,
        children: [
          {
            visible: true,
            prevVisibleState: true,
          }
        ]
      };

      const newTestLayer = updateLayerVisibililty(testLayer, !testLayer.visible);
      expect(newTestLayer).toEqual(testLayer);
    });

    it('should not be able to set children layer visibililty if parent is disabled', () => {
      const testLayer = {
        visible: true,
        disabled: true,
        prevVisibleState: true,
        children: [
          {
            visible: true,
            prevVisibleState: true,
          }
        ]
      };

      const newTestLayer = updateLayerVisibililty(testLayer, !testLayer.visible);
      expect(newTestLayer).toEqual(testLayer);
    });

    it('should not be able to set children layer visibililty if parent is disabled', () => {
      const testLayer = {
        visible: true,
        disabled: true,
        prevVisibleState: true,
        children: [
          {
            visible: true,
            prevVisibleState: true,
          }
        ]
      };

      const newTestLayer = updateLayerVisibililty(testLayer, !testLayer.visible);
      expect(newTestLayer).toEqual(testLayer);
    });

    it('should be able to change locked children layer visibililty if parent visibililty is changed', () => {
      // this is how Adobe functions
      const testLayer = {
        visible: true,
        prevVisibleState: true,
        children: [
          {
            visible: true,
            prevVisibleState: true,
            locked: true
          }
        ]
      };

      const newTestLayer = updateLayerVisibililty(testLayer, !testLayer.visible);
      expect(newTestLayer.visible).toBe(false);
      expect(newTestLayer.children[0].visible).toBe(false);
    });
    // According to layers flow and UX and PDF Specifications
    // don't bother testing case when child layer is disabled
    // when child layer is disabled, it is not visible and it means parent is not visible
  });
});