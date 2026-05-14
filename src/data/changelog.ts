export type ChangelogBullet = {
  type: 'added' | 'fixed' | 'changed' | 'removed';
  text: string;
};

export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  status?: 'current';
  bullets: ChangelogBullet[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: 'v2026.05',
    date: 'Mar 2026',
    status: 'current',
    title: '성장 중',
    bullets: [
      {
        type: 'added',
        text: 'LLM, AI Agent 기술에 대한 공부 진행 중',
      },
    ],
  },
  {
    version: 'v2026.04',
    date: 'Apr 2026',
    title: 'Logavio AI 로고 제작 서비스 - LLM 사이드 프로젝트',
    bullets: [
      {
        type: 'added',
        text: '나노바나나, gpt-image 모델을 사용해 목업 이미지 제작',
      },
      {
        type: 'added',
        text: 'logavio.com 도메인에 서비스 배포',
      },
      {
        type: 'added',
        text: 'Cloudflare AI Worker, Recraft API Wrap 서비스로 프롬프트 엔지니어링을 통해 서비스 개발',
      },
      { type: 'changed', text: 'Sleep schedule: stable on main.' },
    ],
  },
  {
    version: 'v2026.02',
    date: 'Feb 2026',
    title: 'SNS 스튜디오 솔루션 SocFlow 개발 - 사이드',
    bullets: [
      {
        type: 'added',
        text: '개발자, 자동화를 위한 OpenAPI 서비스 제작',
      },
      {
        type: 'added',
        text: 'Youtube, Instagram, Threads 를 한 곳에서 관리하는 웹 서비스 개발',
      },
      {
        type: 'added',
        text: 'socflow.app 도메인에 배포 진행',
      },
      {
        type: 'changed',
        text: '여러 SNS 플랫폼을 운영하는 사람들을 위해 한 곳에서 사용 가능한 웹 사이트 제작',
      },
    ],
  },
  {
    version: 'v2025.10',
    date: 'Oct 2025',
    title: 'Rasbit R&D 연구 개발',
    bullets: [
      {
        type: 'added',
        text: '실시간 장비 제어, 모니터링이 가능한 대시보드 페이지 개발',
      },
      {
        type: 'added',
        text: '수질 정보인 수온, DO, pH, 염분 상태를 분석하고 ML 모델을 사용해 변하는 수질 수치를 예측하여 실시간 장비 제어 에이전트 개발',
      },
      {
        type: 'added',
        text: '영상 데이터 수집 후 Detection 딥러닝 모델을 사용해 수조 오염도 분석 모델 개발',
      },
      {
        type: 'added',
        text: '실시간 영상 모니터링 안전성을 위해 IP 카메라로부터 받아오는 영상 정보를 FFmpeg 오픈소스를 사용해 rstp -> hls 변경 후 Nginx 로 배포 세팅',
      },
      {
        type: 'fixed',
        text: '펌웨어 장비 변경으로 기존 TCP Socket 통신 방법에서 HTTP 프로토콜로 변경',
      },
    ],
  },
  {
    version: 'v2025.04',
    date: 'Apr 2025',
    title: '양식업 DX 프로젝트 플랫폼 개발',
    bullets: [
      {
        type: 'added',
        text: 'AI 급이량, 성장률 예측 모델을 FastAPI 를 사용하여 서빙 API 제작',
      },
      {
        type: 'added',
        text: '수조 현 상황 데이터, 급이, 성장, 사료 재고 데이터를 관리하는 플랫폼 제작',
      },
      {
        type: 'fixed',
        text: '사내 신규 프로젝트에서 React SPA 구조의 한계를 개선하기 위해 React Router v7 프레임워크 도입',
      },
    ],
  },
  {
    version: 'v2024.07',
    date: 'July 2024',
    title: 'CI/CD 적용 사례',
    bullets: [
      {
        type: 'added',
        text: 'Jenkins 를 사용하여 CI/CD 환경을 구축, 배포 과정을 자동화 하여 수동 배포의 문제점을 해결',
      },
      {
        type: 'fixed',
        text: 'Java 빌드, Python 가상 환경을 위해 Docker를 사용하여 버전 문제 없이 빌드 환경 구축',
      },
      {
        type: 'changed',
        text: '기존 수동으로 진행하던 웹 서버 배포 프로세스를 자동화',
      },
    ],
  },
  {
    version: 'v2024.02',
    date: 'Feb 2024',
    title: '근골격계 작업자 안전 HSE R&D 개발',
    bullets: [
      {
        type: 'added',
        text: 'NVIDIA A100 GPU 를 사용하기 위해 우분투 리눅스 서버에 CUDA 세팅',
      },
      {
        type: 'added',
        text: 'IP 카메라 세팅 후 rtsp 프로토콜을 사용하여 실시간 모니터링 화면 제작',
      },
      {
        type: 'added',
        text: 'Detection 모델인 Yolov3를 사용하여 안전 장비 착용 여부 데이터셋을 학습',
      },
      {
        type: 'added',
        text: '실시간 작업자 감지 후 위험 장소에 접근하거나 자세 분석 모델을 통해 작업자에게 부담이 되는 자세를 발견하면 관리자에게 알림톡 발송 솔루션 제작',
      },
      {
        type: 'fixed',
        text: '기존 3D Human Pose Estimation 모델에 안전 장비 착용 여부를 확인하는 Detection 모델 추가',
      },
    ],
  },
  {
    version: 'v2023.06',
    date: 'June 2023',
    title: '유지 보수 업무 진행',
    bullets: [
      {
        type: 'added',
        text: '도시락 배송 웹 서비스 "요밀조밀"의 유지보수 및 기능 개선을 담당',
      },
      { type: 'fixed', text: '모바일 환경에서 결제 오류 발생 건을 해결' },
    ],
  },
  {
    version: 'v2023.04',
    date: 'Apr 2023',
    title: '웹 백엔드 개발자 경력 시작',
    bullets: [
      {
        type: 'added',
        text: '스마트 양식업 ICT 회사 글로비트 입사',
      },
      { type: 'changed', text: '대학생에서 직장인으로 변경' },
    ],
  },
  {
    version: 'v2020.01',
    date: 'Jan 2020',
    title: '처음 개발 공부 시작 Hello World!',
    bullets: [
      {
        type: 'added',
        text: '개발 도서를 구매하여 첫 개발 시작 Hello World!',
      },
    ],
  },
];
