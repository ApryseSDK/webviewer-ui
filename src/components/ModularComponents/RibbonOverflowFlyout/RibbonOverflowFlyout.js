import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import './RibbonOverflowFlyout.scss';

const RibbonOverflowFlyout = (props) => {
  const dispatch = useDispatch();
  const { items } = props;

  useEffect(() => {
    const RibbonOverflowFlyout = {
      dataElement: 'RibbonOverflowFlyout',
      className: 'RibbonOverflowFlyout',
      items: items || [],
    };
    dispatch(actions.addFlyout(RibbonOverflowFlyout));
  }, []);

  return null;
};

export default RibbonOverflowFlyout;
