import { panelNames } from 'constants/panel';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import DataElements from 'constants/dataElement';

const { ToolNames } = window.Core.Tools;

export default {
  dataElement: [],
  dataElementBlacklist: [],
  panel: [
    panelNames.SIGNATURE,
    panelNames.CHANGE_LIST,
    panelNames.SEARCH,
    panelNames.NOTES,
    panelNames.OUTLINE,
    panelNames.BOOKMARKS,
    panelNames.THUMBNAIL,
    panelNames.TABS,
  ],
  toolButton: [
    ToolNames.EDIT,
    ToolNames.TEXT_SELECT,
    ToolNames.OFFICE_EDITOR_CONTENT_SELECT,
    ToolNames.PAN,
  ],
  presetButton: [
    PRESET_BUTTON_TYPES.FULLSCREEN,
    PRESET_BUTTON_TYPES.DOWNLOAD,
    PRESET_BUTTON_TYPES.FILE_PICKER,
    PRESET_BUTTON_TYPES.SAVE_AS,
    PRESET_BUTTON_TYPES.PRINT,
    PRESET_BUTTON_TYPES.SETTINGS,
    PRESET_BUTTON_TYPES.TOGGLE_ACCESSIBILITY_MODE,
    PRESET_BUTTON_TYPES.COMPARE,
  ],
  modal: [
    DataElements.PRINT_MODAL,
    DataElements.ERROR_MODAL,
    DataElements.PASSWORD_MODAL,
    DataElements.FILTER_MODAL,
    DataElements.SETTINGS_MODAL,
    DataElements.SAVE_MODAL,
    DataElements.LOADING_MODAL,
    DataElements.PROGRESS_MODAL,
    DataElements.WARNING_MODAL,
    DataElements.COLOR_PICKER_MODAL,
    DataElements.OPEN_FILE_MODAL,
    DataElements.CUSTOM_MODAL,
    DataElements.SIGNATURE_VALIDATION_MODAL,
  ],
  popup: [
    DataElements.VIEW_FILE_BUTTON,
    DataElements.FILE_ATTACHMENT_DOWNLOAD,
    DataElements.PLAY_SOUND_BUTTON,
    DataElements.COPY_TEXT_BUTTON,
    DataElements.PAN_TOOL_BUTTON,
  ],
  overlay: []
};
