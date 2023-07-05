import buttonTransform from './button';

export default [
  // this TS plugin is necessary to parse the code as TS and return TS
  ['@babel/plugin-syntax-typescript', { isTSX: true }],

  buttonTransform,
];
