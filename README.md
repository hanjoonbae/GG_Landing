# GG 랜딩 페이지 제작 매뉴얼

작성일: 2026-06-19

참고 문서:

- [[지구를 지켜라!]]
- [[GG 린 캔버스]]
- [[GG 설계 계획]]
- [[GG deep-research-report]]
- [[GG menifesto]]
- [[GG 고객 수요 설문]]
- [[GG 구글폼 내용]]
- [[GG 홍보 게시글]]
- [[GG 인터뷰 질문]]

---

# 0. 결론부터: AWS Amplify를 100달러 크레딧으로 한 달 쓸 수 있나?

결론: **GG 랜딩페이지 MVP 수준이면 100달러 크레딧으로 한 달은 충분히 가능성이 높다.**  
단, “정적 랜딩페이지 + 간단한 폼/외부 결제 링크” 기준이다. 로그인, DB, Lambda, 이미지 대용량 전송, 광고성 대량 트래픽까지 붙이면 비용 구조가 달라진다.

AWS 공식 가격 기준으로 Amplify Hosting은 Free Tier 사용 시 다음 한도가 있다.

- 빌드: 월 1,000 build minutes까지 무료
- CDN 저장: 월 5GB까지 무료
- 데이터 전송: 월 15GB까지 무료
- SSR 요청: 월 500,000 requests까지 무료
- SSR 실행 시간: 월 100 GB-hours까지 무료

Free Tier 밖에서는 대략 다음 비용이 붙는다.

- Standard build: $0.01/min
- CDN 저장: $0.023/GB-month
- 데이터 전송: $0.15/GB served
- SSR 요청: $0.30/1M requests
- SSR duration: $0.20/GB-hour

AWS 공식 예시에서도 300 DAU, 개발자 5명, 월 600분 빌드, 월 13.18GB 전송 규모의 앱이 Free Tier 밖 기준 약 **$8.08/month**로 계산된다. 10,000 DAU, 월 2회 업데이트, 월 439.45GB 전송 규모는 약 **$65.98/month** 예시가 있다. GG 초기 목표가 “방문자 100명, 상담 10명, 결제 1건”이면 한 달 운영비는 보통 이보다 훨씬 낮다.

AWS Free Tier도 2026년 기준 신규 고객에게 가입 즉시 $100 크레딧을 제공하고, 조건을 충족하면 최대 $200까지 받을 수 있다고 안내한다. Amplify 가격 페이지에도 신규 고객 Free Tier credits를 Amplify 같은 eligible service에 적용할 수 있다고 되어 있다.

주의할 점:

- 도메인 구매비는 별도 예산으로 잡는다. `.com`, `.kr` 등 도메인은 보통 연 단위 결제다.
- WAF는 붙이지 않는다. Amplify 가격표상 WAF는 앱당 월 $15 + 별도 WAF 비용이 든다.
- 첫 MVP는 DB/Lambda 없이 만든다. 구매 신청은 Google Form, 카카오 오픈채팅, 토스 결제 링크, 스마트스토어 링크 중 하나로 넘긴다.
- AWS Billing Budget을 반드시 만든다. 예산 알림은 $5, $20, $50 기준으로 설정한다.

공식 출처:

- AWS Amplify Pricing: https://aws.amazon.com/amplify/pricing/
- AWS Free Tier: https://aws.amazon.com/free/
- Next.js app to Amplify Hosting: https://docs.aws.amazon.com/amplify/latest/userguide/getting-started-next.html
- Next.js SSR app to Amplify: https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html

---

# 1. 이번 랜딩페이지의 목표

GG의 30일 목표는 “멋진 서비스 완성”이 아니라 **첫 구매 의사 검증**이다.

성공 기준:

- 랜딩페이지 방문자 100명 이상
- 진단/상담/구매 CTA 클릭 10명 이상
- 실제 결제 또는 결제 직전 상담 1건 이상

랜딩페이지에서 검증할 질문:

- 자취생/사회초년생이 “제로웨이스트를 시작하고 싶지만 귀찮다”는 문제에 공감하는가?
- “GG 자취 진단 → 추천 스타터팩” 흐름이 그냥 상품 리스트보다 더 설득력 있는가?
- 욕실 스타터팩 또는 청소 스타터팩을 실제로 돈 내고 살 의향이 있는가?

이번 MVP에서 하지 않을 것:

- 회원가입
- 로그인
- 자체 결제 시스템
- 장바구니
- 복잡한 추천 알고리즘
- 정확한 탄소발자국 계산
- 관리자 페이지

---

# 2. 포지셔닝 정리

GG는 단순 친환경 쇼핑몰이 아니라 **제로웨이스트 전환 코치**로 잡는다.

핵심 문장:

> 지속가능함은 귀찮지 않아야 한다.

보조 문장:

> 검색 대신 시작하세요.

브랜드 톤:

- 친근함
- 솔직함
- 실용적
- 강요하지 않음
- 환경운동보다 생활 개선에 가까움

피해야 할 톤:

- 죄책감 주기
- “당신은 환경을 망치고 있다” 식의 공격적 문구
- 너무 NGO 같은 캠페인 말투
- 너무 어려운 탄소/ESG 용어

랜딩페이지의 한 줄 정의:

> GG는 자취생이 제로웨이스트를 가장 쉽게 시작하도록, 생활 진단과 스타터팩을 제공하는 서비스입니다.

---

# 3. 랜딩페이지 핵심 흐름

권장 전환 흐름:

```text
방문
↓
문제 공감
↓
GG 자취 진단 CTA
↓
3~5개 질문
↓
추천 스타터팩
↓
구매 신청 / 카톡 상담 / 결제 링크
```

바로 “상품 구매하기”보다 “진단해보기”가 먼저 나와야 한다. GG의 차별점이 상품 판매가 아니라 전환 코칭이기 때문이다.

---

# 4. 페이지 구조

## 4.1 Hero

목표: 3초 안에 무엇을 해주는 서비스인지 이해시킨다.

권장 문구:

```text
자취방 제로웨이스트,
검색 없이 시작하세요.
```

서브 문구:

```text
몇 가지 질문에 답하면 지금 생활에서 가장 쉽게 바꿀 수 있는 제품과 스타터팩을 추천해드립니다.
완벽한 환경운동이 아니라, 덜 사고 오래 쓰는 생활을 시작합니다.
```

CTA:

```text
GG 자취 진단하기
```

보조 CTA:

```text
스타터팩 먼저 보기
```

Hero에 넣을 시각 요소:

- 자취방 욕실/책상/청소용품 이미지
- 대나무 칫솔, 샴푸바, 리필 세제 같은 구체적 제품 사진
- 과한 숲/지구 이미지보다 실제 생활 이미지가 좋다.

## 4.2 문제 공감

제목:

```text
친환경을 시작하기 어려운 이유는 의지가 부족해서가 아닙니다.
```

카드 3개:

- 무엇부터 바꿔야 할지 모른다
- 진짜 친환경인지 판단하기 어렵다
- 하나씩 찾아 사는 과정이 귀찮다

문구 예시:

```text
칫솔, 샴푸, 세제, 수세미까지 따로 검색하다 보면 시작하기 전에 지칩니다.
GG는 처음 바꾸기 쉬운 것부터 묶어서 제안합니다.
```

## 4.3 GG 자취 진단

목표: 사용자가 참여하게 만든다.

진단 질문은 처음에는 프론트엔드 상태만으로 처리한다. 서버 저장은 하지 않아도 된다.

질문 예시:

1. 지금 거주 형태는?
   - 자취
   - 기숙사
   - 가족과 거주
2. 가장 먼저 줄이고 싶은 것은?
   - 플라스틱 욕실용품
   - 청소용품 쓰레기
   - 충동구매
   - 배달/포장 쓰레기
3. 제로웨이스트를 못 시작한 가장 큰 이유는?
   - 귀찮아서
   - 어디서 시작해야 할지 몰라서
   - 가격이 부담돼서
   - 효과가 있을지 모르겠어서
4. 지금 가장 바꾸고 싶은 물건은?
   - 칫솔
   - 샴푸/바디워시
   - 세제/수세미
   - 잘 모르겠음
5. 구매 방식 선호는?
   - 추천받고 바로 구매
   - 상담 후 구매
   - 더 알아보고 구매

결과 예시:

```text
추천 결과: 욕실 스타터팩

지금은 욕실에서 매일 쓰는 소모품부터 바꾸는 것이 가장 쉽습니다.
칫솔, 샴푸, 치약처럼 반복 구매하는 제품을 먼저 바꾸면 부담 없이 제로웨이스트를 시작할 수 있습니다.
```

## 4.4 GG Score 설명

목표: “왜 이 제품을 추천하는지” 신뢰를 만든다.

초기 GG Score는 정밀 계산이 아니라 간단한 선택 기준으로 운영한다.

점수 기준 v0.1:

| 기준 | 점수 |
|---|---:|
| 플라스틱 절감 | 0~3 |
| 리필/재사용 가능성 | 0~2 |
| 배송/패키징 절감 | 0~2 |
| 내구성 | 0~1 |
| 가격 접근성 | 0~2 |
| 합계 | 0~10 |

설명 문구:

```text
GG Score는 완벽한 탄소 계산이 아닙니다.
처음 시작하는 사람이 더 나은 선택을 할 수 있도록, 플라스틱 절감·재사용·패키징·가격을 함께 보는 간단한 기준입니다.
```

## 4.5 스타터팩 소개

초기에는 상품을 1~2개만 둔다.

1순위: 욕실 스타터팩

- 대나무 칫솔
- 샴푸바
- 고체치약 또는 친환경 치약

2순위: 청소 스타터팩

- 리필형 세제
- 천연 수세미
- 다회용 행주

상품 카드에 넣을 정보:

- 구성품
- 예상 가격
- GG Score
- 이런 사람에게 추천
- 일반 구매 대비 장점
- 구매/상담 CTA

가격 표기 예시:

```text
욕실 스타터팩
예상가: 19,900원
GG Score: 8.0 / 10
추천 대상: 제로웨이스트를 처음 시작하는 자취생
```

주의: 실제 판매 전에는 공급가, 배송비, 포장비, 결제 수수료를 계산한 뒤 가격을 확정한다.

## 4.6 FAQ

필수 질문:

- 배송은 어떻게 진행되나요?
- 진짜 친환경 제품인가요?
- 가격이 일반 제품보다 비싼가요?
- 아직 구매가 고민되면 어떻게 하나요?
- 정기구독도 가능한가요?

답변 톤 예시:

```text
GG는 완벽한 제로웨이스트보다 시작 가능한 전환을 먼저 봅니다.
가격, 사용성, 포장 방식을 함께 고려해 처음 쓰기 부담 없는 제품을 고릅니다.
```

## 4.7 마지막 CTA

페이지 하단에는 하나만 강하게 둔다.

```text
내 생활에 맞는 첫 제로웨이스트 제품을 찾아보세요.
```

버튼:

```text
GG 자취 진단하기
```

---

# 5. MVP 기능 범위

필수:

- 홈 랜딩페이지
- 진단 질문 UI
- 결과 카드
- 스타터팩 소개
- 구매 신청 또는 상담 CTA
- Google Analytics 설치
- 모바일 대응
- Amplify 배포

선택:

- 상품 상세 페이지
- 후기 섹션
- 이메일 수집
- 카카오 채널 연결
- 토스 결제 링크 연결

나중에:

- DynamoDB에 진단 결과 저장
- Lambda로 GG Score 계산
- 관리자 페이지
- 실제 주문 관리
- 정기배송

---

# 6. 기술 구조

처음에는 최대한 단순하게 간다.

```text
Next.js
↓
AWS Amplify Hosting
↓
외부 링크
- Google Form
- 카카오 오픈채팅
- 토스 결제 링크
- 스마트스토어
```

추천 방식:

- Next.js App Router 사용
- TypeScript 사용
- Tailwind CSS 사용
- 서버 기능 없이 정적/클라이언트 중심으로 구현
- 진단 결과는 React state로 계산

프로젝트 생성:

```bash
npx create-next-app@latest gg-landing
```

권장 선택:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
Turbopack: 선택
import alias: 기본값
```

로컬 실행:

```bash
cd gg-landing
npm run dev
```

빌드 확인:

```bash
npm run build
```

---

# 7. 파일 구조 예시

```text
gg-landing/
  src/
    app/
      page.tsx
      layout.tsx
      globals.css
    components/
      Hero.tsx
      ProblemSection.tsx
      Diagnosis.tsx
      ScoreSection.tsx
      StarterPackSection.tsx
      FAQ.tsx
      FinalCTA.tsx
    data/
      packs.ts
      questions.ts
```

처음에는 `page.tsx` 하나에 모두 만들어도 된다. 다만 수정하기 쉽게 하려면 섹션별 컴포넌트로 나누는 편이 좋다.

---

# 8. 진단 로직 v0.1

처음 추천 로직은 단순 규칙 기반으로 충분하다.

예시:

```ts
type PackType = "bathroom" | "cleaning" | "minimal";

function recommendPack(answers: Record<string, string>): PackType {
  if (answers.changeTarget === "bathroom") return "bathroom";
  if (answers.changeTarget === "cleaning") return "cleaning";
  if (answers.reason === "impulse") return "minimal";
  return "bathroom";
}
```

점수 표시도 하드코딩으로 시작한다.

```ts
const packs = {
  bathroom: {
    name: "욕실 스타터팩",
    score: 8,
    price: "19,900원",
    items: ["대나무 칫솔", "샴푸바", "고체치약"],
  },
};
```

중요한 것은 정확한 추천 알고리즘이 아니라 CTA 클릭률을 보는 것이다.

---

# 9. 디자인 가이드

방향:

- “친환경 캠페인”보다 “깔끔한 자취 생활 도구”
- 초록색만 쓰는 단조로운 팔레트는 피한다.
- 흰색/차콜/그린 포인트/옅은 블루 또는 라임 정도로 제한한다.
- 실제 제품 이미지가 중요하다.

권장 색상:

```text
background: #FAFAF7
text: #1F2933
primary: #2F6B4F
accent: #A7D96C
subtle: #E8EFE7
warning/price: #F4A261
```

섹션 순서:

1. Hero
2. 문제 공감
3. 진단
4. 추천 결과
5. GG Score
6. 스타터팩
7. FAQ
8. CTA

모바일 기준:

- 버튼 높이 최소 44px
- CTA는 한 화면에 하나만 명확하게
- 카드 2열보다 1열 우선
- 긴 설명보다 짧은 문장과 제품 이미지 우선

---

# 10. 전환 CTA 설계

초기 CTA는 3개 중 하나로 시작한다.

## 선택지 A: Google Form 신청

가장 쉽다.

사용처:

- 실제 제품 준비 전
- 수요 검증
- 연락처 수집

버튼 문구:

```text
스타터팩 알림 신청하기
```

## 선택지 B: 카카오 오픈채팅 상담

초기 판매에 좋다.

사용처:

- 구매 전 질문이 많을 때
- 직접 설득이 필요할 때

버튼 문구:

```text
카톡으로 추천받기
```

## 선택지 C: 토스 결제 링크 / 스마트스토어

실제 판매 준비 후 사용한다.

버튼 문구:

```text
욕실 스타터팩 구매하기
```

추천 순서:

```text
Day 1~14: Google Form 또는 카카오 상담
Day 15~21: 결제 링크 테스트
Day 22~30: 실제 결제 CTA 노출
```

---

# 11. Google Analytics 설치

목표:

- 방문자 수
- 진단 시작 클릭
- 진단 완료
- 구매/상담 CTA 클릭

추적 이벤트:

```text
diagnosis_start
diagnosis_complete
pack_view
purchase_click
consult_click
form_click
```

GA4 설치 후 `NEXT_PUBLIC_GA_ID` 환경변수로 관리한다.

Amplify 환경변수:

```text
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FORM_URL=https://forms.gle/...
NEXT_PUBLIC_CHAT_URL=https://...
NEXT_PUBLIC_PAYMENT_URL=https://...
```

---

# 12. GitHub 준비

Amplify는 Git 저장소와 연결하는 방식이 가장 편하다.

순서:

```bash
git init
git add .
git commit -m "Initial GG landing page"
git branch -M main
git remote add origin <GitHub repo URL>
git push -u origin main
```

주의:

- `.env.local`은 커밋하지 않는다.
- 공개 가능한 값만 Amplify 환경변수에 넣는다.
- 비밀키가 필요해지는 순간부터는 서버/API 설계를 다시 한다.

---

# 13. AWS Amplify 배포 순서

AWS 공식 문서 기준 Next.js 앱 배포 흐름은 다음과 같다.

1. AWS Console에서 Amplify로 이동
2. Create new app 또는 Deploy an app 선택
3. GitHub/GitLab/Bitbucket/CodeCommit 중 저장소 제공자 선택
4. `gg-landing` 저장소와 `main` 브랜치 선택
5. Build settings 확인
6. Service role 생성 또는 기존 role 선택
7. Save and deploy
8. 배포 완료 후 `amplifyapp.com` 기본 도메인 접속 확인

Next.js 기본 빌드 스크립트:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

Amplify build setting 예시:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

Amplify가 자동 감지하면 직접 만들지 않아도 되지만, 빌드가 꼬이면 `amplify.yml`을 루트에 추가한다.

---

# 14. 비용 방어 체크리스트

배포 직후 반드시 한다.

- AWS Billing Budget 생성
- $5, $20, $50 알림 설정
- WAF 비활성화
- 불필요한 backend resource 생성 금지
- S3 버킷을 따로 만들 경우 public 설정 확인
- CloudWatch 로그 과도 생성 여부 확인
- 사용하지 않는 Amplify app/branch 삭제
- 테스트용 브랜치 자동 배포가 필요 없으면 끄기

MVP 비용을 낮추는 방법:

- SSR/API 없이 시작
- 이미지 용량 압축
- 동영상 직접 호스팅 금지
- 외부 결제 링크 사용
- DB 대신 Google Form 사용
- 빌드 횟수 줄이기

---

# 15. 14일 실행 계획

## Day 1: 메시지 확정

할 일:

- Hero 문구 확정
- CTA 문구 확정
- 욕실팩/청소팩 중 메인 상품 선택

결정안:

```text
메인 상품: 욕실 스타터팩
메인 CTA: GG 자취 진단하기
보조 CTA: 카톡으로 추천받기
```

## Day 2: 와이어프레임

섹션을 종이에 먼저 그린다.

필수 섹션:

- Hero
- 문제 3개
- 진단
- 추천 결과
- 스타터팩
- FAQ
- CTA

## Day 3~5: Next.js 구현

할 일:

- 프로젝트 생성
- 섹션 컴포넌트 작성
- 진단 로직 작성
- CTA 링크 연결
- 모바일 화면 확인

## Day 6: 콘텐츠 보강

할 일:

- GG Score 표 작성
- FAQ 작성
- 상품 설명 작성
- 제품 이미지 준비

이미지가 없으면 직접 촬영하거나 임시 이미지를 쓰되, 실제 판매 전에는 반드시 교체한다.

## Day 7: GA 설치

할 일:

- GA4 속성 생성
- 이벤트 추적 연결
- 로컬에서 이벤트 호출 확인

## Day 8: GitHub 연결

할 일:

- GitHub repo 생성
- main branch push
- README에 배포/환경변수 메모

## Day 9: Amplify 배포

할 일:

- Amplify 앱 생성
- GitHub 연결
- 환경변수 입력
- 첫 배포 확인

## Day 10: 비용 안전장치

할 일:

- Billing Budget 설정
- Free Tier/credit 잔액 확인
- 사용하지 않는 리소스 없는지 확인

## Day 11~12: 사용자 테스트

할 일:

- 지인 5명에게 링크 공유
- 모바일에서 진단 완료 가능한지 확인
- 이해 안 되는 문구 수집

질문:

- 이 페이지가 뭘 해주는지 5초 안에 이해되는가?
- 어떤 버튼을 눌러야 할지 명확한가?
- 구매 전 가장 걸리는 점은 무엇인가?

## Day 13: 수정

할 일:

- Hero 문구 수정
- CTA 위치 조정
- FAQ 보강
- 모바일 깨짐 수정

## Day 14: 베타 오픈

할 일:

- 에브리타임/인스타/쓰레드/당근/디스콰이엇에 공유
- 방문자, 진단 완료, CTA 클릭을 매일 기록

---

# 16. 공개 후 매일 볼 지표

스프레드시트로 관리한다.

| 날짜 | 방문자 | 진단 시작 | 진단 완료 | CTA 클릭 | 상담 | 결제 | 메모 |
|---|---:|---:|---:|---:|---:|---:|---|
| Day 1 |  |  |  |  |  |  |  |

판단 기준:

- 방문자는 있는데 진단 시작이 낮다: Hero/CTA 문제
- 진단 시작은 있는데 완료가 낮다: 질문이 많거나 UI가 불편함
- 진단 완료는 있는데 CTA가 낮다: 추천 결과/상품 매력 부족
- CTA는 있는데 상담/결제가 낮다: 가격, 신뢰, 배송 정보 부족

---

# 17. 첫 버전 카피 모음

Hero:

```text
자취방 제로웨이스트, 검색 없이 시작하세요.
```

Sub:

```text
몇 가지 질문에 답하면 지금 생활에서 가장 쉽게 바꿀 수 있는 제품과 스타터팩을 추천해드립니다.
```

Problem:

```text
친환경을 시작하기 어려운 이유는 의지가 부족해서가 아닙니다.
무엇을 사야 할지, 정말 괜찮은 제품인지, 계속 쓸 수 있을지 판단하기 어렵기 때문입니다.
```

GG Score:

```text
GG Score는 처음 시작하는 사람이 더 나은 선택을 할 수 있도록 만든 10점 기준입니다.
플라스틱 절감, 재사용 가능성, 포장, 내구성, 가격 접근성을 함께 봅니다.
```

Starter Pack:

```text
욕실 스타터팩은 매일 쓰는 소모품부터 바꾸고 싶은 사람을 위한 첫 패키지입니다.
칫솔, 샴푸, 치약처럼 반복 구매하는 제품부터 바꾸면 제로웨이스트는 훨씬 쉬워집니다.
```

FAQ:

```text
GG는 완벽한 제로웨이스트를 강요하지 않습니다.
오늘보다 조금 덜 버리고, 조금 오래 쓰는 선택을 쉽게 만드는 것이 목표입니다.
```

Final CTA:

```text
내 생활에서 가장 쉬운 첫 변화를 찾아보세요.
```

---

# 18. 지금 바로 할 일

1. 욕실 스타터팩을 메인 상품으로 확정한다.
2. Google Form 또는 카카오 오픈채팅 CTA 링크를 준비한다.
3. `gg-landing` Next.js 프로젝트를 만든다.
4. 위 페이지 구조대로 첫 화면을 구현한다.
5. Amplify에 배포한다.
6. 100명 방문, 10명 상담/신청, 1명 결제를 목표로 홍보한다.

---

# 19. 나중에 확장할 AWS 기능

MVP 검증 후에만 붙인다.

## Lambda

용도:

- GG Score 계산 API
- 추천 로직 서버화

## DynamoDB

용도:

- 진단 결과 저장
- 상품 데이터 저장
- 신청자 상태 관리

## S3

용도:

- 제품 이미지 저장
- 콘텐츠 이미지 관리

## CloudWatch

용도:

- Lambda 오류 확인
- API 호출량 확인

지금은 학습 목적으로만 생각하고, 첫 랜딩페이지에는 넣지 않는다.
