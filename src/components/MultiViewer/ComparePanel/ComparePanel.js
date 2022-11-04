import React, { useEffect, useRef, useState } from 'react';
import './ComparePanel.scss';
import DataElementWrapper from 'components/DataElementWrapper';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import Events from 'constants/events';
import ChangeListItem from 'components/MultiViewer/ComparePanel/ChangeListItem';
import core from 'core';
import { throttle } from 'lodash';


const ComparePanel = () => {
  const { t } = useTranslation();
  const isMobile = useMedia(['(max-width: 640px)'], [true], false);
  const [isOpen, currentWidth, isInDesktopOnlyMode] = useSelector((state) => [
    selectors.isElementOpen(state, 'comparePanel'),
    selectors.getComparePanelWidth(state),
    selectors.isInDesktopOnlyMode(state),
  ]);
  const [searchValue, setSearchValue] = React.useState('');
  const style = !isInDesktopOnlyMode && isMobile ? {} : { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  const changeListData = useRef([]);
  const [totalChanges, setTotalChanges] = useState(0);
  const [filteredListData, setFilteredListData] = useState([]);
  const filterfuncRef = useRef(throttle((searchValue) => {
    if (!changeListData.current) {
      return [];
    }
    if (!searchValue) {
      setFilteredListData(changeListData.current);
      return;
    }
    const keys = Object.keys(changeListData.current);
    const newData = {};
    for (const key of keys) {
      for (const item of changeListData.current[key]) {
        if (item.oldText?.toLowerCase().match(searchValue.toLowerCase()) || item.newText?.toLowerCase().match(searchValue.toLowerCase())) {
          if (!newData[key]) {
            newData[key] = [];
          }
          newData[key].push(item);
        }
      }
    }
    setFilteredListData(newData);
  }, 100, { leading: true }));

  useEffect(() => {
    const updatePanelItems = (e) => {
      const { annotMap, diffCount } = e.detail;
      setTotalChanges(diffCount);
      changeListData.current = annotMap;
      setFilteredListData(annotMap);
    };
    window.addEventListener(Events.COMPARE_ANNOTATIONS_LOADED, updatePanelItems);
    const resetPanelItems = () => {
      setTotalChanges(0);
      changeListData.current = [];
    };
    core.addEventListener('documentUnloaded', resetPanelItems, undefined, 1);
    core.addEventListener('documentUnloaded', resetPanelItems, undefined, 2);
    return () => {
      window.removeEventListener(Events.COMPARE_ANNOTATIONS_LOADED, updatePanelItems);
      core.removeEventListener('documentUnloaded', resetPanelItems, 1);
      core.removeEventListener('documentUnloaded', resetPanelItems, 2);
    };
  }, []);

  const renderPageItem = (pageNum) => {
    const changeListItems = filteredListData[pageNum];
    return <React.Fragment key={pageNum}>
      <div className="page-number">{t('multiViewer.comparePanel.page')} {pageNum}</div>
      {changeListItems.map(((props, index) => <ChangeListItem key={index} {...props} />))}
    </React.Fragment>;
  };

  const onSearchInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    filterfuncRef.current(newValue);
  };


  return (
    <DataElementWrapper className={classNames('Panel', 'ComparePanel', { 'open': isOpen, })}
      dataElement="comparePanel" style={style}
    >
      <div className="input-container">
        <input
          type="text"
          autoComplete="off"
          value={searchValue}
          onChange={onSearchInputChange}
          placeholder={t('multiViewer.comparePanel.Find')}
          aria-label={t('multiViewer.comparePanel.Find')}
          id="ComparePanel__input"
          tabIndex={isOpen ? 0 : -1}
        />
      </div>
      <div className="changeListContainer">
        <div className="changeListTitle">{t('multiViewer.comparePanel.changesList')} <span>({totalChanges})</span>
        </div>
        <div className="changeList">
          {totalChanges && filteredListData && Object.keys(filteredListData).map((key) => renderPageItem(key))}
        </div>
      </div>
    </DataElementWrapper>
  );
};

export default ComparePanel;