import React from 'react';
import Choice from '../Choice/Choice';
import './ThumbnailCard.scss';

const ThumbnailCard = ({ onChange, checked, index, thumbnail }) => {
  let img = null;

  if (thumbnail) {
    let src;
    if (thumbnail.currentSrc) {
      src = thumbnail.currentSrc;
    } else if (thumbnail.url) {
      src = thumbnail.url;
    } else if (thumbnail.toDataURL) {
      src = thumbnail.toDataURL();
    }

    img = <img className="thumb-card-img" alt="img_name" src={src} />;
  }

  return (
    <div className="thumb-card" onClick={onChange}>
      <div className='thumb-body'>
        <div className="thumb-image">
          {img}
        </div>
        <Choice
          id={`custom-checkbox-${index}`}
          name={`thumb${index}`}
          checked={checked}
        />
      </div>
      <div className="thumb-card-title">{index + 1}</div>
    </div>
  );
};

export default ThumbnailCard;