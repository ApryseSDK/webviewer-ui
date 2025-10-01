import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import useID from 'hooks/useID';

const Label = ({ label, optionalText, children, className, htmlFor, ...props }) => {
  const childrenId = children?.props?.id;
  const id = useID(childrenId);

  const labelClass = classNames(
    'ui__base ui__label',
    {
      'ui__label--disabled': children?.props?.disabled,
      'ui__label--attached': !!children,
    },
    className,
  );

  return (
    <>
      <label
        {...props}
        className={labelClass}
        htmlFor={htmlFor ?? id}
      >
        {label}
        {optionalText && <span className="ui__label__optional">{optionalText}</span>}
      </label>
      {children ? cloneElement(children, { id }) : null}
    </>
  );
};

Label.propTypes = {
  label: PropTypes.node.isRequired,
  optionalText: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
  htmlFor: PropTypes.string,
};

export default Label;
