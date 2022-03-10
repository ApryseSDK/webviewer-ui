import React from 'react';
import Choice from '../../Choice/Choice';
import './ThumbnailCard.scss';

const ThumbnailCard = ({ onChange, checked, index, thumbnail }) => {
  let img = null;

  if (thumbnail) {
    let src;
    if (thumbnail.currentSrc) {
      src = thumbnail.currentSrc
    } else if (thumbnail.url) {
      src = thumbnail.url;
    } else if (thumbnail.toDataURL) {
      src = thumbnail.toDataURL();
    }

    img = <img className="thumb-card-img" alt="img_name" src={src} />
  }

  return (
    <div className="thumb-card" onClick={onChange}>
      <Choice
        id={`custom-checkbox-${index}`}
        className="thumb-card-ck"
        name={'thumb' + index}
        checked={checked}
      />
      <div className="thumb-card-body">
        {img}
      </div>
      <div className="thumb-card-title">{index + 1}</div>
    </div>
  );
};

export default ThumbnailCard;