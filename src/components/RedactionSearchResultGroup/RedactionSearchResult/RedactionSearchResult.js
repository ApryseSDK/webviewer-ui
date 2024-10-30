import React from 'react';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import Icon from 'components/Icon';
import './RedactionSearchResult.scss';
import classNames from 'classnames';
import { redactionTypeMap } from 'constants/redactionTypes';
import PropTypes from 'prop-types';

// Alternatively wrap this in useCallback and declare inside component
const displayRedactionSearchResult = (props) => {
  const { ambientStr, resultStrStart, resultStrEnd, resultStr, type } = props;
  if (type === redactionTypeMap['TEXT']) {
    const searchValue = ambientStr === '' ? resultStr : ambientStr.slice(resultStrStart, resultStrEnd);
    const textBeforeSearchValue = ambientStr.slice(0, resultStrStart);
    const textAfterSearchValue = ambientStr.slice(resultStrEnd);
    return (
      <>
        {textBeforeSearchValue}
        <span className="search-value">{searchValue}</span>
        {textAfterSearchValue}
      </>
    );
  }
  return resultStr;
};

const RedactionSearchResult = (props) => {
  const {
    isChecked,
    onChange,
    onClickResult,
    isActive,
    icon,
    ambientStr
  } = props;

  const displayResult = displayRedactionSearchResult(props);
  const searchResultClassname = classNames('redaction-search-result', { active: isActive });

  return (
    <li className={searchResultClassname}>
      <button
        className='redaction-search-result-button'
        onClick={onClickResult}
        aria-label={ambientStr}
        aria-current={isActive}
      ></button>
      <div style={{ paddingRight: '14px' }}>
        <Choice
          aria-label={`${ambientStr}`}
          checked={isChecked}
          onChange={onChange}
        />
      </div>
      <div style={{ paddingRight: '14px' }}>
        <Icon glyph={icon} />
      </div>
      <div className="redaction-search-result-info">
        {displayResult}
      </div>
    </li>
  );
};

RedactionSearchResult.propTypes = {
  isChecked: PropTypes.bool,
  onChange: PropTypes.func,
  onClickResult: PropTypes.func,
  isActive: PropTypes.bool,
  icon: PropTypes.string,
  ambientStr: PropTypes.string,
};

export default React.memo(RedactionSearchResult);