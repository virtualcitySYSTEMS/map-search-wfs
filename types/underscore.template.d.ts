declare module 'underscore.template' {
  function UnderscoreTemplate(template: string): (arg1: object) => string;

  export default UnderscoreTemplate;
}
