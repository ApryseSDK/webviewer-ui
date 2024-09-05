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
  DELETE: 'delete'
};

export const menuItems = [
  createFlyoutItem(menuTypes.OPENFILE, 'icon-portfolio-file', 'portfolio.openFile'),
  createFlyoutItem(menuTypes.RENAME, 'ic_edit_page_24px', 'action.rename'),
  createFlyoutItem(menuTypes.SETDEST, 'icon-thumbtack', 'action.setDestination'),
  createFlyoutItem(menuTypes.DOWNLOAD, 'icon-download', 'action.download'),
  createFlyoutItem(menuTypes.DELETE, 'icon-delete-line', 'action.delete'),
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
        } else if (option === menuTypes.DOWNLOAD || option === menuTypes.OPENFILE) {
          hidden = type !== 'portfolio';
        } else if (option === menuTypes.SETDEST) {
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
  type: PropTypes.oneOf(['bookmark', 'outline', 'portfolio']).isRequired,
  handleOnClick: PropTypes.func,
  currentFlyout: PropTypes.object,
  flyoutSelector: PropTypes.string,
  shouldHideDeleteButton: PropTypes.bool,
};

export default MoreOptionsContextMenuFlyout;