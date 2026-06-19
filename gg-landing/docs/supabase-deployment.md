# Supabase 배포 설정

신청 폼은 `POST /api/leads`로 제출되고, 서버 route handler가 Supabase `leads` 테이블에 저장합니다.

## 필요한 환경변수

로컬 `.env.local`과 Amplify 환경변수에 아래 값을 넣습니다.

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_or_service_role_key
```

`SUPABASE_SECRET_KEY`는 서버 전용입니다. `NEXT_PUBLIC_`을 붙이지 않습니다.

## Amplify 설정 위치

Amplify Console에서 앱을 열고:

```text
App settings > Environment variables
```

아래 값을 추가합니다.

```text
AMPLIFY_MONOREPO_APP_ROOT=gg-landing
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
```

환경변수를 추가하거나 수정한 뒤에는 `main` 브랜치를 다시 배포합니다.

## 정상 동작 확인

1. Amplify 배포 URL 접속
2. 진단 완료
3. 신청 폼 제출
4. Supabase Dashboard > Table Editor > `leads`에서 새 row 확인

## 오류별 확인

폼 제출 후 `Supabase 환경변수가 아직 배포 환경에 없어...`가 보이면 Amplify에 `SUPABASE_URL` 또는 `SUPABASE_SECRET_KEY`가 없거나 재배포가 안 된 상태입니다.

`신청 저장 중 문제가 생겼습니다`가 보이면 Supabase key 권한, RLS, 테이블명, 컬럼명을 확인합니다.
