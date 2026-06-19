# Google Sheets 연동

v0.1 신청 폼은 `POST /api/leads`로 제출되고, 서버 route handler가 `GOOGLE_SHEETS_WEBAPP_URL`로 다시 전달합니다.

## 1. 시트 준비

Google Sheets에서 첫 행에 아래 헤더를 추가합니다.

```text
receivedAt, name, contact, interestPackLabel, priceRange, items, concern, consent, recommendedPackLabel, diagnosisAnswers, source
```

## 2. Apps Script 코드

확장 프로그램 > Apps Script에서 아래 코드를 붙여 넣습니다.

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.receivedAt || new Date().toISOString(),
    data.name || "",
    data.contact || "",
    data.interestPackLabel || "",
    data.priceRange || "",
    Array.isArray(data.items) ? data.items.join(", ") : "",
    data.concern || "",
    data.consent === true ? "Y" : "N",
    data.recommendedPackLabel || "",
    JSON.stringify(data.diagnosisAnswers || {}),
    data.source || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. 배포

배포 > 새 배포 > 유형: 웹 앱을 선택합니다.

- 실행 계정: 나
- 액세스 권한: 모든 사용자

생성된 웹 앱 URL을 `.env.local` 또는 Amplify 환경변수에 넣습니다.

```text
GOOGLE_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/.../exec
```
