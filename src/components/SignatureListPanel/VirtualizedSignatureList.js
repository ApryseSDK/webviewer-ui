import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const VirtualizedSignatureList = ({ visibleSignatures, renderSignatureRow, testModeProps }) => (
  <Virtuoso
    className={classNames('saved-signatures-virtuoso', {
      'saved-signatures-virtuoso-test-height': process.env.NODE_ENV === 'test',
      'saved-signatures-virtuoso-fill-height': process.env.NODE_ENV !== 'test',
    })}
    data={visibleSignatures}
    itemContent={renderSignatureRow}
    {...testModeProps}
  />
);

VirtualizedSignatureList.propTypes = {
  visibleSignatures: PropTypes.arrayOf(PropTypes.array).isRequired,
  renderSignatureRow: PropTypes.func.isRequired,
  testModeProps: PropTypes.object,
};

export default VirtualizedSignatureList;
