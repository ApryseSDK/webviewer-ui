export default function getToolbarTranslationString(group, map) {
  const customHeaderProperties = map[group];
  if (customHeaderProperties && customHeaderProperties.name) {
    return customHeaderProperties.name;
  }
  return `option.toolbarGroup.${group}`;
}