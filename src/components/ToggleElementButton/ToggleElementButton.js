import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Button from 'components/Button';
import Icon from 'components/Icon';

import selectors from 'selectors';
import actions from 'actions';

import './ToggleElementButton.scss';

const ToggleElementButton = ({
  onClick,
  showDownArrow = false,
  dataElement,
  isElementDisabled,
  isActive,
  ...restProps
}) => {
  if (isElementDisabled) {
    return null;
  }

  return (
    <div
      className={classNames({
        'toggle-element-button': true,
        active: isActive,
      })}
      data-element={dataElement}
      onClick={onClick}
    >
      <Button isActive={isActive} {...restProps} />
      {showDownArrow && (
        <div className="down-arrow-container">
          <Icon className="down-arrow " glyph="icon-chevron-down" />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  let isActive = selectors.isElementOpen(state, ownProps.element);
  if (ownProps.dataElement === 'redactionButton') {
    const isToolActive = selectors.getActiveToolName(state);
    isActive = isActive || isToolActive === 'AnnotationCreateRedaction';
  }

  return {
    isElementDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
    isActive,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    // hack
    if (ownProps.element === 'searchPanel') {
      dispatch(actions.closeElement('notesPanel'));
    } else if (ownProps.element === 'notesPanel') {
      dispatch(actions.closeElement('searchPanel'));
    } else if (ownProps.element === 'toolsHeader') {
      dispatch(actions.closeElement('header'));
    }
    dispatch(actions.toggleElement(ownProps.element));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleElementButton);
