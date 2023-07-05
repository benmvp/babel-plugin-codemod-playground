import { transformSync } from '@babel/core';
import plugin from './plugin';

const transform = (sourceCode: string, filename = 'Component.tsx') => {
  return transformSync(sourceCode, {
    babelrc: false,
    configFile: false,
    filename,
    generatorOpts: {
      retainLines: true,
    },
    plugins: plugin,
  })?.code;
};

test('replaces `isFullWidth` with `width="full"`', () => {
  const code = `
import { Button } from '@benmvp/components'

const MyComponent = () => {
  return <Button isFullWidth>Go</Button>

}
`;

  expect(transform(code)).toMatchInlineSnapshot(`
    "
    import { Button } from '@benmvp/components';

    const MyComponent = () => {
      return <Button width="full">Go</Button>;

    };"
  `);
});

test('replaces `isFullWidth={true}` with `width="full"`', () => {
  const code = `
import { Button } from '@benmvp/components'

const MyComponent = () => {
  return <Button isFullWidth={true}>Go</Button>

}
`;

  expect(transform(code)).toMatchInlineSnapshot(`
    "
    import { Button } from '@benmvp/components';

    const MyComponent = () => {
      return <Button width="full">Go</Button>;

    };"
  `);
});

test('replaces `isFullWidth` with `width="full"` when variable is `true`', () => {
  const code = `
import { Button } from '@benmvp/components'

const MyComponent = () => {
  const isFullWidth = true;
  return <Button isFullWidth={isFullWidth}>Go</Button>
}
`;

  expect(transform(code)).toMatchInlineSnapshot(`
    "
    import { Button } from '@benmvp/components';

    const MyComponent = () => {
      const isFullWidth = true;
      return <Button width={isFullWidth ? "full" : undefined}>Go</Button>;
    };"
  `);
});

test('removes `isFullWidth={false}`', () => {
  const code = `
import { Button } from '@benmvp/components'

const MyComponent = () => {
  return <Button isFullWidth={false}>Go</Button>

}
`;

  expect(transform(code)).toMatchInlineSnapshot(`
    "
    import { Button } from '@benmvp/components';

    const MyComponent = () => {
      return <Button>Go</Button>;

    };"
  `);
});

test('removes `isFullWidth` when variable is `false', () => {
  const code = `
import { Button } from '@benmvp/components'

const MyComponent = () => {
  const isFullWidth = false;

  return <Button isFullWidth={isFullWidth}>Go</Button>

}
`;

  expect(transform(code)).toMatchInlineSnapshot(`
    "
    import { Button } from '@benmvp/components';

    const MyComponent = () => {
      const isFullWidth = false;

      return <Button width={isFullWidth ? "full" : undefined}>Go</Button>;

    };"
  `);
});

test('replaces `isInline` with `width="fit"`', () => {
  const code = `
import { Button } from '@benmvp/components'

const MyComponent = () => {
  return <Button isInline>Go</Button>

}
`;

  expect(transform(code)).toMatchInlineSnapshot(`
    "
    import { Button } from '@benmvp/components';

    const MyComponent = () => {
      return <Button width="fit">Go</Button>;

    };"
  `);
});

test('replaces `isInline={true}` with `width="fit"`', () => {
  const code = `
import { Button } from '@benmvp/components'

const MyComponent = () => {
  return <Button isInline={true}>Go</Button>

}
`;

  expect(transform(code)).toMatchInlineSnapshot(`
    "
    import { Button } from '@benmvp/components';

    const MyComponent = () => {
      return <Button width="fit">Go</Button>;

    };"
  `);
});

test('replaces `isInline` with `width="fit"` when variable is `true`', () => {
  const code = `
import { Button } from '@benmvp/components'

const MyComponent = () => {
  const isInline = true;
  return <Button isInline={isInline}>Go</Button>
}
`;

  expect(transform(code)).toMatchInlineSnapshot(`
    "
    import { Button } from '@benmvp/components';

    const MyComponent = () => {
      const isInline = true;
      return <Button width={isInline ? "fit" : undefined}>Go</Button>;
    };"
  `);
});

test('removes `isInline={false}`', () => {
  const code = `
import { Button } from '@benmvp/components'

const MyComponent = () => {
  return <Button isInline={false}>Go</Button>

}
`;

  expect(transform(code)).toMatchInlineSnapshot(`
    "
    import { Button } from '@benmvp/components';

    const MyComponent = () => {
      return <Button>Go</Button>;

    };"
  `);
});

test('removes `isInline` when variable is `false', () => {
  const code = `
import { Button } from '@benmvp/components'

const MyComponent = () => {
  const isInline = false;

  return <Button isInline={isInline}>Go</Button>

}
`;

  expect(transform(code)).toMatchInlineSnapshot(`
    "
    import { Button } from '@benmvp/components';

    const MyComponent = () => {
      const isInline = false;

      return <Button width={isInline ? "fit" : undefined}>Go</Button>;

    };"
  `);
});
