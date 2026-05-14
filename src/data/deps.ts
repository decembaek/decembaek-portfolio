export type Dep = { name: string; v: string; note: string };

export const DEPS: Dep[] = [
  { name: "typescript",      v: "^7.2.0",  note: "// daily driver" },
  { name: "react",           v: "^19.0.0", note: "" },
  { name: "go",              v: "^1.24",   note: "// for things that must not be slow" },
  { name: "swift",           v: "^6.0",    note: "// when the mac calls" },
  { name: "rust",            v: "^1.5",    note: "// learning in public" },
  { name: "postgres",        v: "^17",     note: "// my therapist" },
  { name: "figma",           v: "*",       note: "" },
  { name: "vim-motions",     v: "^0.0.3",  note: "// still bad at them, won't quit" },
  { name: "design-systems",  v: "^4.0.0",  note: "" },
  { name: "writing-readmes", v: "^2.1.0",  note: "// underrated skill" },
];

export const DEV_DEPS: Dep[] = [
  { name: "espresso",       v: "*",       note: "// peer dependency: cortado" },
  { name: "long-walks",     v: "^1.0.0",  note: "" },
  { name: "korean-poetry",  v: "^0.8.0",  note: "// see /now" },
];
