import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import Flyout from 'components/ModularComponents/Flyout';

const propTypes = {};
const FlyoutContainer = () => {
  const [flyoutMap, activeFlyout] = useSelector((state) => [
    selectors.getFlyoutMap(state),
    selectors.getActiveFlyout(state),
  ]);

  return (
    <div className="FlyoutContainer">
      {activeFlyout && flyoutMap[activeFlyout] && <Flyout/>}
    </div>
  );
};

FlyoutContainer.propTypes = propTypes;

export default FlyoutContainer;
