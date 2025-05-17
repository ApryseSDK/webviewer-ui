import CellBorders from './CellBorders';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import { ITEM_TYPE } from 'constants/customizationVariables';
import { PropTypes } from 'prop-types';
import DataElements from 'constants/dataElement';

const CellBordersContainer = (props) => {
  const { isFlyoutItem, dataElement = 'cell-borders-container' } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    const flyout = {
      dataElement: DataElements.CELL_BORDER_BUTTONS_FLYOUT,
      className: DataElements.CELL_BORDER_BUTTONS_FLYOUT,
      items: [
        {
          dataElement: ITEM_TYPE.CELL_BORDERS,
          type: ITEM_TYPE.CELL_BORDERS,
        }
      ]
    };

    dispatch(actions.updateFlyout(flyout.dataElement, flyout));
  }, [isFlyoutItem]);

  return (
    <CellBorders dataElement={dataElement} isFlyoutItem={isFlyoutItem} />
  );
};

CellBordersContainer.propTypes = {
  dataElement: PropTypes.string,
  isFlyoutItem: PropTypes.bool
};

export default CellBordersContainer;