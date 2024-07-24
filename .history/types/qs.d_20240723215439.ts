declare module 'qs' {
    // Add the specific types you use from the qs module, or use 'any' if you prefer.
    const stringify: (obj: any, options?: any) => string;
    const parse: (str: string, options?: any) => any;
    export { stringify, parse };
    export default {
      stringify,
      parse,
    };
  }
  