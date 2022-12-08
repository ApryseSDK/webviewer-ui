import { useSelector } from 'react-redux';
import selectors from 'selectors';
import './RightHeader.scss';

function RightHeaderContainer() {
  const [
    featureFlags,
    headerList,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.getModularHeaderList(state),
    ]);
  const { modularHeader } = featureFlags;

  const rightHeader = headerList.find((header) => header.props.placement === 'right');

  if (modularHeader && rightHeader) {
    return rightHeader;
  }
  return null;
}

export default RightHeaderContainer;