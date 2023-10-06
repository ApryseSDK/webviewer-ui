import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import './GroupedToolsOverflowFlyout.scss';
import PropTypes from 'prop-types';

const GroupedToolsOverflowFlyout = (props) => {
  const dispatch = useDispatch();
  const { items, dataElement } = props;

  useEffect(() => {
    const GroupedToolsOverflowFlyout = {
      dataElement: dataElement,
      className: 'GroupedToolsOverflowFlyout',
      items: items || [],
    };
    dispatch(actions.addFlyout(GroupedToolsOverflowFlyout));
  }, []);

  return null;
};

GroupedToolsOverflowFlyout.propTypes = {
  dataElement: PropTypes.string,
  items: PropTypes.array,
};

export default GroupedToolsOverflowFlyout;
