import isDataElementPanel from 'helpers/isDataElementPanel';

describe('isDataElementPanel', () => {

  test('isDefaultPanel is true and isCustomPanel is false', () => {
    expect(isDataElementPanel('notesPanel')).toEqual(true);
  });

  test('isDefaultPanel is false and isCustomPanel is true', () => {
    const mockState = {
      viewer: {
        customPanels: [{
          panel: { dataElement: 'test' }
        }]
      }
    };
    expect(isDataElementPanel('test', mockState)).toEqual(true);
  });
  
  test('isDefaultPanel is false and isCustomPanel is false', () => {
    const mockState = {
      viewer: {
        customPanels: [{
          panel: { dataElement: 'testz' }
        }]
      }
    };
    expect(isDataElementPanel('test', mockState)).toEqual(false);
  });

  test('isDefaultPanel is true and isCustomPanel is true', () => {
    const mockState = {
      viewer: {
        customPanels: [{
          panel: { dataElement: 'notesPanel' }
        }]
      }
    };
    expect(isDataElementPanel('notesPanel', mockState)).toEqual(true);
  });

});