import React, { useContext, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import DataElementWrapper from 'components/DataElementWrapper';
import OutlineContext from 'components/Outline/Context';

import core from 'core';
import outlineUtils from 'helpers/OutlineUtils';
import selectors from 'selectors';

import './OutlineControls.scss';
import DataElements from 'src/constants/dataElement';

const OutlineControls = () => {
  const outlines = useSelector(state => selectors.getOutlines(state));
  const { selectedOutlinePath, setSelectedOutlinePath, updateOutlines } = useContext(
    OutlineContext,
  );
  const [canMove, setCanMove] = useState({ up: false, down: false, outward: false, inward: false });
  const nextIndexRef = useRef(null);
  const [t] = useTranslation();

  useEffect(() => {
    if (!core.isFullPDFEnabled()) {
      return;
    }

    const setCanMoveState = async () => {
      setCanMove(await outlineUtils.getCanMoveState(selectedOutlinePath));
    }

    setCanMoveState();
  }, [selectedOutlinePath]);

  useEffect(() => {
    if (nextIndexRef.current !== null) {
      setSelectedOutlinePath(nextIndexRef.current);
      nextIndexRef.current = null;
    }
  }, [outlines, setSelectedOutlinePath]);

  const moveOutlineUp = async () => {
    const nextIndex = await outlineUtils.moveOutlineUp(selectedOutlinePath);
    updateOutlines();
    nextIndexRef.current = nextIndex;
  }

  const moveOutlineDown = async () => {
    const nextIndex = await outlineUtils.moveOutlineDown(selectedOutlinePath);
    updateOutlines();
    nextIndexRef.current = nextIndex;
  }

  const moveOutlineOutward = async () => {
    const nextIndex = await outlineUtils.moveOutlineOutward(selectedOutlinePath);
    updateOutlines();
    nextIndexRef.current = nextIndex;
  }

  const moveOutlineInward = async () => {
    const nextIndex = await outlineUtils.moveOutlineInward(selectedOutlinePath);
    updateOutlines();
    nextIndexRef.current = nextIndex;
  }

  return (
    <DataElementWrapper
      className="OutlineControls"
      dataElement={DataElements.OUTLINE_CONTROLS}
    >
      <span className="reorderText">
        {t('option.bookmarkOutlineControls.reorder')}
      </span>
      <Button
        img="icon-arrow-up"
        disabled={!canMove.up}
        onClick={moveOutlineUp}
        dataElement="moveOutlineUpButton"
      />
      <Button
        img="icon-arrow-down"
        disabled={!canMove.down}
        onClick={moveOutlineDown}
        dataElement="moveOutlineDownButton"
      />
      <Button
        img="icon-arrow-left"
        disabled={!canMove.outward}
        onClick={moveOutlineOutward}
        dataElement="moveOutlineOutwardButton"
      />
      <Button
        img="icon-arrow-right"
        disabled={!canMove.inward}
        onClick={moveOutlineInward}
        dataElement="moveOutlineInwardButton"
      />
    </DataElementWrapper>
  );
}

export default OutlineControls;
