import getAnnotationStyle from 'helpers/getAnnotationStyle';

test('getAnnotationStyle', () => {
  const fullAnnotation = { FillColor: 'test', StrokeColor: 'test', TextColor: 'test', Opacity: 'test', StrokeThickness: 'test', FontSize: 'test' };
  const emptyAnnotation = {};
  const partialAnnotation = { StrokeColor: 'test', FontSize: 'test' };
  const invalidAnnotation = { InvalidProperty: 'test', StrokeColor: 'test' };
  const highlightAnnotation = { elementName: 'highlight', FillColor: 'test', Opacity: 'test'};
  expect(getAnnotationStyle(fullAnnotation)).toEqual({ FillColor: 'test', StrokeColor: 'test', TextColor: 'test', Opacity: 'test', StrokeThickness: 'test', FontSize: 'test' } );
  expect(getAnnotationStyle(emptyAnnotation)).toEqual({});
  expect(getAnnotationStyle(partialAnnotation)).toEqual({ StrokeColor: 'test', FontSize: 'test' } );
  expect(getAnnotationStyle(invalidAnnotation)).toEqual({ StrokeColor: 'test'} );
  expect(getAnnotationStyle(highlightAnnotation)).toEqual({ FillColor: 'test', Opacity: null });
}); 