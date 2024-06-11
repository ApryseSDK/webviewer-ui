module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow hexcode colors',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [] // no options
  },
  create: function(context) {
    return {
      Literal(node) {
        const value = node.value;
        const hexColorRegex = /#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b/;

        if (typeof value === 'string' && hexColorRegex.test(value)) {
          context.report({
            node,
            message: 'Hexcode colors are not allowed, use a variable instead.'
          });
        }
      }
    };
  }
};
