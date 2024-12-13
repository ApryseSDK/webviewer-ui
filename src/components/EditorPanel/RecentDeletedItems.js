import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import InnerItem from '../ModularComponents/InnerItem';
import Button from '../Button';

const RecentDeletedItems = () => {
  const dispatch = useDispatch();
  const recentDeletedItems = useSelector(selectors.getRecentDeletedItems);

  const renderRecentDeletedItems = () => {
    if (recentDeletedItems.length === 0) {
      return (
        <div className="recent-deleted-item-name">
          {'No items have been deleted'}
        </div>
      );
    }
    return recentDeletedItems.map((item, index) => {
      return (
        <InnerItem {...item} isInEditorPanel={true} key={index} />
      );
    });
  };

  const emptyDeletedItems = () => {
    dispatch(actions.setRecentDeletedItems([]));
  };

  return (
    <div>
      <div>
        {recentDeletedItems.length > 0 && (
          <Button
            label="Empty deleted items"
            onClick={emptyDeletedItems}
            className="empty-deleted-items"
            img='icon-delete-line'
          />)}
      </div>
      <div className='recent-deleted-wrapper'>
        {renderRecentDeletedItems()}
      </div>
    </div>
  );
};

export default RecentDeletedItems;