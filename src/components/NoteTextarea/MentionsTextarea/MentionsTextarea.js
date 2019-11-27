import React from 'react';
import PropTypes from 'prop-types';
import { MentionsInput, Mention } from 'react-mentions';

const propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  userData: PropTypes.arrayOf(PropTypes.object),
};

const MentionsTextarea = React.forwardRef(
  (
    {
      value = '',
      onChange,
      onKeyDown = () => {},
      onBlur = () => {},
      onFocus = () => {},
      placeholder = '',
      userData,
    },
    forwardedRef,
  ) => {
    const renderSuggestion = ({ name, email }, search, highlightedDisplay) => (
      <React.Fragment>
        {highlightedDisplay}
        <div className="email">{email}</div>
      </React.Fragment>
    );

    return (
      <div onMouseDown={e => e.stopPropagation()}>
        <MentionsInput
          className="mention"
          inputRef={forwardedRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          allowSpaceInQuery
        >
          <Mention
            trigger="@"
            // hack for now to bypass the data instanceof Array check in this library
            data={JSON.parse(JSON.stringify(userData))}
            displayTransform={(_, display) => `@${display}`}
            renderSuggestion={renderSuggestion}
            markup="@__display__"
          />
        </MentionsInput>
      </div>
    );
  },
);

MentionsTextarea.propTypes = propTypes;

export default MentionsTextarea;
