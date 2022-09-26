import React, { useCallback } from 'react';
import './ChangeListItem.scss';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import core from 'core';
import selectors from 'selectors/index';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';

const propTypes = {
  oldText: PropTypes.string,
  newText: PropTypes.string,
  oldCount: PropTypes.number,
  newCount: PropTypes.number,
  type: PropTypes.string,
  old: PropTypes.object,
  new: PropTypes.object,
};

const ChangeListItem = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [syncViewer] = useSelector((state) => [
    selectors.getSyncViewer(state),
  ]);

  const onClickItem = useCallback(() => {
    if (syncViewer) {
      dispatch(actions.setSyncViewer(null));
    }
    for (const annotation of [props.old, props.new]) {
      const viewerNumber = annotation === props.old ? 1 : 2;
      if (!annotation) {
        continue;
      }
      core.jumpToAnnotation(annotation, viewerNumber);
      core.getDocumentViewer(viewerNumber).getAnnotationManager().deselectAllAnnotations();
      core.getDocumentViewer(viewerNumber).getAnnotationManager().selectAnnotation(annotation);
    }
  }, [syncViewer]);

  return (
    <div className="ChangeListItem" onClick={onClickItem}>
      <div className="icon-change">
        <Icon glyph="icon-compare-change" />
      </div>
      <div className="container-right">
        <div className="title">{t('multiViewer.comparePanel.change')}</div>
        <div className="type">{props.type}</div>
        {props.old && <div className="value-container old">
          <div className="value-title">
            <div>{t('multiViewer.comparePanel.old')}</div>
            <div>-{props.oldCount}</div>
          </div>
          <div className="text">{props.oldText}</div>
        </div>}
        {props.new && <div className="value-container new">
          <div className="value-title">
            <div>{t('multiViewer.comparePanel.new')}</div>
            <div>+{props.newCount}</div>
          </div>
          <div className="text">{props.newText}</div>
        </div>}
      </div>
    </div>
  );
};

ChangeListItem.propTypes = propTypes;

export default ChangeListItem;