import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import core from 'core';
import ActionButton from 'components/ActionButton';
import Dropdown from 'components/Dropdown';
import {
  LIST_OPTIONS,
  OFFICE_BULLET_OPTIONS,
  OFFICE_NUMBER_OPTIONS,
} from 'src/constants/officeEditor';
import './ListToggleButton.scss';

const propTypes = {
  listType: PropTypes.oneOf(Object.values(LIST_OPTIONS)).isRequired,
};

const ListToggleButton = (props) => {
  const [
    activeListType,
    customizableUI,
  ] = useSelector(
    (state) => [
      selectors.getActiveListType(state),
      selectors.getFeatureFlags(state)?.customizableUI,
    ],
    shallowEqual,
  );

  const { listType } = props;

  const bulletListObjects = OFFICE_BULLET_OPTIONS.map((options) => ({
    className: 'officeEditor-list-style-icon',
    key: options.enum,
    src: options.img
  }));

  const numberListOptions = OFFICE_NUMBER_OPTIONS.map((options) => ({
    className: 'officeEditor-list-style-icon',
    key: options.enum,
    src: options.img
  }));

  const listTypeName = listType === LIST_OPTIONS.Unordered ? 'bullet' : listType === LIST_OPTIONS.Ordered && 'number';

  const dataElement = `${listType}ListDropButton`;
  const icon = `icon-office-editor-${listTypeName}-list`;
  const title = `officeEditor.${listTypeName}List`;

  const handleClick = () => {
    core.getOfficeEditor().toggleListSelection(listType);
  };

  return (
    <div className={classNames({
      'office-editor-number-list-wrapper': true,
      'modular-ui': customizableUI,
    })}>
      <ActionButton
        isActive={activeListType === listType}
        dataElement={dataElement}
        title={title}
        img={icon}
        className='list-style-button'
        onClick={handleClick}
        ariaPressed={activeListType === listType}
      />
      <Dropdown
        id={`${listTypeName}-list`}
        dataElement={`office-editor-${listTypeName}-list-dropdown`}
        images={listTypeName === 'bullet' ? bulletListObjects : numberListOptions}
        columns={3}
        onClickItem={(val) => {
          core.getOfficeEditor().setListPreset(val);
        }}
        className='list-style-dropdown'
        translationPrefix={`officeEditor.${listTypeName}Dropdown`}
        showLabelInList={true}
      />
    </div>
  );
};

ListToggleButton.propTypes = propTypes;
ListToggleButton.displayName = 'ListToggleButton';

export default ListToggleButton;