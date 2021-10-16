import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Choice from '../../Choice/Choice';
import './ThumbnailCard.scss';

const ThumbnailCard = ({ onChange, checked, index, thumbnail }) => {
  let img = null;
  if (thumbnail && thumbnail.url) {
    img = <img className="thumb-card-img" alt="img_name" src={thumbnail.url} />
  }
  return (
    <div className="thumb-card">
        <Choice
          id={`custom-checkbox-${index}`}
          className="thumb-card-ck"
          name={'thumb' + index}
          checked={checked}
          onChange={onChange}
        />
        <div className="thumb-card-body">
          {img}
        </div>
        <div className="thumb-card-title">{index + 1}</div>
    </div>
  );
};

export default ThumbnailCard;