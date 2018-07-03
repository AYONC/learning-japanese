/** Global definitions for development **/

// for style loader
declare module '*.css' {
  const styles: any;
  export = styles;
}
declare module Window {}

type GenericFunc0<R> = () => R;
type GenericFunc1<T1, R> = (t1: T1) => R;
type GenericFunc2<T1, T2, R> = (t1: T1, t2: T2) => R;
type GenericFunc3<T1, T2, T3, R> = (t1: T1, t2: T2, t3: T3) => R;
type GenericFunc4<T1, T2, T3, T4, R> = (t1: T1, t2: T2, t3: T3, t4: T4) => R;
type GenericFuncAny<R> = (...args: any[]) => R;

type AnyFunc = () => any;
type AnyFunc1 = (t1: any) => any;
type FunctionMap = Record<string, GenericFuncAny<any>>;

// Omit type https://github.com/Microsoft/TypeScript/issues/12215
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];

type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;

interface Option {
  title: string;
  value: any;
}
