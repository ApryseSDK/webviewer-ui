import React, { useRef } from 'react';
import './ComparePanel.scss';
import DataElementWrapper from 'components/DataElementWrapper';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { isMobileSize } from 'helpers/getDeviceSize';
import ChangeListItem from 'components/MultiViewer/ComparePanel/ChangeListItem';
import throttle from 'lodash/throttle';
import { panelMinWidth } from 'constants/panel';
import Icon from 'components/Icon';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import PropTypes from 'prop-types';

const specialChar = /([!@#$%^&*()+=\[\]\\';,./{}|":<>?~_-])/gm;

const ComparePanel = ({
  dataElement = 'comparePanel',
  selectedAnnotations,
  isOpen,
  currentWidth,
  toggleComparisonAnnotations,
  isInDesktopOnlyMode,
  isComparisonOverlayEnabled,
  totalChanges,
  filteredListData,
  setFilteredListData,
}) => {
  const { t } = useTranslation();
  const isMobile = isMobileSize();
  const panelWidth = currentWidth ? currentWidth - 16 : panelMinWidth - 32;
  const [searchValue, setSearchValue] = React.useState('');
  const style = !isInDesktopOnlyMode && isMobile ? {} : { width: `${panelWidth}px`, minWidth: `${panelWidth}px` };
  const changeListData = useRef(filteredListData);
  const filterfuncRef = useRef(
    throttle((searchValue) => {
      if (!changeListData.current) {
        return [];
      }
      if (!searchValue) {
        setFilteredListData(changeListData.current);
        return;
      }
      searchValue = searchValue.replace(specialChar, '\\$&');
      const keys = Object.keys(changeListData.current);
      const newData = {};
      for (const key of keys) {
        for (const item of changeListData.current[key]) {
          if (
            item.oldText?.toLowerCase().match(searchValue.toLowerCase()) ||
            item.newText?.toLowerCase().match(searchValue.toLowerCase())
          ) {
            if (!newData[key]) {
              newData[key] = [];
            }
            newData[key].push(item);
          }
        }
      }
      setFilteredListData(newData);
    },
    100, { leading: true }),
  );

  const renderPageItem = (pageNum) => {
    const changeListItems = filteredListData[pageNum];
    return <React.Fragment key={pageNum}>
      <div className="page-number">{t('multiViewer.comparePanel.page')} {pageNum}</div>
      {
        changeListItems.map((props) => {
          const selectedAnnotationId = (selectedAnnotations && selectedAnnotations.length) ? selectedAnnotations[0].Id : null;
          return (<ChangeListItem
            selectedAnnotationId={selectedAnnotationId}
            key={`${props.new?.Id ?? 'null'}-${props.old?.Id ?? 'null'}`}
            {...props}
          />);
        })
      }
    </React.Fragment>;
  };

  const onSearchInputChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    filterfuncRef.current(newValue);
  };

  const shouldRenderItems = !!(totalChanges && filteredListData && Object.keys(filteredListData).length);
  return (
    <DataElementWrapper
      className={classNames('Panel', 'ComparePanel', { 'open': isOpen })}
      dataElement={dataElement}
      style={style}
    >
      <div className="input-container">
        <Icon glyph="icon-header-search" />
        <input
          type="text"
          autoComplete="off"
          value={searchValue}
          onChange={onSearchInputChange}
          aria-label={t('multiViewer.comparePanel.Find')}
          id="ComparePanel__input"
          tabIndex={isOpen ? 0 : -1}
        />
      </div>
      <div className="changeListContainer">
        <div className="changeListTitle">
          {t('multiViewer.comparePanel.changesList')} <span>({totalChanges})</span>
        </div>
        <div className="highlightSwitch">
          <Choice
            isSwitch={true}
            label={t('action.highlightChanges')}
            checked={isComparisonOverlayEnabled}
            onChange={toggleComparisonAnnotations}
          />
        </div>
        <div className="changeList">
          {shouldRenderItems && Object.keys(filteredListData).map((key) => renderPageItem(key))}
        </div>
      </div>
    </DataElementWrapper>
  );
};

ComparePanel.propTypes = {
  dataElement: PropTypes.string,
  selectedAnnotations: PropTypes.array,
  isOpen: PropTypes.bool,
  currentWidth: PropTypes.number,
  toggleComparisonAnnotations: PropTypes.func,
  isInDesktopOnlyMode: PropTypes.bool,
  isComparisonOverlayEnabled: PropTypes.bool,
  totalChanges: PropTypes.number,
  filteredListData: PropTypes.object,
  setFilteredListData: PropTypes.func,
};

export default ComparePanel;
