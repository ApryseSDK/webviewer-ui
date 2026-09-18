import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DataElements from 'src/constants/dataElement';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import Choice from 'components/Choice';
import './StampSearchOptionsFlyout.scss';
import { getCategoryLabel } from 'src/helpers/stamps';
import useOnClickOutside from 'hooks/useOnClickOutside';

const noop = () => {};

const StampSearchOptionsFlyout = ({
  isPanelOpen,
  isNestedFlyout,
  isOpen,
  onClose,
  triggerRef,
  categoryMap = {},
  onCategoryCheckboxChange = noop,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const flyoutSelector = DataElements.STAMP_SEARCH_OPTIONS_FLYOUT;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));
  const hasCurrentFlyout = Boolean(currentFlyout);
  const nestedFlyoutRef = useRef(null);
  const visibleCheckboxes = Object.keys(categoryMap).filter((category) => categoryMap[category]?.isCheckboxVisible);

  const onStampSearchOptionsKeyDown = (event, onFlyoutKeyDown) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
    }
    onFlyoutKeyDown(event);
  };

  const renderCategoryChoice = (category, onFlyoutKeyDown) => {
    const categoryLabel = getCategoryLabel(category);

    return (
      <Choice
        key={category}
        className="stamp-category-choice"
        dataElement={`stamp-category-${category}`}
        id={`stamp-category-${category}`}
        checked={categoryMap[category]?.isCheckboxEnabled || false}
        onChange={() => onCategoryCheckboxChange(category)}
        onKeyDown={(event) => {
          if (onFlyoutKeyDown) {
            onStampSearchOptionsKeyDown(event, onFlyoutKeyDown);
          } else if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.click();
          }
        }}
        label={categoryLabel}
        tabIndex={isPanelOpen || isNestedFlyout ? 0 : -1}
      />
    );
  };

  const moveNestedFocus = (currentTarget, direction) => {
    const checkboxes = [...nestedFlyoutRef.current.querySelectorAll('input:not([disabled])')];
    const currentIndex = checkboxes.indexOf(currentTarget);
    const nextIndex = (currentIndex + direction + checkboxes.length) % checkboxes.length;
    checkboxes[nextIndex].focus({ preventScroll: true });
  };

  // If not nested, register the flyout with the global flyout system
  useLayoutEffect(() => {
    if (isNestedFlyout) {
      return;
    }

    const titleItem = {
      type: 'customElement',
      render: () => (
        <div className="stamp-search-options-title" >
          {t('rubberStampPanel.categories')}
        </div>
      ),
    };
    const flyoutItems = visibleCheckboxes.map((category) => ({
      type: 'customElement',
      render: (onFlyoutKeyDown) => renderCategoryChoice(category, onFlyoutKeyDown),
    }));
    const flyoutConfig = {
      dataElement: flyoutSelector,
      className: 'StampSearchOptionsFlyout',
      items: [
        titleItem,
        ...flyoutItems,
      ],
    };

    if (!hasCurrentFlyout) {
      dispatch(actions.addFlyout(flyoutConfig));
    } else {
      dispatch(actions.updateFlyout(flyoutConfig.dataElement, flyoutConfig));
    }
  }, [categoryMap, hasCurrentFlyout, isNestedFlyout, isPanelOpen, onCategoryCheckboxChange, t]);

  // Move focus into newly opened nested flyout
  useEffect(() => {
    if (isNestedFlyout && isOpen) {
      nestedFlyoutRef.current?.querySelector('input:not([disabled])')?.focus({ preventScroll: true });
    }
  }, [isNestedFlyout, isOpen]);

  // Close nested flyout when interaction moves outside
  useOnClickOutside(nestedFlyoutRef, (event) => {
    if (isNestedFlyout && isOpen && !triggerRef?.current?.contains(event.target)) {
      onClose?.();
    }
  });

  // Remove the standard flyout only when this component unmounts or changes mode.
  useEffect(() => {
    if (isNestedFlyout) {
      return;
    }

    return () => {
      dispatch(actions.closeElement(flyoutSelector));
      dispatch(actions.removeFlyout(flyoutSelector));
    };
  }, [dispatch, flyoutSelector, isNestedFlyout]);

  if (!isNestedFlyout || !isOpen) {
    return null;
  }

  const nestedFlyout = (
    <fieldset
      ref={nestedFlyoutRef}
      id={flyoutSelector}
      className="StampSearchOptionsFlyout StampSearchOptionsFlyout--nested"
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === 'Escape') {
          onClose?.();
          triggerRef?.current?.querySelector('button')?.focus({ preventScroll: true });
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          moveNestedFocus(event.target, 1);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          moveNestedFocus(event.target, -1);
        }
      }}
    >
      <div className="stamp-search-options-title">{t('rubberStampPanel.categories')}</div>
      {visibleCheckboxes.map((category) => renderCategoryChoice(category))}
    </fieldset>
  );

  return nestedFlyout;
};

StampSearchOptionsFlyout.propTypes = {
  isPanelOpen: PropTypes.bool,
  isNestedFlyout: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  triggerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  categoryMap: PropTypes.object,
  onCategoryCheckboxChange: PropTypes.func,
};

export default StampSearchOptionsFlyout;
