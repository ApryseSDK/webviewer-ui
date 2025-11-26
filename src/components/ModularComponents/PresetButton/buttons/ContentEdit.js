import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import classNames from 'classnames';
import { getButtonPressedAnnouncement } from 'helpers/accessibility';
import { useTranslation } from 'react-i18next';

/**
 * A button that toggles Content Edit Mode.
 * @name contentEditButton
 * @memberof UI.Components.PresetButton
 */
const ContentEditButton = forwardRef((props, ref) => {
  const {
    isFlyoutItem,
    style,
    className,
    dataElement = menuItems.contentEditButton.dataElement,
    img: icon = menuItems.contentEditButton.icon,
    title = menuItems.contentEditButton.title,
  } = props;
  const areContentEditWorkersLoaded = useSelector((state) => selectors.areContentEditWorkersLoaded(state));
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const dispatch = useDispatch();
  const [active, setActive] = useState(core.getContentEditManager().isInContentEditMode());
  const [t] = useTranslation();

  useEffect(() => {
    const contentEditManager = core.getContentEditManager();
    if (contentEditManager) {
      const documentViewer = core.getDocumentViewer();

      const showWarningModalHandler = () => {
        const message = t('option.contentEdit.deletionModal.message');
        const title = t('option.contentEdit.deletionModal.title');
        const confirmBtnText = t('action.ok');

        const warning = {
          message,
          title,
          confirmBtnText,
          onConfirm: () => {
            core.deleteAnnotations(
              core.getSelectedAnnotations(activeDocumentViewerKey),
              undefined,
              activeDocumentViewerKey,
            );
          },
        };

        dispatch(actions.showWarningMessage(warning));
      };

      documentViewer.addEventListener('showWarningModal', showWarningModalHandler);

      const updateState = () => setActive(contentEditManager.isInContentEditMode());
      contentEditManager.addEventListener('contentEditModeStarted', updateState);
      contentEditManager.addEventListener('contentEditModeEnded', updateState);

      return () => {
        contentEditManager.removeEventListener('contentEditModeStarted', updateState);
        contentEditManager.removeEventListener('contentEditModeEnded', updateState);
        documentViewer.removeEventListener('showWarningModal', showWarningModalHandler);
      };
    }
  }, [activeDocumentViewerKey, dispatch, t]);

  const handleClick = () => {
    const contentEditManager = core.getContentEditManager();
    const beginContentEditMode = () => {
      // loading modal for the delay when switching to content edit mode
      // but only if the workers are not loaded
      if (!areContentEditWorkersLoaded) {
        dispatch(actions.openElement(DataElements.LOADING_MODAL));
      }
      contentEditManager.startContentEditMode();
      setActive(true);
      dispatch(actions.openElement(DataElements.TEXT_EDITING_PANEL));
    };
    contentEditManager.isInContentEditMode() ? contentEditManager.endContentEditMode() : beginContentEditMode();
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} />
      : (
        <ActionButton
          className={classNames({
            PresetButton: true,
            contentEditButton: true,
            [className]: true,
          })}
          dataElement={dataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          isActive={active}
          style={style}
          ariaPressed={active}
          onClickAnnouncement={getButtonPressedAnnouncement(title)}
        />
      )
  );
});

ContentEditButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};
ContentEditButton.displayName = 'ContentEditButton';

export default ContentEditButton;