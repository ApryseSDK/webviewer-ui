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