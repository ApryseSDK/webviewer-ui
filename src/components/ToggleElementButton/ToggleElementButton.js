import React from 'react';
import { connect } from 'react-redux';

import Button from 'components/Button';
import Icon from 'components/Icon';

import selectors from 'selectors';
import actions from 'actions';

<<<<<<< HEAD
import './ToggleElementButton.scss';

const ToggleElementButton = ({
  onClick,
  showDownArrow = false,
  dataElement,
  isElementDisabled,
  ...restProps
}) => {
  if (isElementDisabled) {
    return null;
  }

  return (
    <div
      className="toggle-element-button"
      data-element={dataElement}
      onClick={onClick}
    >
      <Button {...restProps} />
      {showDownArrow && <Icon className="down-arrow " glyph="icon-chevron-down" />}
    </div>
  );
};

=======
>>>>>>> 8c5d6d44ea5ab1ca6758128fe6c8512f7969699e
const mapStateToProps = (state, ownProps) => {
  let isActive = selectors.isElementOpen(state, ownProps.element);
  if (ownProps.dataElement === 'redactionButton') {
    const isToolActive = selectors.getActiveToolName(state);
    isActive = isActive || isToolActive === 'AnnotationCreateRedaction';
  }

  return {
<<<<<<< HEAD
    isElementDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
=======
    className: ownProps.className || 'ToggleElementButton',
>>>>>>> 8c5d6d44ea5ab1ca6758128fe6c8512f7969699e
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
    }
    dispatch(actions.toggleElement(ownProps.element));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleElementButton);
