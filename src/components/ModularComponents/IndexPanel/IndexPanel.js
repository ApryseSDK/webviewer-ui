import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import core from 'core';
import actions from 'actions';
import Icon from 'components/Icon';
import Button from 'components/Button';
import DataElementWrapper from 'components/DataElementWrapper';
import IndexPanelContent from 'components/ModularComponents/IndexPanelContent';
import DataElements from 'constants/dataElement';
import { getDataWithKey, mapAnnotationToKey } from 'constants/map';
import { isMobileSize } from 'helpers/getDeviceSize';
import ListSeparator from '../../ListSeparator';

const propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const IndexPanel = ({ widgets }) => {
  const [
    isOpen,
    isDisabled,
    isInDesktopOnlyMode,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, DataElements.INDEX_PANEL),
    selectors.isElementDisabled(state, DataElements.INDEX_PANEL),
    selectors.isInDesktopOnlyMode(state),
  ]);

  const [t] = useTranslation();
  const [isMultiSelectionMode, setMultiSelectionMode] = useState(false);
  const [selectingWidgets, setSelectingWidgets] = useState([]);
  const showIndexPanel = !isDisabled && isOpen;
  const isMobile = isMobileSize();
  const dispatch = useDispatch();
  const listRef = useRef({});
  const containerRef = useRef();
  const singleSelectedNoteId = useRef(-1);

  useEffect(() => {
    const selectedWidgets = core.getSelectedAnnotations().filter((annot) => annot instanceof window.Core.Annotations.WidgetAnnotation).map((widget) => widget.Id);
    setSelectingWidgets(selectedWidgets);
    if (selectedWidgets.length) {
      singleSelectedNoteId.current = selectedWidgets[0];
    }
  }, []);

  useEffect(() => {
    if (selectingWidgets.length && singleSelectedNoteId.current !== -1) {
      scrollToRow(singleSelectedNoteId.current);
    } else {
      singleSelectedNoteId.current = -1;
    }
  }, [selectingWidgets]);

  const onAnnotationSelected = (annotations, action) => {
    if (action === 'selected') {
      const selectedWidgets = annotations.filter((annot) => annot instanceof window.Core.Annotations.WidgetAnnotation)
        .map((widget) => widget.Id);
      setSelectingWidgets([...selectedWidgets]);
      if (selectedWidgets.length) {
        singleSelectedNoteId.current = selectedWidgets[0];
      }
    } else if (action === 'deselected') {
      const deselectedWidgets = annotations.filter((annot) => annot instanceof window.Core.Annotations.WidgetAnnotation).map((widget) => widget.Id);
      setSelectingWidgets((prevSelectedWidgets) => prevSelectedWidgets.filter((id) => !deselectedWidgets.includes(id)));
    }
  };

  useEffect(() => {
    core.addEventListener('annotationSelected', onAnnotationSelected);

    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
    };
  }, [isMultiSelectionMode]);

  const isElementViewable = (element) => {
    const parent = containerRef.current;
    if (!parent) {
      return false;
    }
    const parentRect = parent.getBoundingClientRect();
    const childRect = element.getBoundingClientRect();

    return (
      childRect.top >= parentRect.top &&
      childRect.top <= parentRect.top + parent.clientHeight
    );
  };

  const scrollToRow = (key) => {
    const child = listRef.current[key];
    if (!child) {
      return;
    }
    const isViewable = isElementViewable(child);
    if (!isViewable) {
      child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  const constructRadioWidgetGroupByPageNum = (widget) => {
    const field = widget.getField();
    const childWidgets = [];
    const widgets = field?.widgets || [];
    widgets.forEach((child) => {
      if (child['PageNumber'] !== widget['PageNumber']) {
        return;
      }
      childWidgets.push(child);
    });
    if (childWidgets.length <= 1) {
      return widget;
    }
    const newWidget = {
      'fieldName': widget['fieldName'],
      'Id': null,
      'PageNumber': widget['PageNumber'],
      childWidgets,
    };
    return newWidget;
  };

  const dataToRender = widgets.reduce((arr, widget) => {
    if (!arr[widget['PageNumber']]) {
      arr[widget['PageNumber']] = [];
    }
    for (const childWidget of arr[widget['PageNumber']]) {
      if (childWidget['fieldName'] === widget['fieldName']) {
        return arr;
      }
    }
    widget = constructRadioWidgetGroupByPageNum(widget);
    arr[widget['PageNumber']].push(widget);
    return arr;
  }, {});

  const sortedPageNumbers = Object.keys(dataToRender).sort((a, b) => a - b);

  const handleDeletion = (widgetId) => {
    if (widgetId) {
      core.deleteAnnotations([core.getAnnotationById(widgetId)]);
      return;
    }
    const widgets = selectingWidgets.map((id) => core.getAnnotationById(id));
    core.deleteAnnotations(widgets);
  };

  const handleSingleSelection = (id) => {
    const isSelected = selectingWidgets.includes(id);
    const widget = core.getAnnotationById(id);
    core.deselectAllAnnotations();
    if (isSelected) {
      setSelectingWidgets([]);
      return;
    }
    setSelectingWidgets([id]);
    core.selectAnnotation(core.getAnnotationById(id));
    core.jumpToAnnotation(widget);
  };

  const handleEditButtonClick = () => {
    setMultiSelectionMode(true);
    setSelectingWidgets([]);
    core.deselectAllAnnotations();
    singleSelectedNoteId.current = -1;
  };

  const handleDoneButtonClick = () => {
    setMultiSelectionMode(false);
    setSelectingWidgets([]);
    core.deselectAllAnnotations();
    singleSelectedNoteId.current = -1;
  };

  const handleMultiSelection = (id, val, widgets) => {
    let selectWidgetsId = [];
    if (!id) {
      const childrenWidgetIds = widgets.map((widget) => widget['Id']);
      selectWidgetsId = val ? [...childrenWidgetIds, ...selectingWidgets] : selectingWidgets.filter((widgetId) => !childrenWidgetIds.includes(widgetId));
    } else {
      selectWidgetsId = val ? [id, ...selectingWidgets] : selectingWidgets.filter((widgetId) => widgetId !== id);
    }
    setSelectingWidgets(selectWidgetsId);
    const annots = selectWidgetsId.map((widgetId) => core.getAnnotationById(widgetId));
    core.deselectAllAnnotations();
    core.selectAnnotations(annots);
    if (val) {
      const widget = core.getAnnotationById(id || widgets[0]['Id']);
      core.jumpToAnnotation(widget);
    }
  };

  const handleSetSelected = (id, val, widgets) => {
    singleSelectedNoteId.current = id;
    if (!isMultiSelectionMode) {
      handleSingleSelection(id);
      return;
    }
    handleMultiSelection(id, val, widgets);
  };

  const generateRefList = (element, id, ids) => {
    if (!id) {
      ids.forEach((Id) => {
        listRef.current[Id] = element;
      });
    } else {
      listRef.current[id] = element;
    }
  };

  const NoFields = (
    <div className="no-fields">
      <div>
        <Icon className="empty-icon" glyph="illustration - empty state - outlines" />
      </div>
      <div className="msg">{t('formField.indexPanel.notFields')}</div>
    </div>
  );

  const showFields = () => (sortedPageNumbers.map((pageNumber) => {
    return (
      <ul className="index-page-container" key={pageNumber}>
        <ListSeparator renderContent={() => `${t('option.shared.page')} ${pageNumber}`} />
        {dataToRender[pageNumber].map(renderContent)}
      </ul>
    );
  }));

  const isRadioGroupSelected = (widgets) => {
    for (const widget of widgets) {
      if (!selectingWidgets.includes(widget['Id'])) {
        return false;
      }
    }
    return true;
  };

  const renderContent = (widget) => {
    const fieldName = widget['fieldName'];
    const icon = widget.childWidgets ? 'ic-folder-open' : getDataWithKey(mapAnnotationToKey(widget)).icon;
    const widgetId = widget['Id'];
    const childWidgets = widget.childWidgets || null;
    const isActive = widgetId ? selectingWidgets.includes(widgetId) : isRadioGroupSelected(childWidgets);
    const childrenWidgetIds = childWidgets ? childWidgets.map((child) => child['Id']) : [];
    return (
      <IndexPanelContent
        key={widget['Id']}
        ref={(element) => generateRefList(element, widgetId, childrenWidgetIds)}
        isMultiSelectionMode={isMultiSelectionMode}
        fieldName={fieldName}
        icon={icon}
        widgetId={widgetId}
        setSelected={handleSetSelected}
        isActive={isActive}
        handleDeletion={handleDeletion}
        childWidgets={childWidgets}
        selectingWidgets={selectingWidgets}
      />
    );
  };

  const closeIndexPanel = () => {
    dispatch(actions.closeElement(DataElements.INDEX_PANEL));
  };

  const renderMobileCloseButton = () => {
    return (
      <div className="close-container">
        <button className="close-icon-container" onClick={closeIndexPanel}>
          <Icon glyph="ic_close_black_24px" className="close-icon" />
        </button>
      </div>
    );
  };

  return !showIndexPanel ?
    null :
    (
      <div className='index-panel-container'>
        <DataElementWrapper
          className='index-panel-header'
          dataElement='index-panel-header'
        >
          {!isInDesktopOnlyMode && isMobile && renderMobileCloseButton()}
          <DataElementWrapper
            className="title-container"
            dataElement="index-panel-title-container"
          >
            <DataElementWrapper
              className="fields-counter"
              dataElement="index-panel-fields-counter"
            >
              <span>{t('formField.indexPanel.formFieldList')}</span> ({widgets.length})

            </DataElementWrapper>
            <DataElementWrapper
              dataElement="form-field-multi-select"
            >
              {!isMultiSelectionMode &&
                <Button
                  className="field-control-button"
                  label={t('action.edit')}
                  disabled={widgets.length === 0}
                  onClick={handleEditButtonClick}
                />
              }
              {isMultiSelectionMode &&
                <Button
                  className="field-control-button"
                  label={t('option.bookmarkOutlineControls.done')}
                  onClick={handleDoneButtonClick}
                />
              }
            </DataElementWrapper>
          </DataElementWrapper>
        </DataElementWrapper>

        <DataElementWrapper
          className="IndexPanel"
          dataElement="index-panel"
          ref={containerRef}
        >
          {widgets.length ? showFields() : NoFields}
        </DataElementWrapper>
        {isMultiSelectionMode && <DataElementWrapper
          className="index-panel-footer"
          dataElement="index-panel-footer"
        >
          <Button
            className="multi-selection-button"
            img="icon-delete-line"
            disabled={selectingWidgets.length === 0}
            onClick={() => handleDeletion()}
          />
        </DataElementWrapper>}
      </div>
    );
};

IndexPanel.propTypes = propTypes;

export default IndexPanel;