import { expect } from 'chai';
import { doesCurrentViewContainEntirePage } from '../../../../src/ui/src/helpers/printCurrentViewHelper';
import { adjustListBoxForPrint, createFakeContainerForSelect, createFakeOption, hideSelectContainer  } from '../../../../src/ui/src/helpers/printHTMLToCanvasHelper';

describe('Print helper tests', () => {
  describe('doesCurrentViewContainEntirePage', () => {
    const sampleRect = {
      x1: 10,
      x2: 110,
      y1: 10,
      y2: 110
    };

    const sampleDimensions = {
      width: 100,
      height: 100
    };

    it('should return undefined if no rect or dimensions are provided', () => {
      let result = doesCurrentViewContainEntirePage(undefined, sampleDimensions);
      expect(result).to.equal(undefined);
      result = doesCurrentViewContainEntirePage(sampleRect, undefined);
      expect(result).to.equal(undefined);
    });

    it('should return true if rect is same size as page dimensions', () => {
      const result = doesCurrentViewContainEntirePage(sampleRect, sampleDimensions);
      expect(result).to.equal(true);
    });

    it('should return true if rect is larger than page dimensions', () => {
      sampleRect.x1 = 0;
      sampleRect.y1 = 0;
      sampleRect.x2 = 200;
      sampleRect.y2 = 200;

      const result = doesCurrentViewContainEntirePage(sampleRect, sampleDimensions);
      expect(result).to.equal(true);
    });

    it('should return false if rect is smaller than page dimensions', () => {
      sampleRect.x1 = 0;
      sampleRect.y1 = 0;
      sampleRect.x2 = 90;
      sampleRect.y2 = 90;

      const result = doesCurrentViewContainEntirePage(sampleRect, sampleDimensions);
      expect(result).to.equal(false);
    });
  });
});

const widgetContainerString = `
  <div id="printWidgetContainer" style="position: relative; top: -10000px;">
    <div class="list" id="List Box15" style="left: 90.3277px; top: 66.764px; width: 98.0003px; height: 70px; position: absolute; padding: 0px; margin: 0px; background-color: rgb(197, 251, 114); z-index: 35; transform: translate(0px, 0px) rotate(0deg); transform-origin: left top; appearance: none; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 1px; border-radius: 0px; font-family: Helvetica, sans-serif; font-weight: normal; font-style: normal; font-size: 12px; color: rgb(0, 0, 0); overflow: hidden auto;">
      <select name="List_Box15" size="4" style="position: absolute; font-size: inherit; font-family: inherit; font-weight: inherit; font-style: inherit; color: inherit; width: 98.0003px; height: 70px; border: 0px; padding: 0px; margin: 0px; background-color: transparent; vertical-align: top; text-align: left; justify-content: flex-start; overflow: hidden scroll; cursor: pointer;">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </div>
    <div class="list" id="List Box16" style="left: 88.364px; top: 244.801px; width: 98px; height: 70px; position: absolute; padding: 0px; margin: 0px; background-color: rgb(255, 192, 158); z-index: 35; transform: translate(0px, 0px) rotate(0deg); transform-origin: left top; appearance: none; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 1px; border-radius: 0px; font-family: Helvetica, sans-serif; font-weight: normal; font-style: normal; font-size: 12px; color: rgb(0, 0, 0); overflow: hidden auto;">
      <select name="List_Box16" size="4" multiple="" title="I'm a multiselect" style="position: absolute; font-size: inherit; font-family: inherit; font-weight: inherit; font-style: inherit; color: inherit; width: 98px; height: 70px; border: 0px; padding: 0px; margin: 0px; background-color: transparent; vertical-align: top; text-align: left; justify-content: flex-start; overflow: hidden scroll; cursor: pointer;">
        <option value="5">5</option>
        <option value="6" selected="selected">6</option>
        <option value="7" selected="selected">7</option>
        <option value="8">8</option>
      </select>
    </div>
    <div class="text" id="TEXTBOX" style="left: 310.22px; top: 94.95px; width: 197.52px; height: 55.56px; position: absolute; padding: 0px; margin: 0px; background-color: rgb(128, 229, 177); z-index: 35; transform: translate(0px, 0px) rotate(0deg); transform-origin: left top; appearance: none; border-style: solid; border-color: rgb(241, 160, 153); border-width: 7px; border-radius: 0px; font-family: Helvetica, sans-serif; font-weight: normal; font-style: normal; font-size: 12px; color: rgb(128, 229, 177);">
      <input type="text" tabindex="0" style="position: absolute; font-size: inherit; font-family: inherit; font-weight: inherit; font-style: inherit; color: inherit; width: 197.52px; height: 55.56px; border: 0px; padding: 0px; margin: 0px; background-color: transparent; vertical-align: top; text-align: left; justify-content: flex-start; display: inline-flex; align-items: center; overflow-wrap: break-word; resize: none; overflow: hidden;">
    </div>
  </div>
`;

describe('HTML to Canvas Helpers', () => {
  let widgetContainer;
  const selectionColor = 'rgb(179, 217, 255)';

  beforeEach(() => {
    widgetContainer = document.createElement('div');
    widgetContainer.innerHTML = widgetContainerString;
    document.body.appendChild(widgetContainer);
  });

  afterEach(() => {
    document.getElementById('printWidgetContainer').remove();
});

  it('Should add new divs equal to the select elements + options', () => {
    const selects = widgetContainer.querySelectorAll('select').length;
    const options = widgetContainer.querySelectorAll('option').length;
    const divCount = widgetContainer.querySelectorAll('div').length;
    expect(selects).to.equal(2);
    expect(options).to.equal(8);
    expect(divCount).to.equal(4);
    adjustListBoxForPrint(widgetContainer);
    const newDivCount = widgetContainer.querySelectorAll('div').length;
    expect(newDivCount).to.equal(divCount + selects + options);
  });

  it('Should hide the old select element', () => {
    const select = document.querySelector('select');
    expect(select.style.display).to.not.equal('none');
    hideSelectContainer(select);
    expect(select.style.display).to.equal('none');
  });

  it('Should not change input elements', () => {
    const inputs = widgetContainer.querySelectorAll('input').length;
    adjustListBoxForPrint(widgetContainer);
    const newInputs = widgetContainer.querySelectorAll('input').length;
    expect(newInputs).to.equal(inputs);
  });

  it('Should hide the old select element', () => {
    const select = document.querySelector('select');
    expect(select.style.display).to.not.equal('none');
    hideSelectContainer(select);
    expect(select.style.display).to.equal('none');
  });

  it('Create Fake Option Should return an Valid HTMLDivElement', () => {
    const option = document.querySelector('option');
    const fakeOption = createFakeOption(option);
    expect(fakeOption).to.be.an.instanceof(HTMLDivElement);
  });

  it('Create Fake Option Should handle Multi Select', () => {
    const select = document.querySelectorAll('select')[1];
    const option = select.querySelectorAll('option')[2];
    const fakeOption = createFakeOption(option);
    expect(fakeOption.style.backgroundColor).to.equal(selectionColor);
  });

  it('Create Fake Option Should handle Single Select', () => {
    const select = document.querySelectorAll('select')[0];
    const option = select.querySelectorAll('option')[1];
    option.selected = true;
    const fakeOption = createFakeOption(option);
    expect(fakeOption.style.backgroundColor).to.equal(selectionColor);
  });

  it('Create Fake Container For Select Should return an Valid HTMLDivElement', () => {
    const select = document.querySelector('select');
    const fakeContainer = createFakeContainerForSelect(select);
    expect(fakeContainer).to.be.an.instanceof(HTMLDivElement);
  });
})