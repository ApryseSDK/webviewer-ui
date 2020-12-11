import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Button from 'components/Button';
import defaultTool from 'constants/defaultTool';

import core from 'core';
import getToolStyles from 'helpers/getToolStyles';
import getFillColor from 'helpers/getFillColor';
import { mapToolNameToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import DataElementWrapper from 'components/DataElementWrapper';

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
    lastPickedToolForGroup: PropTypes.string,
    allButtonsInGroupDisabled: PropTypes.bool,
    openElement: PropTypes.func.isRequired,
    toggleElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    setActiveToolGroup: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    showColor: PropTypes.string,
    iconColorKey: PropTypes.string,
  };

  onClick = () => {
    const {
      setActiveToolGroup,
      isActive,
      closeElement,
      openElement,
      toolGroup,
      toolNames,
      lastPickedToolForGroup,
    } = this.props;

    if (isActive) {
      closeElement('toolStylePopup');
      core.setToolMode(defaultTool);
      setActiveToolGroup('');
    } else {
      closeElement('toolStylePopup');
      if (toolGroup === 'signatureTools' || toolGroup === 'rubberStampTools') {
        core.setToolMode(defaultTool);
      } else {
        core.setToolMode(lastPickedToolForGroup || toolNames[0]);
      }
      setActiveToolGroup(toolGroup);
      openElement('toolsOverlay');
    }
  };

  render() {
    const {
      toolNames,
      lastPickedToolForGroup,
      isActive,
      mediaQueryClassName,
      dataElement,
      toolButtonObjects,
      allButtonsInGroupDisabled,
      iconColorKey,
      showColor,
      title,
    } = this.props;
    const toolName = lastPickedToolForGroup || toolNames[0];
    const img = this.props.img
      ? this.props.img
      : toolButtonObjects[toolName]?.img;
    let color = '';
    let fillColor = '';
    if (showColor !== 'never' && isActive) {
      const toolStyles = getToolStyles(toolName);
      if (iconColorKey) {
        color = toolStyles[iconColorKey]?.toHexString?.();
      }
      fillColor = getFillColor(toolStyles.FillColor);
    }

    return allButtonsInGroupDisabled ? null : (
      <DataElementWrapper
        className={classNames({
          'tool-group-button': true,
          active: isActive,
        })}
        dataElement={dataElement}
      >
        <Button
          title={title}
          mediaQueryClassName={mediaQueryClassName}
          isActive={isActive}
          img={img}
          color={color}
          fillColor={fillColor}
          dataElement={dataElement}
          onClick={this.onClick}
        />
      </DataElementWrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  lastPickedToolForGroup: selectors.getLastPickedToolForGroup(state, ownProps.toolGroup),
  savedSignatures: selectors.getSavedSignatures(state),
  isActive: selectors.getActiveToolGroup(state) === ownProps.toolGroup,
  activeToolName: selectors.getActiveToolName(state),
  toolNames: selectors.getToolNamesByGroup(state, ownProps.toolGroup),
  toolButtonObjects: selectors.getToolButtonObjects(state),
  allButtonsInGroupDisabled: selectors.allButtonsInGroupDisabled(state, ownProps.toolGroup),
  iconColorKey: selectors.getIconColor(
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
