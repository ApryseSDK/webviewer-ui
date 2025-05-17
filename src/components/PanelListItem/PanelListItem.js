import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import Button from '../Button';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import Icon from 'components/Icon';
import './PanelListItem.scss';
import useNestingLevel from 'src/hooks/useNestingLevel';
import createItemsForBookmarkOutlineFlyout from 'helpers/createItemsForBookmarkOutlineFlyout';
import { menuItems, menuTypes } from 'helpers/outlineFlyoutHelper';
import { useDispatch } from 'react-redux';
import actions from 'actions';

const PanelListChildren = ({ children }) => {
  if (!children || children.length === 0) {
    return null;
  }
  return (
    <ul className="panel-list-children">
      {children.map((child) => (
        <li key={child?.key}>{child}</li>
      ))}
    </ul>
  );
};

PanelListChildren.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

const PanelItemContent = React.memo(({
  iconGlyph,
  labelHeader,
  onDoubleClick,
  onClick,
  useI18String,
  textColor,
  isActive,
}) => (
  <>
    {iconGlyph && (
      <div className="panel-list-icon-container">
        <Icon glyph={iconGlyph} />
      </div>
    )}
    <div className={'panel-list-text-container'}>
      <div className="panel-list-label-header">
        <Button
          style={{ color: textColor || 'inherit' }}
          ariaLabel={labelHeader}
          label={labelHeader}
          onDoubleClick={onDoubleClick}
          onClick={onClick}
          className={classNames({
            'set-focus': isActive,
          })}
          useI18String={useI18String}
        />
      </div>
    </div>
  </>
));

PanelItemContent.displayName = 'PanelItemContent';

PanelItemContent.propTypes = {
  iconGlyph: PropTypes.string,
  labelHeader: PropTypes.string.isRequired,
  onDoubleClick: PropTypes.func,
  onClick: PropTypes.func,
  useI18String: PropTypes.bool,
  textColor: PropTypes.string,
  isActive: PropTypes.bool,
};

const PanelListItem = ({
  checkboxOptions,
  children,
  contentMenuFlyoutOptions = {},
  contextMenuMoreButtonOptions = {},
  description,
  enableMoreOptionsContextMenuFlyout,
  iconGlyph,
  labelHeader,
  useI18String = true,
  onDoubleClick = () => {},
  onClick = () => {},
  expanded,
  setIsExpandedHandler,
  textColor,
  isActive,
}) => {
  const panelListItemRef = useRef();
  const currentNestingLevel = useNestingLevel(panelListItemRef);
  const [isExpanded, setIsExpanded] = useState(expanded ?? false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    shouldHideDeleteButton = false,
    currentFlyout,
    flyoutSelector,
    type,
    handleOnClick,
  } = contentMenuFlyoutOptions;

  const {
    flyoutToggleElement,
    moreOptionsDataElement,
  } = contextMenuMoreButtonOptions;

  const updateFlyout = (e) => {
    e.stopPropagation();
    const bookmarkOutlineFlyout = {
      dataElement: flyoutSelector,
      className: 'MoreOptionsContextMenuFlyout',
      items: createItemsForBookmarkOutlineFlyout(menuItems, type, shouldHideDeleteButton, handleOnClick, menuTypes),
    };
    if (!currentFlyout) {
      dispatch(actions.addFlyout(bookmarkOutlineFlyout));
    } else {
      dispatch(actions.updateFlyout(flyoutSelector, bookmarkOutlineFlyout));
    }
    dispatch(actions.setFlyoutToggleElement(moreOptionsDataElement));
    dispatch(actions.toggleElement(flyoutSelector));
  };

  const showCheckBox = checkboxOptions && !checkboxOptions.disabled || false;

  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  const handleOnExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    if (setIsExpandedHandler) {
      setIsExpandedHandler(!isExpanded);
    }
  };

  /* component layout when all options are enabled:
  checkbox|chevron| icon |    label header   |menu
    empty | empty | empty| label description |empty
  */

  return (
    <div data-element="panelListItem" className="panel-list-item" ref={panelListItemRef}>
      <div className={classNames({
        'panel-list-grid': true,
        'grid-with-2-rows': description,
        'grid-with-1-row': !description,
        'grid-with-3-columns': !iconGlyph && !checkboxOptions,
        'grid-with-4-columns': iconGlyph || checkboxOptions,
        'grid-with-5-columns': iconGlyph && checkboxOptions,
      })} >
        <div className={classNames(`panel-list-row${checkboxOptions ? ' with-checkbox' : ''}`, 'focusable-container')}>
          {showCheckBox && (
            <div
              style={{ '--checkbox-left': `${-32 * currentNestingLevel + 4}px` }}
              className="checkbox"
            >
              <Choice
                role="checkbox"
                id={checkboxOptions?.id}
                aria-label={checkboxOptions?.ariaLabel}
                aria-checked={checkboxOptions?.checked}
                checked={checkboxOptions?.checked}
                onChange={checkboxOptions?.onChange}
              />
            </div>
          )}

          <div
            onClick={handleOnExpand}
            className={classNames({
              'chevron-container': true,
              toggled: isExpanded,
              visible: children && children.length > 0,
            })}
          >
            <Button
              img="icon-chevron-right"
              className="panel-list-button"
              ariaExpanded={isExpanded}
              ariaLabel={`${isExpanded ? t('action.collapse') : t('action.expand')} ${labelHeader}`}
            />
          </div>

          <PanelItemContent
            iconGlyph={iconGlyph}
            labelHeader={labelHeader}
            onDoubleClick={onDoubleClick}
            onClick={onClick}
            useI18String={useI18String}
            textColor={textColor}
            isActive={isActive}
          />
          {enableMoreOptionsContextMenuFlyout && (
            <div className="panel-list-more-options">
              <ToggleElementButton
                className="toggle-more-button"
                title={`${t('option.searchPanel.moreOptions')} ${labelHeader}`}
                toggleElement={flyoutToggleElement}
                dataElement={moreOptionsDataElement}
                img="icon-tool-more"
                disabled={false}
                onClick={updateFlyout}
              />
            </div>
          )}
        </div>
        {description && (
          <div className="panel-list-description">{description}</div>
        )}
      </div>
      {isExpanded && <PanelListChildren>{children}</PanelListChildren>}
    </div>
  );
};

PanelListItem.propTypes = {
  checkboxOptions: PropTypes.shape({
    id: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    ariaLabel: PropTypes.string,
    disabled: PropTypes.bool
  }),
  useI18String: PropTypes.bool,
  iconGlyph: PropTypes.string,
  labelHeader: PropTypes.string.isRequired,
  description: PropTypes.string,
  enableMoreOptionsContextMenuFlyout: PropTypes.bool,
  children: PropTypes.node,
  onDoubleClick: PropTypes.func,
  onClick: PropTypes.func,
  expanded: PropTypes.bool,
  textColor: PropTypes.string,
  setIsExpandedHandler: PropTypes.func,
  contentMenuFlyoutOptions: PropTypes.shape({
    shouldHideDeleteButton: PropTypes.bool,
    currentFlyout: PropTypes.object,
    flyoutSelector: PropTypes.string,
    type: PropTypes.string,
    handleOnClick: PropTypes.func,
  }),
  contextMenuMoreButtonOptions: PropTypes.shape({
    flyoutToggleElement: PropTypes.string,
    moreOptionsDataElement: PropTypes.string,
  }),
  isActive: PropTypes.bool,
};

export default PanelListItem;