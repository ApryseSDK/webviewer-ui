import React, { forwardRef, useEffect, useRef, useState } from 'react';
import core from 'core';
import classNames from 'classnames';
import { shallowEqual, useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../FlyoutItemContainer';
import useDidUpdate from 'src/hooks/useDidUpdate';
import { useTranslation } from 'react-i18next';
import { isMobileSize } from 'helpers/getDeviceSize';
import { isIOS } from 'helpers/device';


const PageControlsInput = forwardRef((props, ref) => {
  const {
    icon,
    isFlyoutItem,
    onKeyDownHandler,
  } = props;

  const inputRef = useRef();
  const mountedRef = useRef(true);
  const totalPages = useSelector(selectors.getTotalPages);
  const pageLabels = useSelector(selectors.getPageLabels, shallowEqual);
  const allowPageNavigation = useSelector(selectors.getAllowPageNavigation);
  const currentPageLabel = useSelector(selectors.getCurrentPageLabel);

  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState(currentPageLabel);
  const [inputWidth, setInputWidth] = useState(0);

  const { t } = useTranslation();
  const isMobile = isMobileSize();

  useDidUpdate(() => {
    setInput(currentPageLabel);
  }, [currentPageLabel]);

  useEffect(() => {
    // Mark the component as mounted
    mountedRef.current = true;

    // Cleanup function to run on unmount
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (input) {
      setInputWidth(input.length * (isMobile ? 10 : 11.5));
    }
  }, [input]);

  const onClick = () => {
    if (isIOS) {
      setTimeout(() => {
        inputRef.current.setSelectionRange(0, 9999);
      }, 0);
    } else {
      inputRef.current.select();
    }
  };

  const onBlur = () => {
    setInput(currentPageLabel);
    setIsFocused(false);
  };

  const onFocus = () => {
    if (mountedRef.current) {
      setIsFocused(true);
    }
  };

  const onChange = (e) => {
    if (!pageLabels?.some((p) => p.startsWith(e.target.value))) {
      return;
    }
    setInput(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const isValidInput = input === '' || pageLabels.includes(input);
    if (isValidInput) {
      const pageToGo = pageLabels.indexOf(input) + 1;
      core.setCurrentPage(pageToGo);
    } else {
      inputRef.current.blur();
    }
  };

  const style = {};
  if (isFocused) {
    style.width = inputWidth;
  } else {
    style.width = inputWidth - 10;
  }

  const formInput =
    <form
      className="page-controls-input-form"
      onSubmit={onSubmit}
    >
      <input
        aria-label={t('action.pageNumberInput')}
        ref={inputRef}
        className={classNames({
          unfocused: !isFocused,
        })}
        type="text"
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDownHandler}
        onClick={onClick}
        onBlur={onBlur}
        onMouseOver={onBlur}
        onFocus={onFocus}
        disabled={!allowPageNavigation}
        style={style}
      />
    </form>;

  const pageControlsFlyoutItem = (
    <div className="flyout-item-label">
      <div>{`${t('action.page')}: `}</div>
      {formInput}
      <div>{` ${t('action.of')} ${totalPages}`}</div>
    </div>
  );

  return (isFlyoutItem ?
    <FlyoutItemContainer {...props}
      ref={ref}
      additionalClass={'page-nav-display'}
      elementDOM={pageControlsFlyoutItem}
      icon={icon}
    /> :
    <>
      {formInput}
    </>
  );
});

PageControlsInput.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};
PageControlsInput.displayName = 'PageControlsInput';

export default PageControlsInput;