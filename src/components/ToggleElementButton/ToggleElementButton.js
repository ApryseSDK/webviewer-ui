import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Button from 'components/Button';
import Icon from 'components/Icon';

import selectors from 'selectors';
import actions from 'actions';
import useMedia from 'hooks/useMedia';

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
    // hack for new ui
    if (ownProps.element === 'searchPanel') {
      dispatch(actions.closeElement('notesPanel'));
    } else if (ownProps.element === 'notesPanel') {
      dispatch(actions.closeElement('searchPanel'));
    }
    dispatch(actions.toggleElement(ownProps.element));
  },
});

const ConnectedToggleElementButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleElementButton);

export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedToggleElementButton {...props} isMobile={isMobile} />
  );
};
