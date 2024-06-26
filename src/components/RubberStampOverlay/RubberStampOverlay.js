/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import { isMobileSize } from 'helpers/getDeviceSize';
import { Tabs, Tab, TabPanel, TabHeader } from 'components/Tabs';
import Icon from 'components/Icon';
import DataElementWrapper from 'components/DataElementWrapper';

import { Swipeable } from 'react-swipeable';

import './RubberStampOverlay.scss';
import DataElements from 'constants/dataElement';

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
    this.stampToolArray = core.getToolsFromAllDocumentViewers(TOOL_NAME);
  }

  async setRubberStamp(annotation, index) {
    core.setToolMode(TOOL_NAME);
    this.props.closeElement('toolStylePopup');
    for (let tool of this.stampToolArray) {
      const text = this.props.t(`rubberStamp.${annotation['Icon']}`);
      await tool.setRubberStamp(annotation, text);
      tool.showPreview();
      this.props.setSelectedStampIndex(index);
    }
  }

  openCustomSampModal = () => {
    const { openElement } = this.props;
    openElement('customStampModal');
  };

  deleteCustomStamp = index => {
    for (let tool of this.stampToolArray) {
      const stamps = tool.getCustomStamps();
      tool.deleteCustomStamps([stamps[index]]);
    }
  };

  render() {
    const { isMobile, standardStamps, customStamps } = this.props;

    const rubberStamps = standardStamps.map(({ imgSrc, annotation }, index) => (
      <button
        key={index}
        className="rubber-stamp"
        aria-label={`${this.props.t('annotation.stamp')} ${index + 1}`}
        onClick={() => this.setRubberStamp(annotation, index)}
      >
        <img src={imgSrc} alt="" />
      </button>
    ));

    const customImgs = customStamps.map(({ imgSrc, annotation }, index) => (
      <div key={index} className="stamp-row">
        <button
          className="stamp-row-content custom-stamp"
          aria-label={`${this.props.t('annotation.rubberStamp')} ${index + 1}`}
          onClick={() => this.setRubberStamp(annotation, standardStamps.length + index)}
        >
          <img src={imgSrc} alt="" />
        </button>
        <DataElementWrapper
          dataElement={DataElements.DELETE_CUSTOM_STAMP_BUTTON}
          className="icon"
          onClick={() => this.deleteCustomStamp(index)}>
          <Icon glyph="icon-delete-line" />
        </DataElementWrapper>
      </div>
    ));

    return (
      <div className="rubber-stamp-overlay" data-element="rubberStampOverlay">
        <div className="accordion" title={this.props.t('tool.Standard')}>
          <span className='title'>{this.props.t('tool.Standard')}</span>
        </div>
        <div className="accordion-panel">
          {/* Using Swipeable to stop the bubbling of swiping events when scrolling
             * Don't know a better way of doing this
             */}
            <Swipeable
              className="standard-stamp-panel"
              onSwiped={({ event }) => {
                event.stopPropagation();
              }}
            >
              {rubberStamps}
            </Swipeable>
        </div>
        <div className="accordion" title={this.props.t('tool.Dynamic')}>
          <span className='title'>{this.props.t('tool.Dynamic')}</span>
          <span className='buttons'>
            <button type='button' className='stamp-row-content add-btn' title='Add New Dynamic Stamp' onClick={this.openCustomSampModal}>Add</button>
          </span>
        </div>
        <div className="accordion-panel">
          <div className="dynamic-stamp-panel">{customImgs}</div>
        </div>
        <div className="accordion" title={this.props.t('tool.Custom')}>
          <span className='title'>{this.props.t('tool.Custom')}</span>
          <span className='buttons'>
            <button type='button' className='stamp-row-content add-btn' title='Add New Custom Stamp'>Add</button>
            <button type='button' className='stamp-row-content add-btn' title='Manage Custom Stamps'>Manage</button>
          </span>
        </div>
        <div className="accordion-panel">
          <div className="custom-stamp-panel">{customImgs}</div>
        </div>
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

const ConnectedRubberStampOverlay = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(RubberStampOverlay));

export default props => {
  const isMobile = isMobileSize();

  return <ConnectedRubberStampOverlay {...props} isMobile={isMobile} />;
};
