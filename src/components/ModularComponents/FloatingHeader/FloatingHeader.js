import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './FloatingHeader.scss';
import classNames from 'classnames';
import ModularHeaderItems from 'components/ModularHeaderItems';
import DataElementWrapper from 'components/DataElementWrapper';
import { DEFAULT_GAP, OPACITY_LEVELS, OPACITY_MODES, PLACEMENT } from 'constants/customizationVariables';
import useCore from 'hooks/useCore';
import debounce from 'lodash/debounce';

const HIDE_FLOATING_HEADER_TIMEOUT = 4000;
const FloatingHeader = (props) => {
  const { dataElement,
    placement,
    items = [],
    gap = DEFAULT_GAP,
    opacityMode = OPACITY_MODES.STATIC,
    opacity = OPACITY_LEVELS.FULL,
    maxWidth,
    maxHeight,
    wrapperStyle,
  } = props;
  const resolvedWrapperStyle = wrapperStyle ?? props.style;
  const { core } = useCore();

  const [isVisible, setIsVisible] = useState(false);
  const scrollViewContainer = core.getScrollViewElement();

  useEffect(() => {
    const hideFloatingHeader = debounce(() => {
      setIsVisible(false);
    }, HIDE_FLOATING_HEADER_TIMEOUT);

    const handleScroll = () => {
      if (opacityMode === OPACITY_MODES.DYANMIC) {
        setIsVisible(true);
        hideFloatingHeader();
      }
    };

    if (opacityMode === OPACITY_MODES.DYANMIC) {
      scrollViewContainer.addEventListener('scroll', handleScroll);
    }

    return () => scrollViewContainer.removeEventListener('scroll', handleScroll);
  }, [opacityMode]);

  const className = classNames(
    'FloatingHeader',
    `opacity-${opacity}`,
    `opacity-mode-${opacityMode}`,
    'stroke',
    {
      isVisible,
      'VerticalHeader': placement === PLACEMENT.LEFT || placement === PLACEMENT.RIGHT,
    },
  );

  return (
    <DataElementWrapper
      dataElement={dataElement}
      wrapperStyle={resolvedWrapperStyle}
      className={className}>
      <ModularHeaderItems
        items={items}
        gap={gap}
        headerId={dataElement}
        placement={placement}
        maxWidth={maxWidth}
        maxHeight={maxHeight} />
    </DataElementWrapper >
  );
};

FloatingHeader.propTypes = {
  dataElement: PropTypes.string,
  placement: PropTypes.string,
  items: PropTypes.array,
  gap: PropTypes.number,
  opacityMode: PropTypes.string,
  opacity: PropTypes.string,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  wrapperStyle: PropTypes.object,
  /** @deprecated Use wrapperStyle instead. */
  style: PropTypes.object,
};

export default FloatingHeader;
