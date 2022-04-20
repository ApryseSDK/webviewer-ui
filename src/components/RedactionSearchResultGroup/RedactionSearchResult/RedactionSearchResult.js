import React from 'react';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import Icon from 'components/Icon'
import './RedactionSearchResult.scss'
import classNames from 'classnames';
import { redactionTypeMap } from 'constants/redactionTypes';

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
  } else {
    return resultStr;
  };
};

const RedactionSearchResult = (props) => {
  const {
    isChecked,
    onChange,
    onClickResult,
    isActive,
    icon,
  } = props;

  const displayResult = displayRedactionSearchResult(props);
  const searchResultClassname = classNames('redaction-search-result', { active: isActive });

  return (
    <div className={searchResultClassname} role="listitem" onClick={onClickResult}>
      <div style={{ paddingRight: '14px' }}>
        <Choice
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
    </div >
  )
};

export default React.memo(RedactionSearchResult);