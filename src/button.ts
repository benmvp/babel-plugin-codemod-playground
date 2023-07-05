import { type NodePath, type PluginObj, types as t } from '@babel/core';

const transformWidth = (
  path: NodePath<t.JSXElement>,
  oldName: string,
  newWidthValue: string,
) => {
  path
    .get('openingElement')
    .get('attributes')
    .filter(
      (attributePath): attributePath is NodePath<t.JSXAttribute> =>
        t.isJSXAttribute(attributePath.node) &&
        t.isJSXIdentifier(attributePath.node.name) &&
        attributePath.node.name.name === oldName,
    )
    .forEach((attributePath) => {
      const getNewAttribute = () => {
        const attribute = attributePath.node;

        // If the attribute is a boolean and `true` or just exists (implicit
        // `true`), then replace it with the new `width` prop
        if (
          attribute.value === null ||
          (t.isJSXExpressionContainer(attribute.value) &&
            t.isBooleanLiteral(attribute.value.expression) &&
            attribute.value.expression.value === true)
        ) {
          return t.jSXAttribute(
            t.jsxIdentifier('width'),
            t.stringLiteral(newWidthValue),
          );
        }

        // Remove the attribute if it's a boolean and `false`
        if (
          t.isJSXExpressionContainer(attribute.value) &&
          t.isBooleanLiteral(attribute.value.expression) &&
          attribute.value.expression.value === false
        ) {
          return null;
        }

        // Use a ternary if it's a variable identifier instead of trying to read
        // scope and figure out if it's `true` or `false`
        if (
          t.isJSXExpressionContainer(attribute.value) &&
          t.isIdentifier(attribute.value.expression)
        ) {
          return t.jSXAttribute(
            t.jsxIdentifier('width'),
            t.jsxExpressionContainer(
              t.conditionalExpression(
                t.identifier(attribute.value.expression.name),
                t.stringLiteral(newWidthValue),
                t.identifier('undefined'),
              ),
            ),
          );
        }
      };

      const newAttribute = getNewAttribute();

      if (newAttribute === null) {
        attributePath.remove();
      } else if (newAttribute) {
        attributePath.replaceWith(newAttribute);
      } else {
        // we couldn't figure out what to do! leave a comment?
      }
    });
};

const buttonTransform = (): PluginObj => ({
  visitor: {
    JSXElement(path) {
      if (
        !t.isJSXIdentifier(path.node.openingElement.name) ||
        path.node.openingElement.name.name !== 'Button'
      ) {
        return;
      }

      transformWidth(path, 'isFullWidth', 'full');
      transformWidth(path, 'isInline', 'fit');
    },
  },
});

export default buttonTransform;
