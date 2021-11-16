export default (annotation, key, value) => {
    annotation.setCustomData(key, JSON.stringify(value));
};
