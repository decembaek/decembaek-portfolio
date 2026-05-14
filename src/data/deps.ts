export type Dep = { name: string; v: string; note: string };

export const DEPS: Dep[] = [
  { name: 'typescript', v: '^7.2.0', note: '// daily driver' },
  { name: 'react', v: '^19.0.0', note: '' },
  { name: 'go', v: '^1.24', note: '// for things that must not be slow' },
  { name: 'python', v: '^3.6', note: '// my favorite' },
  { name: 'swift', v: '^6.0', note: '// when the mac calls' },
  { name: 'PostgreSQL', v: '*', note: '// RDBS' },
  { name: 'MySQL', v: '*', note: '// RDBS' },
  { name: 'Redis', v: '*', note: '// Cache, Message Queue' },
];

export const DEV_DEPS: Dep[] = [
  { name: 'xcode', v: '*', note: '// 개발 툴' },
  { name: 'vscode', v: '*', note: '// 개발 툴' },
  { name: 'Visual Studio', v: '*', note: '// 개발 툴' },
  { name: 'Cursor', v: '*', note: '// 개발 툴' },
  { name: 'poetry', v: '*', note: '// 파이썬 버전 관리' },
  { name: 'uv', v: '*', note: '// 파이썬 버전 관리' },
  { name: 'Docker', v: '*', note: '// 배포 환경' },
  { name: 'npm', v: '*', note: '// npm 패키지 관리' },
  { name: 'Homebrew', v: '*', note: '// 맥앱 설치 솔루션' },
];
