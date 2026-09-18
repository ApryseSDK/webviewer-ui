import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const VirtualizedStampList = ({
  rowData,
  renderStampRow,
  testModeProps,
  ariaControls,
  scrollParent,
}) => {
  const isReady = process.env.NODE_ENV === 'test' || scrollParent !== null;

  return (
    <div className='rubber-stamps-list' id={ariaControls}>
      {isReady && (
        <Virtuoso
          className={classNames('rubber-stamps-virtuoso', 'stamp-panel-virtuoso', {
            'rubber-stamps-virtuoso-test-height': process.env.NODE_ENV === 'test',
          })}
          data={rowData}
          itemContent={renderStampRow}
          customScrollParent={scrollParent}
          {...testModeProps}
        />
      )}
    </div>
  );
};

VirtualizedStampList.propTypes = {
  rowData: PropTypes.arrayOf(PropTypes.array).isRequired,
  renderStampRow: PropTypes.func.isRequired,
  testModeProps: PropTypes.object,
  ariaControls: PropTypes.string,
  scrollParent: PropTypes.object,
};

export default VirtualizedStampList;
