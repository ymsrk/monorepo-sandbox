// ホバーした時に表示される型が分かりやすくなる。
// see:https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
