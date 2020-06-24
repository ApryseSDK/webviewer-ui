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
  // componentDidMount() {
  //   // this.getStandardRubberStamps();
  //   // this.getDynamicRubberStamps();
  //   // this.props.setStandardStamps(this.props.t);
  //   // this.props.setDynamicdStamps(this.props.t);
  //   this.stampTool.on('stampsAdded', this.onStampAdded);
  // }
  // componentWillUnmount() {
  //   this.stampTool.off('stampsAdded', this.onStampAdded);
  // }
  // onStampAdded = () => {
  //   this.props.setStandardStamps(this.props.t);
  //   this.props.setDynamicdStamps(this.props.t);
  // }

  setRubberStamp(annotation, index) {
    const { closeElement, setSelectedStamp } = this.props;
    core.setToolMode(TOOL_NAME);
    this.props.closeElement("toolStylePopup");
    const text = this.props.t(`rubberStamp.${annotation['Icon']}`);
    this.stampTool.setRubberStamp(annotation, text);
    this.stampTool.showPreview();
    this.props.setSelectedStampIndex(index);
  }
<<<<<<< HEAD

<<<<<<< HEAD
=======
>>>>>>> parent of db73a019... Update 2
  openCustomSampModal = () => {
    const { openElement } = this.props;
    openElement('customStampModal');
  }
  render() {
    const { isMobile, standardStamps, dynamicStamps } = this.props;

    const StandardLabel =  this.props.t(`tool.Standard`);
    const DynamicLabel = this.props.t(`tool.Dynamic`);
    const ButtonLabel = this.props.t(`component.createStampButton`);

    const rubberStamps = standardStamps.map(({ imgSrc, annotation }, index) =>
      <div key={index} className="rubber-stamp" onClick={() => this.setRubberStamp(annotation, index)}>
        <img src={imgSrc} alt="" />
      </div>,
    );

    const customImgs = dynamicStamps.map(({ imgSrc, annotation }, index) =>
      <div key={index}  className="stamp-row">
        <div className="stamp-row-content">
          <img src={imgSrc} alt=""/>
        </div>

        <div className="icon" onClick={() => deleteSignature(i)}>
          <Icon glyph="icon-delete-line"/>
        </div>
=======
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
>>>>>>> parent of 0e6cb079... Update
      </div>,
      // <div key={index} className="rubber-stamp-2"  onClick={() => this.setRubberStamp(annotation, index)}>
      //   <img src={imgSrc} alt=""/>
      //   <Icon glyph="icon-delete-line"/>
      // </div>,
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
            {/* <div className="default-stamps-container">
              {rubberStamps}
            </div> */}

>>>>>>> parent of db73a019... Update 2
            <Tabs id="rubberStampTab">
              <div className="header">
                <div className="tab-list">
                  <Tab dataElement="standardStampPanelButton">
                    <div className="tab-options-button">
                      {StandardLabel}
                    </div>
                  </Tab>
                  <div className="tab-options-divider" />
                  <Tab dataElement="dynamicStampPanelButton">
                    <div className="tab-options-button">
                      {DynamicLabel}
                    </div>
                  </Tab>
                </div>
              </div>

              <TabPanel dataElement="standardStampPanel">
                <div className="stadard-stamp-panel">
                  { rubberStamps }
                </div>
              </TabPanel>
              <TabPanel dataElement="dynamicStampPanel">
                <div className="dynamic-stamp-panel">
                  { customImgs }
                </div>
                  <div className={`add-dynamic-stamp-button enabled`}
                    onClick={this.openCustomSampModal}
                    data-element={'add-dynamic-stamp-button'}
                  >
                    {ButtonLabel}
                 </div>
              </TabPanel>
            </Tabs>

=======
            <div className="default-stamps-container">
              {rubberStamps}
            </div>
>>>>>>> parent of 0e6cb079... Update
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
