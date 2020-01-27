import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { connect } from 'react-redux';
import classNames from 'classnames';

import StylePopup from 'components/StylePopup';
import getToolStylePopupPositionBasedOn from 'helpers/getToolStylePopupPositionBasedOn';
import getClassName from 'helpers/getClassName';
import setToolStyles from 'helpers/setToolStyles';
import { isMobile } from 'helpers/device';
import { mapToolNameToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';

import './ToolStylePopup.scss';

class ToolStylePopup extends React.PureComponent {
  static propTypes = {
    activeToolName: PropTypes.string,
    activeToolStyle: PropTypes.object,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    toolButtonObjects: PropTypes.object.isRequired,
    colorMapKey: PropTypes.string,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.popup = React.createRef();
    this.state = {
      left: 0,
      top: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.close);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && !this.props.isDisabled) {
      this.props.closeElements([
        'viewControlsOverlay',
        'searchOverlay',
        'menuOverlay',
        'signatureOverlay',
        'zoomOverlay',
        'redactionOverlay',
      ]);
      this.positionToolStylePopup();
    }

    const selectedAnotherTool =
      prevProps.activeToolName !== this.props.activeToolName;
    if (selectedAnotherTool && !this.props.isDisabled) {
      this.positionToolStylePopup();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.close);
  }

  handleClick = e => {
    // in the mobile version, this component is viewport height minus the header height
    // with the sub component stylePopup being 100% height so handleClickOutside won't get called
    // when we click outside because we are always clicking on this component
    // as a result we have this handler to specifically close this component
    // if this comment is removed, please also remove the comment in handleClick, AnnotationStylePopup.js
    if (isMobile() && e.target === e.currentTarget) {
      this.props.closeElement('toolStylePopup');
    }
  };

  handleClickOutside = e => {
    const toolsOverlay = document.querySelector(
      '[data-element="toolsOverlay"]',
    );
    const header = document.querySelector('[data-element="header"]');
    const clickedToolsOverlay = toolsOverlay?.contains(e.target);
    const clickedHeader = header?.contains(e.target);

    if (!clickedToolsOverlay && !clickedHeader) {
      this.close();
    }
  };

  close = () => {
    this.props.closeElement('toolStylePopup');
  };

  handleStyleChange = (property, value) => {
    setToolStyles(this.props.activeToolName, property, value);
  };

  positionToolStylePopup = () => {
    const { toolButtonObjects, activeToolName } = this.props;
    const dataElement = toolButtonObjects[activeToolName].dataElement;
    const toolButton = document.querySelectorAll(
      `.Header [data-element=${dataElement}], .ToolsOverlay [data-element=${dataElement}]`,
    )[0];

    if (!toolButton) {
      return;
    }

    const { left, top } = getToolStylePopupPositionBasedOn(
      toolButton,
      this.popup,
    );

    this.setState({ left, top });
  };

  render() {
    const { isDisabled, activeToolName, activeToolStyle, siblingWidth } = this.props;
    const isFreeText = activeToolName === 'AnnotationCreateFreeText';
    const colorMapKey = mapToolNameToKey(activeToolName);

    if (isDisabled) {
      return null;
    }
    const hideSlider = activeToolName === 'AnnotationCreateRedaction';

    return (
      <div
        className={classNames({
          ToolStylePopup: true,
        })}
        style={{ width: siblingWidth }}
        data-element="toolStylePopup"
        ref={this.popup}
        onClick={this.handleClick}
      >
        <StylePopup
          key={activeToolName}
          colorMapKey={colorMapKey}
          style={activeToolStyle}
          isFreeText={isFreeText}
          hideSlider={hideSlider}
          onStyleChange={this.handleStyleChange}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeToolName: selectors.getActiveToolName(state),
  activeToolStyle: selectors.getActiveToolStyles(state),
  isDisabled: selectors.isElementDisabled(state, 'toolStylePopup'),
  isOpen: selectors.isElementOpen(state, 'toolStylePopup'),
  toolButtonObjects: selectors.getToolButtonObjects(state),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
  closeElements: actions.closeElements,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(onClickOutside(ToolStylePopup));
