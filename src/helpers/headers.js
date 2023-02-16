import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { PLACEMENT } from 'constants/customizationVariables';

const getTopHeaders = () => {
  return getModularHeaders()?.filter((header) => header.options.placement === PLACEMENT.TOP);
};

const getBottomHeaders = () => {
  return getModularHeaders()?.filter((header) => header.options.placement === PLACEMENT.BOTTOM);
};

const getHorizontalHeaders = () => {
  return getModularHeaders()?.filter((header) => [PLACEMENT.TOP, PLACEMENT.BOTTOM].includes(header.options.placement));
};

const getVerticalHeaders = () => {
  return getModularHeaders()?.filter((header) => [PLACEMENT.LEFT, PLACEMENT.RIGHT].includes(header.options.placement));
};

const getModularHeaders = () => {
  return useSelector((state) => selectors.getModularHeaderList(state));
};

const formatHeightStyle = (height) => {
  return `calc(100% - ${height}px)`;
};

const getElementHeightBasedOnHorizontalHeaders = () => {
  const horizontalHeadersHeight = getTopHeadersHeight() + getBottomHeadersHeight();
  return formatHeightStyle(horizontalHeadersHeight);
};

const getBottomHeadersHeight = () => {
  const bottomHeadersQuantity = getBottomHeaders().length;
  const bottomHeadersHeight = useSelector((state) => selectors.getBottomHeadersHeight(state));
  return bottomHeadersHeight * bottomHeadersQuantity;
};

const getTopHeadersHeight = () => {
  const topHeadersQuantity = getTopHeaders().length;
  const topHeadersHeight = useSelector((state) => selectors.getTopHeadersHeight(state));
  return topHeadersHeight * topHeadersQuantity;
};

const getElementHeightBasedOnBottomHeaders = () => {
  return formatHeightStyle(getBottomHeadersHeight());
};

export {
  getTopHeaders,
  getBottomHeaders,
  getHorizontalHeaders,
  getVerticalHeaders,
  getModularHeaders,
  getBottomHeadersHeight,
  formatHeightStyle,
  getElementHeightBasedOnHorizontalHeaders,
  getElementHeightBasedOnBottomHeaders
};