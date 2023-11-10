import { expect } from 'chai';
import { doesCurrentViewContainEntirePage } from '../../../../src/ui/src/helpers/printCurrentViewHelper';

describe('Print helper tests', () => {
  describe('doesCurrentViewContainEntirePage', () => {
    const sampleRect = {
      x1: 10,
      x2: 110,
      y1: 10,
      y2: 110
    };

    const sampleDimensions = {
      width: 100,
      height: 100
    };

    it('should return undefined if no rect or dimensions are provided', () => {
      let result = doesCurrentViewContainEntirePage(undefined, sampleDimensions);
      expect(result).to.equal(undefined);
      result = doesCurrentViewContainEntirePage(sampleRect, undefined);
      expect(result).to.equal(undefined);
    });

    it('should return true if rect is same size as page dimensions', () => {
      const result = doesCurrentViewContainEntirePage(sampleRect, sampleDimensions);
      expect(result).to.equal(true);
    });

    it('should return true if rect is larger than page dimensions', () => {
      sampleRect.x1 = 0;
      sampleRect.y1 = 0;
      sampleRect.x2 = 200;
      sampleRect.y2 = 200;

      const result = doesCurrentViewContainEntirePage(sampleRect, sampleDimensions);
      expect(result).to.equal(true);
    });

    it('should return false if rect is smaller than page dimensions', () => {
      sampleRect.x1 = 0;
      sampleRect.y1 = 0;
      sampleRect.x2 = 90;
      sampleRect.y2 = 90;

      const result = doesCurrentViewContainEntirePage(sampleRect, sampleDimensions);
      expect(result).to.equal(false);
    });
  });
});