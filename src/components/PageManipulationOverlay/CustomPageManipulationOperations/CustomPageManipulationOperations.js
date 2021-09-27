import React from 'react';
import DataElementWrapper from 'components/DataElementWrapper';
import Button from 'components/Button';

function CustomPageManipulationOperations(props) {
  const { dataElement, pageNumbers, header, operations } = props;

  function renderIcon(operation) {
    if (operation.img) {
      return (
        <Button
          title={operation.title}
          img={operation.img}
          role="option"
        />
      );
    }
  }

  return (
    <>
      <DataElementWrapper
        dataElement={dataElement}
        className="type"
      >
        {header}
      </DataElementWrapper>
      {operations.map(operation => {
        return (
          <DataElementWrapper
            key={operation.dataElement}
            className="row"
            dataElement={operation.dataElement}
            onClick={() => operation.onClick(pageNumbers)}
          >
            {renderIcon(operation)}
            <div className="title">{operation.title}</div>
          </DataElementWrapper>
        );
      })}
    </>
  );
}

export default CustomPageManipulationOperations;