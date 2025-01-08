function hideRequiredWidgetStyling(widgets) {
  const updatedWidgets = [];

  widgets.forEach((widget) => {
    if (widget.getFieldFlags()['Required']) {
      widget.getFieldFlags()['Required'] = false;
      widget.refresh();
      updatedWidgets.push(widget);
    }
  });

  return updatedWidgets;
}

function showRequiredWidgetStyling(widgets) {
  widgets.forEach((widget) => {
    widget.getFieldFlags()['Required'] = true;
    widget.refresh();
  });
}

export {
  hideRequiredWidgetStyling,
  showRequiredWidgetStyling
};