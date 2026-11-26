# hello-robotics

> 로봇을 공부하기 위한 가장 처음 해야 하는 세팅 — 우분투 24.04 · 파이썬 가상환경 · ROS 2 Jazzy

`https://excelh11.github.io/hello-robotics/` — Jekyll 기반 GitHub Pages 블로그입니다.
(프로젝트 사이트이므로 `_config.yml`에 `baseurl: "/hello-robotics"`가 설정되어 있습니다.)

## 구조

```
_config.yml                 사이트 설정(제목, 시리즈 정보, permalink)
index.md                    홈(시리즈 목차 + 글 목록) — layout: home
404.html                    없는 페이지 안내
_layouts/default.html       공통 뼈대(head, 헤더, 푸터, 스크립트)
_layouts/home.html          홈 레이아웃
_layouts/post.html          글 레이아웃(시리즈 목차, 이전/다음 글)
assets/css/style.css        전체 스타일(화이트 톤, 반응형, 코드 블록 다크)
assets/js/main.js           코드 블록 언어 라벨 + Copy 버튼, 표 가로 스크롤
_posts/YYYY-MM-DD-slug.md   글 본문
```

## 글 추가하기

`_posts/2026-12-01-07-example.md` 처럼 파일을 만들고 맨 위에 front matter를 씁니다.

```yaml
---
title: "글 제목"
description: "목록에 보일 한 줄 요약"
date: 2026-12-01 09:07:00 +0900
series: robot-setup
order: 7
---
```

- `series` 값이 같고 `order`가 낮은 글부터 시리즈 목차와 이전/다음 글이 자동으로 이어집니다.
- 주소는 `permalink: /posts/:title/` 규칙을 따라 `/posts/07-example/` 이 됩니다.
- 제목(h1)은 레이아웃이 그리므로 본문은 `##`부터 시작합니다.

## 코드 블록

본문의 모든 ``` 펜스 블록은 자동으로

- 오른쪽 위에 **Copy** 버튼(클릭 시 `Copied!`, 클립보드 복사, 실패 시 `Ctrl+C` 안내)
- 왼쪽 위에 언어 라벨(`bash`, `text`, `python` …)
- 본문 흰 배경과 구분되는 다크 슬레이트 배경(`#1e293b`)과 구문 강조

가 붙습니다. 별도 마크업이나 플러그인은 필요 없습니다.

## 로컬에서 미리 보기

```bash
gem install bundler jekyll
bundle init && bundle add jekyll
bundle exec jekyll serve
```

또는 GitHub에 push하면 GitHub Pages가 자동으로 빌드합니다(`main` 브랜치 루트).
