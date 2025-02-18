import React from 'react';
import ToggleElementButton from '../ToggleElementButton';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const ViewControlsToggleButton = ({ className }) => {
  return (
    <div>
      <ToggleElementButton
        dataElement="view-controls-toggle-button"
        className={classNames({
          'viewControlsToggleButton': true,
          [className]: true,
        })}
        title="component.viewControls"
        disabled={false}
        img="icon-header-page-manipulation-line"
        toggleElement="viewControlsFlyout"
      />
    </div>
  );
};

ViewControlsToggleButton.propTypes = {
  className: PropTypes.string,
};

export default ViewControlsToggleButton;
