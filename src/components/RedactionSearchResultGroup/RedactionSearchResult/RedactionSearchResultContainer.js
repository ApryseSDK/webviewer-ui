import React, { useCallback, useContext } from 'react';
import RedactionSearchResult from './RedactionSearchResult';
import { RedactionPanelContext } from 'components/RedactionPanel/RedactionPanelContext';
import useCore from 'hooks/useCore';

const RedactionSearchResultContainer = (props) => {
  const { core } = useCore();
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
  }, [searchResult, core]);

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
