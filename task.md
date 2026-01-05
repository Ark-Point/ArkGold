# 🚀 Next.js 프로젝트 부트스트래핑 태스크 (Security-First)

최신 보안 취약점이 해결된 React 19(또는 최신 안정 버전) 및 Next.js 최신 버전을 사용하여 프로젝트를 초기화합니다.

## 📋 사전 확인 사항

* **Node.js**: v18.17.0 이상 (최신 LTS 권장)
* **Package Manager**: npm 또는 pnpm 권장

---

## 🛠 태스크 리스트

### 1. 프로젝트 초기화 및 최신 버전 설치

보안 이슈가 해결된 최신 패키지를 사용하여 프로젝트를 생성합니다. `create-next-app`의 최신 버전을 사용하여 의존성 문제를 방지합니다.

* [x] **명령어 실행**: 아래 명령어를 터미널에 입력하여 대화형 설정을 시작하거나, 플래그를 통해 즉시 생성합니다.
```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

```


* [x] **버전 확인**: `package.json`에서 아래 라이브러리가 최신 버전인지 확인합니다.
* `next`: ^15.x (또는 최신)
* `react`: ^19.x (또는 최신)
* `react-dom`: ^19.x



### 2. TypeScript 및 ESLint 상세 설정

엄격한 타입 체크와 코드 품질 관리를 위해 설정을 보강합니다.

* [x] **`tsconfig.json` 최적화**: `baseUrl` 및 `paths` 설정 확인.
* [x] **ESLint 보안 규칙 추가**: `eslint-plugin-security` 등 보안 관련 플러그인 설치 (선택 사항).
```bash
npm install -D eslint-plugin-security

```


* [x] **`.eslintrc.json` 업데이트**:
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:security/recommended"
  ]
}

```



### 3. Tailwind CSS 프로토타이핑 준비

빠른 UI 개발을 위해 기본 스타일링 구조를 잡습니다.

* [x] **`tailwind.config.ts` 확인**: `content` 경로에 `src/app` 및 `src/components`가 포함되어 있는지 확인합니다.
* [x] **Global CSS 정리**: `src/app/globals.css`에서 불필요한 기본 스타일을 제거하고 Tailwind 디렉티브만 남깁니다.

### 4. 보안 및 환경 설정

* [x] **`.env.local` 생성**: 환경 변수 관리 파일 생성.
* [x] **의존성 보안 취약점 점검**:
```bash
npm audit

```


*보안 취약점이 발견될 경우 `npm audit fix`를 통해 즉시 해결합니다.*

### 5. 랜딩 페이지 Hero 섹션 구현 [NEW]

Figma 디자인을 기반으로 Hero 섹션을 구현합니다.

* [x] **글꼴 설정**: Serif (제목용) 및 Sans (본문용) 폰트 구성 (예: Playfair Display / Geist).
* [x] **컴포넌트 구조 잡기**:
    * `Header` (Logo)
    * `Hero` (Main Content)
* [x] **스타일링**: Tailwind CSS를 사용하여 다크 모드 기반 디자인 적용 (Gold 포인트 컬러 추가).
* [x] **에셋 통합**: 코인 이미지 플레이스홀더 적용 및 배치.

---

## 🏗 프로젝트 구조 (App Router)

```text
my-app/
├── src/
│   ├── app/                # App Router (Routing, Layouts)
│   │   ├── layout.tsx      # Root Layout
│   │   └── page.tsx        # Home Page
│   ├── components/         # Shared Components
│   └── lib/                # Utility Functions
├── public/                 # Static Assets
├── tailwind.config.ts      # Tailwind Configuration
├── tsconfig.json           # TypeScript Configuration
└── next.config.ts          # Next.js Configuration

```

---

## 💡 주요 참고 사항

* **React 보안**: 최근 보고된 CSRF 또는 XSS 관련 취약점은 최신 Next.js의 Server Components와 Server Actions를 사용함으로써 많은 부분 프레임워크 수준에서 방어가 가능합니다.
* **App Router**: `src/app` 디렉토리를 사용하여 보다 직관적인 라우팅과 서버 중심의 최적화를 유지합니다.
