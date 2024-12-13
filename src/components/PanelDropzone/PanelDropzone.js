import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import './PanelDropzone.scss';
import { useDroppable } from '@dnd-kit/core';

const PanelDropzone = (props) => {
  const { location = 'left' } = props;
  const id = location === 'left' ? 'left-panel-dropzone' : 'right-panel-dropzone';

  const { isOver, setNodeRef, active } = useDroppable({
    id: id,
    data: { type: 'panel-dropzone', location },
  });

  const isAllowed = active?.data?.current?.type === 'panel';

  const openLeftPanel = useSelector((state) =>  selectors.getOpenGenericPanel(state, 'left'));
  const leftPanelWidth = useSelector((state) => selectors.getLeftPanelWidthWithResizeBar(state));
  const openRightPanel = useSelector((state) => selectors.getOpenGenericPanel(state, 'right'));
  const rightPanelWidth = useSelector((state) => selectors.getOpenRightPanelWidth(state));
  const isInEditorMode = useSelector((state) => selectors.isInEditorMode(state));

  const leftStyle = openLeftPanel ? { 'left': leftPanelWidth } : null;
  const rightStyle = () => {
    if (location === 'right') {
      return openRightPanel ? { 'right': rightPanelWidth } : { 'right': '0px' };
    }
  };

  const style = location === 'left' ? leftStyle : rightStyle();

  const className = classNames({ 'PanelDropzone': true, 'is-over': isOver && isAllowed });

  if (isInEditorMode) {
    return (
      <div className={className} ref={setNodeRef} style={style} data-element={'left-panel-dropzone'}>
        Panel Dropzone
      </div>
    );
  }
  return null;
};

PanelDropzone.propTypes = {
  children: PropTypes.node,
  isCustom: PropTypes.bool,
  dataElement: PropTypes.string,
  location: PropTypes.string,
};

export default PanelDropzone;