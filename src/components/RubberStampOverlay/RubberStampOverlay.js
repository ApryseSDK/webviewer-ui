import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import useMedia from 'hooks/useMedia';

import { Swipeable } from 'react-swipeable';

import './RubberStampOverlay.scss';

const TOOL_NAME = 'AnnotationCreateRubberStamp';

class RubberStampOverlay extends React.Component {
  static propTypes = {
    activeToolName: PropTypes.string,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    isMobile: PropTypes.bool,
    isActive: PropTypes.bool,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.any,
    toolButtonObjects: PropTypes.object.isRequired,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
    dataElement: PropTypes.string.isRequired,
    toggleElement: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.stampTool = core.getTool(TOOL_NAME);
  }

  setRubberStamp(annotation, index) {
    const { closeElement, setSelectedStamp } = this.props;
    core.setToolMode(TOOL_NAME);
    this.props.closeElement("toolStylePopup");
    const text = this.props.t(`rubberStamp.${annotation['Icon']}`);
    this.stampTool.setRubberStamp(annotation, text);
    this.stampTool.showPreview();
    this.props.setSelectedStampIndex(index);
  }

  render() {
    const { isMobile, defaultStamps } = this.props;

    const rubberStamps = defaultStamps.map(({ imgSrc, annotation }, index) =>
      <div key={index}
        className="rubber-stamp"
        onClick={() => {
          this.setRubberStamp(annotation, index);
        }}
      >
        <img src={imgSrc} />
      </div>,
    );

    return (
      <div
        className={classNames({
          Popup: true,
          StylePopup: true,
          mobile: isMobile,
        })}
        data-element="stylePopup"
      >
        <Swipeable
          onSwipedUp={() => this.props.closeElement('toolsOverlay')}
          onSwipedDown={() => this.props.closeElement('toolsOverlay')}
          preventDefaultTouchmoveEvent
        >
          <div
            className="rubber-stamp-overlay"
            data-element="rubberStampOverlay"
          >
            <div className="default-stamps-container">
              {rubberStamps}
            </div>
          </div>
        </Swipeable>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  activeToolName: selectors.getActiveToolName(state),
  isActive: selectors.getActiveToolName(state) === TOOL_NAME,
  toolButtonObjects: selectors.getToolButtonObjects(state),
  dataElement: selectors.getToolButtonObjects(state)[TOOL_NAME].dataElement,
  defaultStamps: selectors.getDefaultStamps(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  closeElement: actions.closeElement,
  openElement: actions.openElement,
  toggleElement: actions.toggleElement,
  setSelectedStampIndex: actions.setSelectedStampIndex,
};

const ConnectedRubberStampOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(RubberStampOverlay));


export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedRubberStampOverlay {...props} isMobile={isMobile} />
  );
};
