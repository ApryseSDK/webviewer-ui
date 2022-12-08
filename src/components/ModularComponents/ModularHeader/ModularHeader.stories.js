import React from 'react';
import ModularHeader from './ModularHeader';

export default {
  title: 'Components/Header/ModularHeader',
  component: ModularHeader,
};


const MockDocumentContainer = () => {
  return (
    <div style={{ width: '90%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      Mock Document Container
    </div>
  );
};

export const TopHeader = () => {
  const props = {
    dataElement: 'defaultHeader',
    placement: 'top',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ModularHeader {...props} />
      <MockDocumentContainer />
    </div>
  );
};

export const LeftHeader = () => {
  const props = {
    dataElement: 'leftHeader',
    placement: 'left',
  };
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <ModularHeader {...props} />
      <MockDocumentContainer />
    </div>
  );
};

export const RightHeader = () => {
  const props = {
    dataElement: 'rightHeader',
    placement: 'right',
  };
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <MockDocumentContainer />
      <ModularHeader {...props} />
    </div>
  );
};
