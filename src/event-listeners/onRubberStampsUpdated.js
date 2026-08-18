import core from 'core';
import actions from 'actions';
import getCurrentT from 'helpers/getCurrentT';
import { getDefaultStampCategory } from 'helpers/stamps';

const onRubberStampsUpdated = (dispatch) => async () => {
  const boundTranslator = getCurrentT();
  const rubberStampTool = core.getTool('AnnotationCreateRubberStamp');
  const annotations = await rubberStampTool.getCustomStamps();
  const customStampCategories = annotations.reduce((categories, annotation) => {
    const category = annotation['category'] || getDefaultStampCategory();
    if (!categories.includes(category)) {
      categories.push(category);
    }
    return categories;
  }, []);

  dispatch(actions.setStandardStamps(boundTranslator));
  dispatch(actions.setCustomStamps(boundTranslator));
  dispatch(actions.setCustomStampCategories(customStampCategories));
};

export default onRubberStampsUpdated;