import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';
import ThumbnailCard from './ThumbnailCard';

const TestThumbnailCard = withProviders(ThumbnailCard);
function noop() { };

describe('ThumbnailCard', () => {
  describe('Component', () => {
    it('Should render component correctly', () => {
      const { container } = render(<TestThumbnailCard
        onChange={noop}
        checked={false}
        index={1}
        thumbnail={{}}
      />)
      expect(container.querySelectorAll('.thumb-card-title')).toHaveLength(1);
      expect(true).toBe(true);
    })
  });
});