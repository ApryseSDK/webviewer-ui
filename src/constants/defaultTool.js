import { isIOS, isAndroid } from 'helpers/device';

export default (isIOS || isAndroid) ? 'Pan' : 'AnnotationEdit';