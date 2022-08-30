import React from 'react';
import Button from 'components/Button';

function CustomLeftPanelOperations({ pageNumbers, operations }) {
  return (
    <>
      {operations.map((operation, index) => {
        return (
          <Button
            key={index}
            className={'button-hover'}
            dataElement={operation.dataElement}
            img={operation.img}
            onClick={() => operation.onClick(pageNumbers)}
            title={operation.title}
          />);
      })
      }
    </>
  );
}

export default CustomLeftPanelOperations;
