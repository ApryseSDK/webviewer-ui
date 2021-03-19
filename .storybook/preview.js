import '../src/index.scss';
import '../src/components/App/App.scss';
import core from 'core'

core.getTool = function () { }

import I18nDecorator from "./I18nDecorator";

export const decorators = [
  I18nDecorator,
];
