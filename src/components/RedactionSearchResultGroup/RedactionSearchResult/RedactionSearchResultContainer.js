import React, { useCallback, useContext } from 'react';
import RedactionSearchResult from './RedactionSearchResult';
import { RedactionPanelContext } from 'components/RedactionPanel/RedactionPanelContext';
import core from 'core';

const RedactionSearchResultContainer = (props) => {
  const {
    searchResult,
    checked,
    checkResult,
  } = props;

  const { activeSearchResultIndex } = useContext(RedactionPanelContext);

  const { ambientStr, resultStrStart, resultStrEnd, resultStr, icon, index, type } = searchResult;

  const onChange = useCallback((event) => {
    checkResult(event, index);
  }, [index, checkResult]);

  const onClickResult = useCallback(() => {
    core.setActiveSearchResult(searchResult);
  }, [searchResult]);

  return (
    <RedactionSearchResult
      ambientStr={ambientStr}
      resultStrStart={resultStrStart}
      resultStrEnd={resultStrEnd}
      resultStr={resultStr}
      icon={icon}
      type={type}
      isChecked={checked}
      onChange={onChange}
      onClickResult={onClickResult}
      isActive={activeSearchResultIndex === index}
    />
  );
};

export default RedactionSearchResultContainer;
