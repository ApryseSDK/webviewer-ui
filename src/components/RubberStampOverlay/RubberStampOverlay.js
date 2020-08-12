/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import useMedia from 'hooks/useMedia';
import { Tabs, Tab, TabPanel } from 'components/Tabs';
import Icon from 'components/Icon';

import { Swipeable } from 'react-swipeable';

import './RubberStampOverlay.scss';

const TOOL_NAME = 'AnnotationCreateRubberStamp';

const propTypes = {
  standardStamps: PropTypes.array.isRequired,
  customStamps: PropTypes.array.isRequired,
  setSelectedStampIndex: PropTypes.func.isRequired,
};

class RubberStampOverlay extends React.Component {
  static propTypes = {
    activeToolName: PropTypes.string,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    isMobile: PropTypes.bool,
    isActive: PropTypes.bool,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.any,
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
    core.setToolMode(TOOL_NAME);
    this.props.closeElement("toolStylePopup");
    const text = this.props.t(`rubberStamp.${annotation['Icon']}`);
    this.stampTool.setRubberStamp(annotation, text);
    this.stampTool.showPreview();
    this.props.setSelectedStampIndex(index);
  }

  openCustomSampModal = () => {
    const { openElement } = this.props;
    openElement('customStampModal');
  }

  deleteCustomStamp = index => {
    const stamps = this.stampTool.getCustomStamps();
    stamps.splice(index, 1);
    this.stampTool.setCustomStamps(stamps);
  }

  render() {
    const { isMobile, standardStamps, customStamps } = this.props;

    const rubberStamps = standardStamps.map(({ imgSrc, annotation }, index) =>
      <div key={index} className="rubber-stamp" onClick={() => this.setRubberStamp(annotation, index)}>
        <img src={imgSrc} alt="" />
      </div>,
    );

    const customImgs = customStamps.map(({ imgSrc, annotation }, index) =>
      <div key={index}  className="stamp-row">
        <div className="stamp-row-content" onClick={() => this.setRubberStamp(annotation, standardStamps.length + index)}>
          <img src={imgSrc} alt=""/>
        </div>
        <div className="icon" onClick={() => this.deleteCustomStamp(index)}>
          <Icon glyph="icon-delete-line"/>
        </div>
      </div>,
    );

    return (
      <div
        className="rubber-stamp-overlay"
        data-element="rubberStampOverlay"
      >
        <Tabs id="rubberStampTab">
          <div className="header tab-header">
            <div className="tab-list">
              <Tab dataElement="standardStampPanelButton">
                <div className="tab-options-button">
                  {this.props.t(`tool.Standard`)}
                </div>
              </Tab>
              <div className="tab-options-divider" />
              <Tab dataElement="customStampPanelButton">
                <div className="tab-options-button">
                  {this.props.t(`tool.Custom`)}
                </div>
              </Tab>
            </div>
          </div>

          <TabPanel dataElement="standardStampPanel">
            {/* Using Swipeable to stop the bubbling of swiping events when scrolling
              * Don't know a better way of doing this
              */}
            <Swipeable
              className="standard-stamp-panel"
              onSwiped={({ event }) => {
                event.stopPropagation();
              }}
            >
              { rubberStamps }
            </Swipeable>
          </TabPanel>
          <TabPanel dataElement="customStampPanel">
            <div className="custom-stamp-panel">
              { customImgs }
            </div>
            <div className={classNames({
                'stamp-row-content': true,
                'add-btn': true,
              })}
              onClick={this.openCustomSampModal}
            >
              {this.props.t(`component.createStampButton`)}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

RubberStampOverlay.propTypes = propTypes;

const mapStateToProps = state => ({
  activeToolName: selectors.getActiveToolName(state),
  isActive: selectors.getActiveToolName(state) === TOOL_NAME,
  dataElement: selectors.getToolButtonObjects(state)[TOOL_NAME].dataElement,
  standardStamps: selectors.getStandardStamps(state),
  customStamps: selectors.getCustomStamps(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  closeElement: actions.closeElement,
  openElement: actions.openElement,
  toggleElement: actions.toggleElement,
  setSelectedStampIndex: actions.setSelectedStampIndex,
  setStandardStamps: actions.setStandardStamps,
  setCustomStamps: actions.setCustomStamps,
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
