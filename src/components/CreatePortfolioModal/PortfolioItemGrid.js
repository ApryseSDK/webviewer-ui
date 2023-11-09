import React from 'react';
import Button from 'components/Button';
import PortfolioItemPreview from './PortfolioItemPreview';

import './PortfolioItemGrid.scss';

const PortfolioItemGrid = ({ items, onDeleteItem, onDropItems }) => {
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="portfolio-items"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={onDropItems}
    >
      {items.map((item, index) => (
        <div className="portfolio-item" key={item.name}>
          <div className="portfolio-item-preview">
            <PortfolioItemPreview item={item} />
          </div>
          <div className="portfolio-item-name" title={item.name}>
            {item.name}
          </div>
          <Button
            img="ic-delete"
            onClick={() => onDeleteItem(index)}
            title="action.delete"
          />
        </div>
      ))}
    </div>
  );
};

export default PortfolioItemGrid;
