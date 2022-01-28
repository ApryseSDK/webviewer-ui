import setUIPropertiesForLayers from './setUIPropertiesForLayers';

describe('Tests setUIPropertiesForLayers', () => {
  let layers;
  it('should be able to disable children layer if parent layer is locked', () => {
    layers = [
      {
        name: '2',
        locked: true,
        children: [
          {
            name: 'a',
            children: [
              {
                name: '6'
              }
            ]
          }
        ]
      }
    ];
    const newLayers = setUIPropertiesForLayers(layers);
    expect(newLayers[0].children[0].disabled).toBeTruthy();
    expect(newLayers[0].children[0].children[0].disabled).toBeTruthy();
  });

  it('should not disable children layer if parent layer is not locked', () => {
    layers = [
      {
        name: '2',
        locked: false,
        children: [
          {
            name: 'a',
            children: [
              {
                name: '6',
              }
            ]
          }
        ]
      }
    ];
    const newLayers = setUIPropertiesForLayers(layers);
    expect(newLayers[0].children[0].disabled).toBeFalsy();
    expect(newLayers[0].children[0].children[0].disabled).toBeFalsy();
  });

  it('should not disable children layer if parent layer locked property is not defined', () => {
    layers = [
      {
        name: '2',
        locked: false,
        children: [
          {
            name: 'a',
            children: [
              {
                name: '6',
              }
            ]
          }
        ]
      }
    ];
    const newLayers = setUIPropertiesForLayers(layers);
    expect(newLayers[0].children[0].disabled).toBeFalsy();
    expect(newLayers[0].children[0].children[0].disabled).toBeFalsy();
  });

  it('should be able to set id based on idex of the layer', () => {
    layers = [
      {
        name: '2',
        locked: false,
        children: [
          {
            name: 'a',
            children: [
              {
                name: '6',
              }
            ]
          }
        ]
      },
      {
        name: '2',
        locked: false,
        children: [
          {
            name: 'a',
            children: [
              {
                name: '6',
              }
            ]
          }
        ]
      }
    ];
    const newLayers = setUIPropertiesForLayers(layers);
    expect(newLayers[0].id).toEqual('0');
    expect(newLayers[0].children[0].id).toEqual('0-0');
    expect(newLayers[0].children[0].children[0].id).toEqual('0-0-0');

    expect(newLayers[1].id).toEqual('1');
    expect(newLayers[1].children[0].id).toEqual('1-0');
    expect(newLayers[1].children[0].children[0].id).toEqual('1-0-0');
  });
});
