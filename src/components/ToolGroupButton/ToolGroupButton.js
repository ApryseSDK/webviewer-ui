import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Button from 'components/Button';
import defaultTool from 'constants/defaultTool';

import core from 'core';
import getToolStyles from 'helpers/getToolStyles';
import { mapToolNameToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';

import './ToolGroupButton.scss';

class ToolGroupButton extends React.PureComponent {
  static propTypes = {
    activeToolName: PropTypes.string.isRequired,
    toolGroup: PropTypes.string.isRequired,
    mediaQueryClassName: PropTypes.string.isRequired,
    dataElement: PropTypes.string.isRequired,
    img: PropTypes.string,
    title: PropTypes.string,
    toolNames: PropTypes.arrayOf(PropTypes.string),
    toolButtonObjects: PropTypes.object,
    allButtonsInGroupDisabled: PropTypes.bool,
    isToolGroupButtonDisabled: PropTypes.bool,
    openElement: PropTypes.func.isRequired,
    toggleElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    setActiveToolGroup: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    showColor: PropTypes.string,
    palette: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      toolName: props.toolNames[0],
    };
  }

  componentDidUpdate(prevProps) {
    const activeToolNameChanged = prevProps.activeToolName !== this.props.activeToolName;
    const wasActiveToolNameInGroup = prevProps.toolNames.includes(prevProps.activeToolName);
    const isActiveToolNameInGroup = this.props.toolNames.includes(this.props.activeToolName);
    const toolNamesLengthChanged = prevProps.toolNames.length !== this.props.toolNames.length;

    if (activeToolNameChanged && isActiveToolNameInGroup) {
      this.setState({ toolName: this.props.activeToolName });
    }

    if (toolNamesLengthChanged && !this.props.toolNames.includes(this.state.toolName)) {
      this.setState({ toolName: this.props.toolNames[0] });
    }

    if (toolNamesLengthChanged && !wasActiveToolNameInGroup && isActiveToolNameInGroup) {
      this.setState({ toolName: this.props.activeToolName });
      this.props.setActiveToolGroup(this.props.toolGroup);
    }

    if (!this.props.isActive) {
      this.setState({ toolName: this.props.toolNames[0] });
    }
  }

  onClick = e => {
    const {
      setActiveToolGroup,
      isActive,
      closeElement,
      openElement,
      toolGroup,
      savedSignatures,
    } = this.props;
    const { toolName } = this.state;

    if (isActive) {
      closeElement('toolStylePopup');
      closeElement('toolsOverlay');
      core.setToolMode(defaultTool);
      setActiveToolGroup('');
    } else {
      closeElement('toolStylePopup');
      if (toolGroup === 'signatureTools' || toolGroup === 'rubberStampTools') {
        core.setToolMode(defaultTool);
      } else {
        core.setToolMode(toolName);
      }
      setActiveToolGroup(toolGroup);
      if (toolGroup === 'signatureTools' && savedSignatures.length === 0) {
        openElement('signatureModal');
      }
      openElement('toolsOverlay');
    }
  };

  render() {
    const {
      mediaQueryClassName,
      dataElement,
      toolButtonObjects,
      isActive,
      isToolGroupButtonDisabled,
      allButtonsInGroupDisabled,
      palette,
      showColor,
      title,
    } = this.props;
    const { toolName } = this.state;
    const img = this.props.img
      ? this.props.img
      : toolButtonObjects[toolName]?.img;
    const color =
      (showColor !== 'never' && isActive) && palette
        ? getToolStyles(toolName)[palette] &&
          getToolStyles(toolName)[palette].toHexString()
        : '';

    return (isToolGroupButtonDisabled || allButtonsInGroupDisabled) ? null : (
      <div
        className={classNames({
          'tool-group-button': true,
          active: isActive,
        })}
        data-element={dataElement}
        onClick={this.onClick}
      >
        <Button
          title={title}
          mediaQueryClassName={mediaQueryClassName}
          isActive={isActive}
          img={img}
          color={color}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  savedSignatures: selectors.getSavedSignatures(state),
  isActive: selectors.getActiveToolGroup(state) === ownProps.toolGroup,
  activeToolName: selectors.getActiveToolName(state),
  toolNames: selectors.getToolNamesByGroup(state, ownProps.toolGroup),
  toolButtonObjects: selectors.getToolButtonObjects(state),
  isToolGroupButtonDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
  allButtonsInGroupDisabled: selectors.allButtonsInGroupDisabled(state, ownProps.toolGroup),
  palette: selectors.getIconColor(
    state,
    mapToolNameToKey(selectors.getActiveToolName(state)),
  ),
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  toggleElement: actions.toggleElement,
  closeElement: actions.closeElement,
  setActiveToolGroup: actions.setActiveToolGroup,
};

const ConnectedToolGroupButton = connect(mapStateToProps, mapDispatchToProps)(ToolGroupButton);

export default props => {
  const isTabletAndMobile = useMedia(
    // Media queries
    ['(max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedToolGroupButton {...props} isTabletAndMobile={isTabletAndMobile} />
  );
};
