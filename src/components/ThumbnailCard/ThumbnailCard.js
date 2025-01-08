import React from 'react';
import Choice from '../Choice/Choice';
import './ThumbnailCard.scss';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  index: PropTypes.number,
  thumbnail: PropTypes.object,
};

const ThumbnailCard = ({ onChange, checked, index, thumbnail }) => {
  let img = null;
  const { t } = useTranslation();
  const altText = `${t('component.thumbnailsPanel')} ${thumbnail.pageNumber} `;

  if (thumbnail) {
    let src;
    if (thumbnail.currentSrc) {
      src = thumbnail.currentSrc;
    } else if (thumbnail.url) {
      src = thumbnail.url;
    } else if (thumbnail.toDataURL) {
      src = thumbnail.toDataURL();
    }

    img = <img className="thumb-card-img" alt={altText} src={src} />;
  }

  return (
    <div className="thumb-card" onClick={onChange}>
      <div className='thumb-body'>
        <div className="thumb-image">
          {img}
        </div>
        <Choice
          id={`custom-checkbox-${index}`}
          className="thumb-checkbox"
          name={`thumb${index}`}
          checked={checked}
        />
      </div>
      <div className="thumb-card-title">{index + 1}</div>
    </div>
  );
};

ThumbnailCard.propTypes = propTypes;

export default ThumbnailCard;