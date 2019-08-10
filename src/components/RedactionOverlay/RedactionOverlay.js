import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';

import ActionButton from 'components/ActionButton';
import ToolButton from 'components/ToolButton';
import Button from 'components/Button';

import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import getClassName from 'helpers/getClassName';
import applyRedactions from 'helpers/applyRedactions';
import { isDesktop } from 'helpers/device';

import actions from 'actions';
import selectors from 'selectors';
import core from 'core';

import defaultTool from 'constants/defaultTool';

import './RedactionOverlay.scss';

class RedactionOverlay extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
    applyRedactions: PropTypes.func.isRequired,
    setActiveToolGroup: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto',
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      const { closeElements, setActiveToolGroup } = this.props;
      closeElements([
        'menuOverlay',
        'toolsOverlay',
        'viewControlsOverlay',
        'searchOverlay',
        'toolStylePopup',
      ]);

      core.setToolMode('AnnotationCreateRedaction');
      setActiveToolGroup('redactTools');
      if (this.overlay && this.overlay.current) {
        this.setState(
          getOverlayPositionBasedOn('redactionButton', this.overlay),
        );
      }
    }
  }

  handleClickOutside = e => {
    const toolStylePopup = document.querySelector(
      '[data-element="toolStylePopup"]',
    );
    const header = document.querySelector('[data-element="header"]');
    const clickedToolStylePopup = toolStylePopup?.contains(e.target);
    const clickedHeader = header?.contains(e.target);

    if (isDesktop() && !clickedToolStylePopup && !clickedHeader) {
      this.props.closeElements(['redactionOverlay']);
    }
  };

  handleApplyButtonClick = () => {
    const { closeElements, applyRedactions } = this.props;
    closeElements(['redactionOverlay']);
    applyRedactions();
  };

  handleCloseClick = () => {
    core.setToolMode(defaultTool);
    this.props.closeElements(['toolStylePopup', 'redactionOverlay']);
  };

  render() {
    const { left, right } = this.state;
    const { isDisabled, isOpen } = this.props;

    if (isDisabled || !isOpen || !core.isCreateRedactionEnabled()) {
      return null;
    }
    const showApply = core.isApplyRedactionEnabled();

    const className = getClassName('Overlay RedactionOverlay', this.props);

    return (
      // TODO ask if there an easy way to keep the tool group as "redact"
      <div
        className={className}
        ref={this.overlay}
        style={{ left, right }}
        data-element="redactionOverlay"
      >
        <ToolButton toolName="AnnotationCreateRedaction" />
        {showApply && (
          <ActionButton
            dataElement="applyAllButton"
            title="action.applyAll"
            img="ic_check_black_24px"
            onClick={this.handleApplyButtonClick}
          />
        )}

        <div className="spacer hide-in-desktop" />
        <Button
          className="close hide-in-desktop"
          dataElement="toolsOverlayCloseButton"
          img="ic_check_black_24px"
          onClick={this.handleCloseClick}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'redactionOverlay'),
  isOpen: selectors.isElementOpen(state, 'redactionOverlay'),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  setActiveToolGroup: toolGroup =>
    dispatch(actions.setActiveToolGroup(toolGroup)),
  applyRedactions: () => dispatch(applyRedactions()),
  closeElements: dataElements => dispatch(actions.closeElements(dataElements)),
  openElements: dataElements => dispatch(actions.openElements(dataElements)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(onClickOutside(RedactionOverlay)));
