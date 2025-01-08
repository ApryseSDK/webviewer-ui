import React, { useState, useEffect } from 'react';
import './CollapsibleSection.scss';
import Icon from 'components/Icon';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const CollapsibleSection = (props) => {
  const {
    header,
    children,
    className,
    role,
    style,
    // use h2 as default heading level since we assume that this will be used with a parent component that should be using h1
    headingLevel = 2,
    isInitiallyExpanded = true,
    isExpanded: controlledIsExpanded,
    onToggle,
    ariaControls,
    expansionDescription,
  } = props;

  CollapsibleSection.propTypes = {
    header: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    role: PropTypes.string,
    style: PropTypes.object,
    headingLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isInitiallyExpanded: PropTypes.bool,
    isExpanded: PropTypes.bool,
    onToggle: PropTypes.func,
    ariaControls: PropTypes.string,
    expansionDescription: PropTypes.string,
  };

  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  useEffect(() => {
    if (controlledIsExpanded !== undefined) {
      setIsExpanded(controlledIsExpanded);
    }
  }, [controlledIsExpanded]);

  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggle) {
      onToggle(newExpandedState);
    }
  };

  const HeadingTag = `h${headingLevel}`;

  const headerContent = typeof header === 'function' ? header() : header;

  return (
    <div className={classNames({ CollapsibleSection: true, [className]: !!className })} role={role} style={style}>
      <HeadingTag className="collapsible-page-group-header">
        <button onClick={handleToggle} aria-expanded={isExpanded} aria-controls={ariaControls} aria-label={expansionDescription}>
          {headerContent}
          <Icon
            className="arrow"
            glyph={`icon-chevron-${isExpanded ? 'up' : 'down'}`}
          />
        </button>
      </HeadingTag>
      {isExpanded && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;