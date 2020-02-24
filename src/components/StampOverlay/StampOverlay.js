import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import getToolStylePopupPositionBasedOn from 'helpers/getToolStylePopupPositionBasedOn';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import defaultTool from 'constants/defaultTool';
import useMedia from 'hooks/useMedia';

import './StampOverlay.scss';

const TOOL_NAME = 'AnnotationCreateRubberStamp';
const canvasWidth = 160;
const canvasHeight = 58;


class StampOverlay extends React.Component {
  static propTypes = {
    activeToolName: PropTypes.string,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
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
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto',
      top: 0,
      defaultAnnotations: [],
      isStampSelected: false,
    };
    this.stampTool = core.getTool(TOOL_NAME);
  }

  componentDidMount() {
    this.getDefaultRubberStamps();
  }

  componentDidUpdate(prevProps) {
    // if language changes while overlay is open we wanted update it
    const isLanguageChanged = this.props.i18n.language !== prevProps.i18n.language;
    if (isLanguageChanged) {
      this.getDefaultRubberStamps();
    }
  }

  setOverlayPosition = () => {
    const rubberStampToolButton = document.querySelector(
      `[data-element="${this.props.dataElement}"]`,
    );

    if (rubberStampToolButton && this.overlay.current) {
      const res = getToolStylePopupPositionBasedOn(rubberStampToolButton, this.overlay);
      this.setState(res);
    }
  }

  setRubberStamp(annotation) {
    core.setToolMode(TOOL_NAME);
    if (this.props.isMobile) {
      this.props.closeElement('toolsOverlay');
    }
    const text = this.props.t(`rubberStamp.${annotation['Icon']}`);
    this.stampTool.setRubberStamp(annotation, text);
    this.stampTool.showPreview();

    this.setState({ isStampSelected: true });
  }

  getDefaultRubberStamps = async() => {
    const annotations = this.stampTool.getDefaultStampAnnotations();
    const previews = await Promise.all(
      annotations.map(annotation => {
        const text = this.props.t(`rubberStamp.${annotation['Icon']}`);

        const options = {
          canvasWidth,
          canvasHeight,
          text,
        };

        return this.stampTool.getPreview(annotation, options);
      }),
    );

    const defaultAnnotations = annotations.map((annotation, i) => ({
      annotation,
      imgSrc: previews[i],
    }));

    this.setState({ defaultAnnotations });
  }

  render() {
    const { defaultAnnotations } = this.state;

    const rubberStamps = defaultAnnotations.map(({ imgSrc, annotation }, index) =>
      <div key={index}
        className="rubber-stamp"
        onClick={() => {
          this.setRubberStamp(annotation)
        }}
      >
        <img src={imgSrc} />
      </div>,
    );

    const className = classNames({
      'StampOverlay': true,
    });

    return (
      <div
        className={className}
        ref={this.overlay}
        data-element="stampOverlay"
      >
        <div className="default-stamp-container">
          {rubberStamps}
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  activeToolName: selectors.getActiveToolName(state),
  isActive: selectors.getActiveToolName(state) === TOOL_NAME,
  toolButtonObjects: selectors.getToolButtonObjects(state),
  dataElement: selectors.getToolButtonObjects(state)[TOOL_NAME].dataElement,
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  closeElement: actions.closeElement,
  openElement: actions.openElement,
  toggleElement: actions.toggleElement,
};

const ConnectedStampOverlay = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(StampOverlay));


export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedStampOverlay {...props} isMobile={isMobile} />
  );
};
