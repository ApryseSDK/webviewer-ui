import React from 'react';
import PropTypes from 'prop-types';
import DataElementWrapper from 'components/DataElementWrapper';
import DataElements from 'constants/dataElement';

const StylePanelHeader = ({ title }) => {
  if (!title) {
    return null;
  }

  return (
    <DataElementWrapper dataElement={DataElements.StylePanel.STYLE_PANEL_HEADER_CONTAINER}>
      <h2 className="style-panel-header">{title}</h2>
    </DataElementWrapper>
  );
};

StylePanelHeader.propTypes = {
  title: PropTypes.string,
};

export default StylePanelHeader;
