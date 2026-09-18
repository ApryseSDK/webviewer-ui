import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const VirtualizedCustomStampList = ({ scrollParent, visibleCustomStamps, renderCustomStamp, testModeProps }) => (
  <Virtuoso
    className={classNames('rubber-stamps-virtuoso', {
      'rubber-stamps-virtuoso-test-height': process.env.NODE_ENV === 'test',
    })}
    data={visibleCustomStamps}
    itemContent={renderCustomStamp}
    customScrollParent={scrollParent}
    {...testModeProps}
  />
);

VirtualizedCustomStampList.propTypes = {
  scrollParent: PropTypes.object,
  visibleCustomStamps: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderCustomStamp: PropTypes.func.isRequired,
  testModeProps: PropTypes.object,
};

export default VirtualizedCustomStampList;
