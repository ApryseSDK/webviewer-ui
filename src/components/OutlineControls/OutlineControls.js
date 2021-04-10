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

function OutlineControls() {
  const outlines = useSelector(state => selectors.getOutlines(state));
  const { selectedOutlinePath, setSelectedOutlinePath, reRenderPanel } = useContext(
    OutlineContext,
  );
  const [canMove, setCanMove] = useState({ up: false, down: false, outward: false, inward: false });
  const nextIndexRef = useRef(null);
  const [t] = useTranslation();

  useEffect(() => {
    if (!core.isFullPDFEnabled()) {
      return;
    }

    async function setCanMoveState() {
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

  async function moveOutlineUp() {
    const nextIndex = await outlineUtils.moveOutlineUp(selectedOutlinePath);
    reRenderPanel();
    nextIndexRef.current = nextIndex;
  }

  async function moveOutlineDown() {
    const nextIndex = await outlineUtils.moveOutlineDown(selectedOutlinePath);
    reRenderPanel();
    nextIndexRef.current = nextIndex;
  }

  async function moveOutlineOutward() {
    const nextIndex = await outlineUtils.moveOutlineOutward(selectedOutlinePath);
    reRenderPanel();
    nextIndexRef.current = nextIndex;
  }

  async function moveOutlineInward() {
    const nextIndex = await outlineUtils.moveOutlineInward(selectedOutlinePath);
    reRenderPanel();
    nextIndexRef.current = nextIndex;
  }

  return (
    <DataElementWrapper className="OutlineControls" dataElement="outlineControls">
      <span className="reorderText">{t('option.outlineControls.reorder')}</span>
      <Button img="icon-arrow-up" disabled={!canMove.up} onClick={moveOutlineUp} dataElement="moveOutlineUpButton" />
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
