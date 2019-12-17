/* eslint-disable */


import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { isDesktop } from 'helpers/device';
import ToolButton from 'components/ToolButton';
import getClassName from 'helpers/getClassName';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import Button from 'components/Button';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';

import defaultTool from 'constants/defaultTool';

import './StampOverlay.scss';

class StampOverlay extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto',
    };

    this.handleRubberStampClick = this.handleRubberStampClick.bind(this);
  }

  handleClickOutside = e => {
    const toolStylePopup = document.querySelector(
      '[data-element="toolStylePopup"]',
    );
    const header = document.querySelector('[data-element="header"]');
    const clickedToolStylePopup = toolStylePopup?.contains(e.target);
    const clickedHeader = header?.contains(e.target);

    if (isDesktop() && !clickedToolStylePopup && !clickedHeader) {
      this.props.closeElements(['stampOverlay']);
    }
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      const { closeElements, setActiveToolGroup } = this.props;
      // closeElements([
      //   'menuOverlay',
      //   'toolsOverlay',
      //   'viewControlsOverlay',
      //   'searchOverlay',
      //   'toolStylePopup',
      // ]);

      setActiveToolGroup('stampTools');
      if (this.overlay && this.overlay.current) {
        this.setState(
          getOverlayPositionBasedOn('foobar', this.overlay),
        );
      }



    }

    if (this.props.activeToolName === 'AnnotationCreateRubberStamp') {
      this.props.openElement('stampModal');
    }
  }

  handleRubberStampClick() {
    core.setToolMode('AnnotationCreateRubberStamp');
    // this.props.openElement('stampModal');
  }

  render() {
    const { left, right } = this.state;
    const { isDisabled, isOpen } = this.props;

    if (isDisabled || !isOpen || !core.isCreateRedactionEnabled()) {
      return null;
    }
    const className = getClassName('Overlay StampOverlay', this.props);
    return (
      <div
        className={className}
        ref={this.overlay}
        style={{ left, right }}
        data-element="stampOverlay"
      >
        <ToolButton toolName="AnnotationCreateStamp" />
        <ToolButton toolName="AnnotationCreateRubberStamp" onClick={this.handleRubberStampClick} />
        {/* <Button
          img="ic_annotation_stamp_black_24px"
          onClick={this.handleRubberStampClick}
          title="annotation.rubberStamp"
        /> */}
      </div>
    );
  }
}


const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'stampOverlay'),
  isOpen: selectors.isElementOpen(state, 'stampOverlay'),
  activeToolName: selectors.getActiveToolName(state),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  setActiveToolGroup: toolGroup =>
    dispatch(actions.setActiveToolGroup(toolGroup)),
  applyRedactions: () => dispatch(applyRedactions()),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements)),
  openElement: dataElement => dispatch(actions.openElement(dataElement)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(onClickOutside(StampOverlay));