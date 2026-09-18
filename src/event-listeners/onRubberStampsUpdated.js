import core from 'core';
import actions from 'actions';
import getCurrentT from 'helpers/getCurrentT';
import { getCustomStampCategoryFromAnnotation } from 'helpers/stamps';

const onRubberStampsUpdated = (dispatch) => async () => {
  const boundTranslator = getCurrentT();
  const rubberStampTool = core.getTool('AnnotationCreateRubberStamp');

  const customAnnotations = await rubberStampTool.getCustomStamps();
  const customStampCategories = customAnnotations.reduce((categories, annotation) => {
    const category = getCustomStampCategoryFromAnnotation(annotation);
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