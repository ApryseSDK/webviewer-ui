import React from 'react';
import ActionButton from 'components/ActionButton';
import core from 'core';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';

const propTypes = {
  styleType: PropTypes.string.isRequired,
};

const FontStyleToggleButton = ({
  styleType,
}) => {
  const [
    isActive,
  ] = useSelector(
    (state) => [
      selectors.isStyleButtonActive(state, styleType),
    ],
    shallowEqual,
  );

  return (
    <ActionButton
      key='bold'
      isActive={isActive}
      onClick={() => {
        core.getOfficeEditor().updateSelectionAndCursorStyle({ [styleType]: true });
      }}
      dataElement={`office-editor-${styleType}`}
      title={`officeEditor.${styleType}`}
      img={`icon-text-${styleType}`}
    />
  );
};

FontStyleToggleButton.propTypes = propTypes;

export default FontStyleToggleButton;