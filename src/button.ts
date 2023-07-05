import { type NodePath, type PluginObj, types as t } from '@babel/core';

const getBooleanValueFromScope = (path: NodePath, name: string) => {
  const binding = path.scope.getBinding(name);

  if (binding) {
    const { node } = binding.path;
    if (t.isVariableDeclarator(node) && t.isBooleanLiteral(node.init)) {
      return node.init.value;
    }
  }

  return undefined;
};

const getJSXAttributeValue = (attribute: t.JSXAttribute) => {
  if (
    t.isJSXExpressionContainer(attribute.value) &&
    t.isBooleanLiteral(attribute.value.expression)
  ) {
    return attribute.value.expression.value;
  }

  return undefined;
};

const buttonTransform = (): PluginObj => ({
  visitor: {
    JSXOpeningElement(path) {
      const { node } = path;
      const { attributes } = node;

      attributes.forEach((attribute, index) => {
        if (t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name)) {
          if (attribute.name.name === 'isFullWidth') {
            if (
              getJSXAttributeValue(attribute) === false ||
              getBooleanValueFromScope(path, attribute.name.name) === false
            ) {
              // Remove the attribute if it's a boolean and false
              attributes.splice(index, 1);
            } else {
              // Rename the attribute name from "isFullWidth" to "width"
              attribute.name.name = 'width';

              // Change the attribute value to a string literal with the value "full"
              attribute.value = t.stringLiteral('full');
            }
          } else if (attribute.name.name === 'isInline') {
            if (
              getJSXAttributeValue(attribute) === false ||
              getBooleanValueFromScope(path, attribute.name.name) === false
            ) {
              // Remove the attribute if it's a boolean and false
              attributes.splice(index, 1);
            } else {
              // Rename the attribute name from "isInline" to "width"
              attribute.name.name = 'width';

              // Change the attribute value to a string literal with the value "fit"
              attribute.value = t.stringLiteral('fit');
            }
          }
        }
      });
    },
  },
});

export default buttonTransform;
