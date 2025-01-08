import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';

const createFlyoutItem = (option, icon, label) => ({
  icon,
  label,
  title: label,
  option,
  dataElement: `${option[0].toUpperCase() +  option.slice(1)}Button`,
});

export const menuTypes = {
  OPENFILE: 'openFile',
  RENAME: 'rename',
  SETDEST: 'setDestination',
  DOWNLOAD: 'download',
  DELETE: 'delete',
  OPENFORMFIELDPANEL: 'openFormFieldPanel',
  MOVE_UP: 'moveUp',
  MOVE_DOWN: 'moveDown',
  MOVE_LEFT: 'moveLeft',
  MOVE_RIGHT: 'moveRight',
};

export const menuItems = [
  createFlyoutItem(menuTypes.OPENFORMFIELDPANEL, 'icon-edit-form-field', 'action.edit'),
  createFlyoutItem(menuTypes.OPENFILE, 'icon-portfolio-file', 'portfolio.openFile'),
  createFlyoutItem(menuTypes.RENAME, 'ic_edit_page_24px', 'action.rename'),
  createFlyoutItem(menuTypes.SETDEST, 'icon-thumbtack', 'action.setDestination'),
  createFlyoutItem(menuTypes.DOWNLOAD, 'icon-download', 'action.download'),
  createFlyoutItem(menuTypes.DELETE, 'icon-delete-line', 'action.delete'),
  createFlyoutItem(menuTypes.MOVE_UP, 'icon-page-move-up', 'action.moveUp'),
  createFlyoutItem(menuTypes.MOVE_DOWN, 'icon-page-move-down', 'action.moveDown'),
  createFlyoutItem(menuTypes.MOVE_LEFT, 'icon-page-move-left', 'action.moveLeft'),
  createFlyoutItem(menuTypes.MOVE_RIGHT, 'icon-page-move-right', 'action.moveRight'),
];

const MoreOptionsContextMenuFlyout = ({
  type,
  handleOnClick,
  currentFlyout,
  flyoutSelector,
  shouldHideDeleteButton,
}) => {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const bookmarkOutlineFlyout = {
      dataElement: flyoutSelector,
      className: 'MoreOptionsContextMenuFlyout',
      items: menuItems.map((item) => {
        const { option } = item;
        let hidden = false;
        if (option === menuTypes.DELETE) {
          hidden = shouldHideDeleteButton;
        }
        if ([menuTypes.DOWNLOAD, menuTypes.OPENFILE].includes(option)) {
          hidden = type !== 'portfolio';
        }
        if (option === menuTypes.SETDEST) {
          hidden = type !== 'outline';
        }
        if (option === menuTypes.OPENFORMFIELDPANEL) {
          hidden = ['portfolio', 'bookmark'].includes(type);
        }
        if ([menuTypes.MOVE_UP, menuTypes.MOVE_DOWN].includes(option)) {
          hidden = !['portfolio'].includes(type);
        }

        if ([menuTypes.MOVE_LEFT, menuTypes.MOVE_RIGHT, menuTypes.MOVE_UP, menuTypes.MOVE_DOWN].includes(option)) {
          hidden = type !== 'outline';
        }

        return {
          ...item,
          hidden,
          dataElement: `${type}${item.dataElement}`,
          onClick: () => handleOnClick(item.option),
        };
      }),
    };
    async function runDispatch() {
      if (!currentFlyout) {
        dispatch(actions.addFlyout(bookmarkOutlineFlyout));
      } else {
        dispatch(actions.updateFlyout(bookmarkOutlineFlyout.dataElement, bookmarkOutlineFlyout));
      }
    }
    runDispatch();
  }, []);

  return null;
};


MoreOptionsContextMenuFlyout.propTypes = {
  type: PropTypes.oneOf(['bookmark', 'outline', 'portfolio', 'indexPanel', 'indexPanel.folder']).isRequired,
  handleOnClick: PropTypes.func,
  currentFlyout: PropTypes.object,
  flyoutSelector: PropTypes.string,
  shouldHideDeleteButton: PropTypes.bool,
};

export default MoreOptionsContextMenuFlyout;