# YTArchive 📹

유튜브 영상을 효율적으로 아카이빙하고 관리하는 웹 애플리케이션

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://yt-archive-pink.vercel.app/index.html)

## 🎯 프로젝트 소개

YTArchive는 유튜브 영상을 체계적으로 저장하고, 타임스탬프·메모·테마 분류를 통해 스마트하게 관리할 수 있는 서비스입니다. 커뮤니티 기능을 통해 다른 사용자들과 영상을 공유하고 소통할 수 있습니다.

🌐 **라이브 데모**: [https://yt-archive-pink.vercel.app/index.html](https://yt-archive-pink.vercel.app/index.html)

## ✨ 주요 기능

### 📌 영상 관리
- **영상 저장**: 유튜브 URL을 통해 영상 정보 자동 가져오기
- **타임스탬프**: 중요한 구간을 시간 태그로 저장하고 원클릭 이동
- **메모**: 영상별로 자유롭게 메모 작성 및 관리
- **테마 분류**: 사용자 정의 테마/카테고리로 영상을 체계적으로 분류

### 👥 커뮤니티
- 게시글 작성 및 공유
- 댓글을 통한 사용자 간 소통
- 공개 영상 탐색

### 🔐 사용자 관리
- 회원가입 및 로그인
- 로그인 시도 제한 (5회 실패 시 30분 잠금)
- 세션 관리 (자동 로그인 지원)
- 개인 대시보드 및 마이페이지

## 🛠️ 기술 스택

### Frontend
- HTML5, CSS3, JavaScript (Vanilla JS)
- Bootstrap 5.3.2
- Bootstrap Icons 1.11.3

### Data Storage
- LocalStorage (클라이언트 사이드 저장소)

### API
- YouTube oEmbed API (영상 메타데이터 가져오기)

### Deployment
- Vercel (정적 호스팅)

## 📁 프로젝트 구조

```
YTArchive/
├── index.html          # 메인 랜딩 페이지
├── login.html          # 로그인
├── register.html       # 회원가입
├── dashboard.html      # 사용자 대시보드
├── mypage.html         # 마이페이지
├── video.html          # 영상 상세보기
├── themes.html         # 테마 관리
├── community.html      # 커뮤니티 목록
├── post.html           # 게시글 상세
├── write.html          # 글 작성
├── css/
│   └── style.css      # 커스텀 스타일
└── js/
    ├── app.js         # 공통 유틸리티 (Toast, Confirm, YouTube 유틸)
    ├── auth.js        # 인증 로직
    └── storage.js     # LocalStorage 데이터 관리
```

## 🚀 시작하기

### 필수 요구사항
- 웹 브라우저 (Chrome, Firefox, Edge, Safari 등)
- 로컬 웹 서버 (선택사항)

### 온라인 데모

**바로 사용해보기**: [https://yt-archive-pink.vercel.app/index.html](https://yt-archive-pink.vercel.app/index.html)

별도 설치 없이 웹 브라우저에서 바로 이용할 수 있습니다.

### 로컬 설치 및 실행

1. **프로젝트 클론**
```bash
git clone <repository-url>
cd YTArchive
```

2. **프로젝트 실행**

방법 1: 브라우저에서 직접 열기
- `index.html` 파일을 브라우저로 직접 열기

방법 2: 로컬 서버 실행 (권장)
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000
```

3. **브라우저 접속**
```
http://localhost:8000
```

## 💡 사용 방법

### 1. 회원가입 및 로그인
1. 메인 페이지에서 "회원가입" 클릭
2. 이메일, 닉네임, 비밀번호(8자 이상) 입력
3. 로그인하여 대시보드 접속

### 2. 영상 저장
1. 대시보드에서 "영상 추가" 클릭
2. 유튜브 URL 입력
3. 테마 선택 또는 새로 생성
4. 공개/비공개 설정 후 저장

### 3. 타임스탬프 추가
1. 영상 상세 페이지 접속
2. 타임스탬프 섹션에서 시간과 라벨 입력
3. 저장된 타임스탬프 클릭 시 해당 위치로 이동

### 4. 메모 작성
1. 영상 상세 페이지에서 메모 섹션으로 이동
2. 자유롭게 메모 작성 및 수정

### 5. 커뮤니티 참여
1. 커뮤니티 페이지에서 게시글 탐색
2. 글 작성 또는 댓글로 소통

## 🗄️ 데이터 구조

모든 데이터는 LocalStorage에 저장됩니다:

- `yta_users`: 사용자 정보
- `yta_session`: 로그인 세션
- `yta_videos`: 저장된 영상
- `yta_memos`: 영상별 메모
- `yta_timestamps`: 타임스탬프
- `yta_themes`: 테마/카테고리
- `yta_posts`: 커뮤니티 게시글
- `yta_comments`: 댓글

## 🔒 보안 기능

- 비밀번호 SHA-256 해시 처리
- 로그인 시도 제한 (5회 실패 시 30분 계정 잠금)
- XSS 방지를 위한 HTML 이스케이프 처리
- 세션 만료 관리

## 🌟 주요 특징

- **완전한 클라이언트 사이드**: 별도 서버 없이 브라우저에서 동작
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **직관적인 UI**: Bootstrap 기반의 깔끔한 인터페이스
- **빠른 검색 및 필터링**: 테마별, 키워드별 영상 탐색

## 📝 라이선스

이 프로젝트는 개인 학습 목적으로 제작되었습니다.

## 🤝 기여

이슈 및 풀 리퀘스트는 언제나 환영합니다!

## 📧 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.

---

**YTArchive** - 유튜브를 더 스마트하게 아카이빙하세요 🎬
