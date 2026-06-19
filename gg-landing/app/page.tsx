"use client";

import { FormEvent, useMemo, useState } from "react";

type PackId = "bathroom" | "cleaning" | "undecided";
type DiagnosisKey =
  | "home"
  | "reduceTarget"
  | "blocker"
  | "changeItem"
  | "buyingStyle";

type FormState = {
  name: string;
  contact: string;
  interestPack: PackId;
  priceRange: string;
  items: string[];
  concern: string;
  consent: boolean;
};

const packLabels: Record<PackId, string> = {
  bathroom: "욕실 스타터팩",
  cleaning: "청소 스타터팩",
  undecided: "아직 잘 모르겠어요",
};

const diagnosisQuestions: {
  key: DiagnosisKey;
  title: string;
  options: { label: string; value: string }[];
}[] = [
  {
    key: "home",
    title: "지금 거주 형태는?",
    options: [
      { label: "자취", value: "alone" },
      { label: "기숙사", value: "dorm" },
      { label: "가족과 거주", value: "family" },
    ],
  },
  {
    key: "reduceTarget",
    title: "가장 먼저 줄이고 싶은 것은?",
    options: [
      { label: "플라스틱 욕실용품", value: "bathroom" },
      { label: "청소용품 쓰레기", value: "cleaning" },
      { label: "충동구매", value: "minimal" },
      { label: "배달/포장 쓰레기", value: "packaging" },
    ],
  },
  {
    key: "blocker",
    title: "제로웨이스트를 못 시작한 가장 큰 이유는?",
    options: [
      { label: "귀찮아서", value: "hassle" },
      { label: "어디서 시작할지 몰라서", value: "unknown" },
      { label: "가격이 부담돼서", value: "price" },
      { label: "효과가 있을지 몰라서", value: "trust" },
    ],
  },
  {
    key: "changeItem",
    title: "지금 가장 바꾸고 싶은 물건은?",
    options: [
      { label: "칫솔", value: "toothbrush" },
      { label: "샴푸/바디워시", value: "shampoo" },
      { label: "세제/수세미", value: "detergent" },
      { label: "잘 모르겠음", value: "unknown" },
    ],
  },
  {
    key: "buyingStyle",
    title: "구매 방식은 어떤 쪽이 편한가요?",
    options: [
      { label: "추천받고 바로 신청", value: "direct" },
      { label: "상담 후 결정", value: "consult" },
      { label: "더 알아보고 결정", value: "learn" },
    ],
  },
];

const itemOptions = [
  "칫솔",
  "샴푸/바디워시",
  "치약",
  "세제",
  "수세미",
  "행주/청소용품",
  "아직 잘 모르겠음",
];

const starterPacks = [
  {
    id: "bathroom" as const,
    name: "욕실 스타터팩",
    score: "8.0",
    price: "가격 준비 중",
    items: ["대나무 칫솔", "샴푸바", "고체치약 또는 친환경 치약"],
    bestFor: "제로웨이스트를 욕실 소모품부터 시작하고 싶은 자취생",
  },
  {
    id: "cleaning" as const,
    name: "청소 스타터팩",
    score: "7.5",
    price: "가격 준비 중",
    items: ["리필형 세제", "천연 수세미", "다회용 행주"],
    bestFor: "청소할 때 나오는 플라스틱과 일회용품을 줄이고 싶은 사람",
  },
];

const initialAnswers: Record<DiagnosisKey, string> = {
  home: "",
  reduceTarget: "",
  blocker: "",
  changeItem: "",
  buyingStyle: "",
};

const initialForm: FormState = {
  name: "",
  contact: "",
  interestPack: "bathroom",
  priceRange: "",
  items: [],
  concern: "",
  consent: false,
};

function recommendPack(answers: Record<DiagnosisKey, string>): PackId {
  if (answers.reduceTarget === "cleaning" || answers.changeItem === "detergent") {
    return "cleaning";
  }

  if (answers.reduceTarget === "bathroom") {
    return "bathroom";
  }

  return "bathroom";
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function track(eventName: string, params?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const analytics = (
    window as Window & {
      gtag?: (type: string, event: string, params?: Record<string, string>) => void;
    }
  ).gtag;

  analytics?.("event", eventName, params);
}

export default function Home() {
  const [answers, setAnswers] =
    useState<Record<DiagnosisKey, string>>(initialAnswers);
  const [completed, setCompleted] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "saved-local" | "error"
  >("idle");

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const recommendedPack = useMemo(() => recommendPack(answers), [answers]);
  const recommendedPackDetail =
    starterPacks.find((pack) => pack.id === recommendedPack) ?? starterPacks[0];

  const canCompleteDiagnosis = answeredCount === diagnosisQuestions.length;

  const updateAnswer = (key: DiagnosisKey, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));

    if (answeredCount === 0) {
      track("diagnosis_start");
    }
  };

  const completeDiagnosis = () => {
    setCompleted(true);
    setForm((current) => ({
      ...current,
      interestPack: recommendedPack,
    }));
    track("diagnosis_complete", { recommended_pack: recommendedPack });
    setTimeout(() => scrollToId("result"), 50);
  };

  const openApplication = (pack: PackId = recommendedPack) => {
    setForm((current) => ({ ...current, interestPack: pack }));
    track("form_click", { pack });
    scrollToId("apply");
  };

  const toggleItem = (item: string) => {
    setForm((current) => {
      const exists = current.items.includes(item);
      return {
        ...current,
        items: exists
          ? current.items.filter((selected) => selected !== item)
          : [...current.items, item],
      };
    });
  };

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");

    const payload = {
      ...form,
      interestPackLabel: packLabels[form.interestPack],
      recommendedPack,
      recommendedPackLabel: packLabels[recommendedPack],
      diagnosisAnswers: answers,
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 503) {
        localStorage.setItem(`gg-lead-${Date.now()}`, JSON.stringify(payload));
        setSubmitState("saved-local");
        return;
      }

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      track("form_submit", { pack: form.interestPack });
      setSubmitState("success");
      setForm(initialForm);
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#1F2933]">
      <section className="border-b border-[#DCE6DC] bg-[#FAFAF7]">
        <div className="mx-auto grid min-h-[92vh] max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold text-[#2F6B4F]">
              GG 자취 제로웨이스트 진단
            </p>
            <h1 className="text-4xl font-bold leading-tight text-[#17211C] sm:text-5xl lg:text-6xl">
              자취방 제로웨이스트, 검색 없이 시작하세요.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#4E5F58]">
              몇 가지 질문에 답하면 지금 생활에서 가장 쉽게 바꿀 수 있는
              제품과 스타터팩을 추천해드립니다. 완벽한 환경운동이 아니라, 덜
              사고 오래 쓰는 생활을 시작합니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                className="h-12 rounded-lg bg-[#2F6B4F] px-6 text-base font-semibold text-white shadow-sm transition hover:bg-[#25563F]"
                onClick={() => scrollToId("diagnosis")}
                type="button"
              >
                GG 자취 진단하기
              </button>
              <button
                className="h-12 rounded-lg border border-[#9AB7A0] px-6 text-base font-semibold text-[#2F6B4F] transition hover:bg-[#E8EFE7]"
                onClick={() => scrollToId("packs")}
                type="button"
              >
                스타터팩 먼저 보기
              </button>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-[#DCE6DC] bg-[#E8EFE7] p-6 shadow-sm">
            <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-[#A7D96C]" />
            <div className="absolute right-8 top-12 h-28 w-20 rounded-lg bg-[#8AB6C8]" />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#2F6B4F]" />
            <div className="relative z-10 mt-16 grid grid-cols-[0.75fr_1fr] items-end gap-5">
              <div className="h-56 rounded-t-full border border-[#B8C9BA] bg-[#FBFBF8] shadow-sm" />
              <div className="space-y-4">
                <div className="h-40 rounded-lg border border-[#CBD8CB] bg-white p-4 shadow-sm">
                  <div className="h-full rounded-md bg-[#F4A261]" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-28 rounded-lg bg-[#FBFBF8] shadow-sm" />
                  <div className="h-28 rounded-lg bg-[#A7D96C] shadow-sm" />
                  <div className="h-28 rounded-lg bg-[#FBFBF8] shadow-sm" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 z-10 rounded-lg bg-white/90 p-4 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-[#2F6B4F]">
                추천 흐름
              </p>
              <p className="mt-1 text-base font-semibold">
                생활 진단 후 욕실 또는 청소 스타터팩을 제안합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-[#17211C]">
              친환경을 시작하기 어려운 이유는 의지가 부족해서가 아닙니다.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#52635C]">
              무엇을 사야 할지, 정말 괜찮은 제품인지, 계속 쓸 수 있을지
              판단하기 어렵기 때문입니다.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["무엇부터 바꿔야 할지 모른다", "칫솔, 샴푸, 세제까지 따로 찾다 보면 시작 전에 지칩니다."],
              ["진짜 친환경인지 판단하기 어렵다", "GG Score로 플라스틱 절감, 재사용, 가격 접근성을 함께 봅니다."],
              ["하나씩 찾아 사는 과정이 귀찮다", "처음 바꾸기 쉬운 것부터 묶어서 제안합니다."],
            ].map(([title, description]) => (
              <article
                className="rounded-lg border border-[#DCE6DC] bg-[#FAFAF7] p-6"
                key={title}
              >
                <h3 className="text-xl font-semibold text-[#17211C]">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-[#52635C]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E8EFE7] py-16" id="diagnosis">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-[#2F6B4F]">
                1분 진단
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#17211C]">
                지금 생활에서 가장 쉬운 첫 변화를 찾아보세요.
              </h2>
            </div>
            <p className="text-sm font-semibold text-[#2F6B4F]">
              {answeredCount} / {diagnosisQuestions.length}
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {diagnosisQuestions.map((question) => (
              <fieldset
                className="rounded-lg border border-[#CEDDCE] bg-white p-5 shadow-sm"
                key={question.key}
              >
                <legend className="mb-4 text-base font-semibold text-[#17211C]">
                  {question.title}
                </legend>
                <div className="space-y-2">
                  {question.options.map((option) => {
                    const selected = answers[question.key] === option.value;
                    return (
                      <button
                        className={`min-h-11 w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                          selected
                            ? "border-[#2F6B4F] bg-[#2F6B4F] text-white"
                            : "border-[#DCE6DC] bg-white text-[#405149] hover:bg-[#F4F8F0]"
                        }`}
                        key={option.value}
                        onClick={() => updateAnswer(question.key, option.value)}
                        type="button"
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              className="h-12 rounded-lg bg-[#2F6B4F] px-7 text-base font-semibold text-white transition enabled:hover:bg-[#25563F] disabled:cursor-not-allowed disabled:bg-[#9CB5A6]"
              disabled={!canCompleteDiagnosis}
              onClick={completeDiagnosis}
              type="button"
            >
              추천 결과 보기
            </button>
          </div>
        </div>
      </section>

      {completed ? (
        <section className="bg-white py-16" id="result">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold text-[#2F6B4F]">
                추천 결과
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#17211C]">
                {recommendedPackDetail.name}
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#52635C]">
                지금은 매일 쓰는 소모품부터 바꾸는 것이 가장 쉽습니다.
                반복 구매하는 제품을 먼저 바꾸면 부담 없이 제로웨이스트를
                시작할 수 있습니다.
              </p>
              <button
                className="mt-6 h-12 rounded-lg bg-[#2F6B4F] px-6 text-base font-semibold text-white transition hover:bg-[#25563F]"
                onClick={() => openApplication(recommendedPack)}
                type="button"
              >
                추천 스타터팩 신청하기
              </button>
            </div>
            <article className="rounded-lg border border-[#DCE6DC] bg-[#FAFAF7] p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <h3 className="text-2xl font-bold text-[#17211C]">
                    {recommendedPackDetail.name}
                  </h3>
                  <p className="mt-2 font-semibold text-[#F4A261]">
                    {recommendedPackDetail.price}
                  </p>
                </div>
                <div className="rounded-lg bg-[#E8EFE7] px-4 py-3 text-center">
                  <p className="text-sm font-semibold text-[#2F6B4F]">
                    GG Score
                  </p>
                  <p className="text-2xl font-bold">
                    {recommendedPackDetail.score} / 10
                  </p>
                </div>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {recommendedPackDetail.items.map((item) => (
                  <li
                    className="rounded-lg border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-semibold"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      ) : null}

      <section className="bg-[#FAFAF7] py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold text-[#2F6B4F]">
                GG Score
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#17211C]">
                완벽한 탄소 계산보다, 시작 가능한 선택 기준입니다.
              </h2>
              <p className="mt-4 leading-8 text-[#52635C]">
                GG Score는 처음 시작하는 사람이 더 나은 선택을 할 수 있도록
                만든 10점 기준입니다. 플라스틱 절감, 재사용 가능성, 포장,
                내구성, 가격 접근성을 함께 봅니다.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["플라스틱 절감", "0~3"],
                ["리필/재사용 가능성", "0~2"],
                ["배송/패키징 절감", "0~2"],
                ["내구성", "0~1"],
                ["가격 접근성", "0~2"],
              ].map(([label, score]) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-[#DCE6DC] bg-white px-5 py-4"
                  key={label}
                >
                  <span className="font-semibold">{label}</span>
                  <span className="font-bold text-[#2F6B4F]">{score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16" id="packs">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#2F6B4F]">스타터팩</p>
            <h2 className="mt-2 text-3xl font-bold text-[#17211C]">
              처음 바꾸기 쉬운 생활용품부터 묶었습니다.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {starterPacks.map((pack) => (
              <article
                className="rounded-lg border border-[#DCE6DC] bg-[#FAFAF7] p-6"
                key={pack.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#17211C]">
                      {pack.name}
                    </h3>
                    <p className="mt-2 font-semibold text-[#F4A261]">
                      {pack.price}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2 text-right">
                    <p className="text-xs font-semibold text-[#2F6B4F]">
                      GG Score
                    </p>
                    <p className="font-bold">{pack.score} / 10</p>
                  </div>
                </div>
                <p className="mt-5 leading-7 text-[#52635C]">{pack.bestFor}</p>
                <ul className="mt-5 space-y-2">
                  {pack.items.map((item) => (
                    <li
                      className="rounded-lg border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-semibold"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-6 h-11 w-full rounded-lg bg-[#2F6B4F] px-5 text-sm font-semibold text-white transition hover:bg-[#25563F]"
                  onClick={() => openApplication(pack.id)}
                  type="button"
                >
                  출시 알림 신청하기
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E8EFE7] py-16" id="apply">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold text-[#2F6B4F]">
              출시 전 신청
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#17211C]">
              내 생활에 맞는 스타터팩을 먼저 안내받으세요.
            </h2>
            <p className="mt-4 leading-8 text-[#52635C]">
              가격과 구성은 준비 중입니다. 신청자에게 먼저 구성, 예상 가격,
              상담 가능 여부를 안내드릴게요.
            </p>
          </div>

          <form
            className="rounded-lg border border-[#CEDDCE] bg-white p-6 shadow-sm"
            onSubmit={submitLead}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold">이름 또는 닉네임</span>
                <input
                  className="mt-2 h-11 w-full rounded-lg border border-[#C8D6C8] px-3 outline-none transition focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#A7D96C]"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                  value={form.name}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">연락 가능한 수단</span>
                <input
                  className="mt-2 h-11 w-full rounded-lg border border-[#C8D6C8] px-3 outline-none transition focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#A7D96C]"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      contact: event.target.value,
                    }))
                  }
                  placeholder="이메일, 카카오톡 ID, 전화번호 중 하나"
                  required
                  value={form.contact}
                />
              </label>
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">
                관심 있는 스타터팩
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {(Object.keys(packLabels) as PackId[]).map((pack) => (
                  <label
                    className={`flex min-h-11 cursor-pointer items-center rounded-lg border px-3 text-sm font-semibold ${
                      form.interestPack === pack
                        ? "border-[#2F6B4F] bg-[#E8EFE7]"
                        : "border-[#DCE6DC] bg-white"
                    }`}
                    key={pack}
                  >
                    <input
                      checked={form.interestPack === pack}
                      className="mr-2 accent-[#2F6B4F]"
                      name="interestPack"
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          interestPack: pack,
                        }))
                      }
                      type="radio"
                    />
                    {packLabels[pack]}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="mt-5 block">
              <span className="text-sm font-semibold">예상 구매 의향 가격대</span>
              <select
                className="mt-2 h-11 w-full rounded-lg border border-[#C8D6C8] bg-white px-3 outline-none transition focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#A7D96C]"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    priceRange: event.target.value,
                  }))
                }
                required
                value={form.priceRange}
              >
                <option value="">선택해주세요</option>
                <option>1만원 이하</option>
                <option>1만~2만원</option>
                <option>2만~3만원</option>
                <option>3만원 이상도 괜찮음</option>
                <option>가격을 보고 결정</option>
              </select>
            </label>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">
                가장 바꾸고 싶은 생활용품
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {itemOptions.map((item) => (
                  <label
                    className="flex min-h-11 cursor-pointer items-center rounded-lg border border-[#DCE6DC] px-3 text-sm font-medium"
                    key={item}
                  >
                    <input
                      checked={form.items.includes(item)}
                      className="mr-2 accent-[#2F6B4F]"
                      onChange={() => toggleItem(item)}
                      type="checkbox"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="mt-5 block">
              <span className="text-sm font-semibold">구매 전 걱정되는 점</span>
              <textarea
                className="mt-2 min-h-28 w-full rounded-lg border border-[#C8D6C8] px-3 py-3 outline-none transition focus:border-[#2F6B4F] focus:ring-2 focus:ring-[#A7D96C]"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    concern: event.target.value,
                  }))
                }
                placeholder="가격, 사용감, 배송, 진짜 친환경인지 등"
                value={form.concern}
              />
            </label>

            <label className="mt-5 flex items-start gap-3 rounded-lg bg-[#FAFAF7] p-4 text-sm">
              <input
                checked={form.consent}
                className="mt-1 accent-[#2F6B4F]"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    consent: event.target.checked,
                  }))
                }
                required
                type="checkbox"
              />
              <span>
                출시 및 상담 안내를 받는 데 동의합니다. 입력한 연락처는 GG
                스타터팩 안내 용도로만 사용합니다.
              </span>
            </label>

            <button
              className="mt-6 h-12 w-full rounded-lg bg-[#2F6B4F] px-5 text-base font-semibold text-white transition enabled:hover:bg-[#25563F] disabled:cursor-not-allowed disabled:bg-[#9CB5A6]"
              disabled={submitState === "submitting"}
              type="submit"
            >
              {submitState === "submitting"
                ? "신청 중"
                : "내 생활에 맞는 스타터팩 신청하기"}
            </button>

            {submitState === "success" ? (
              <p className="mt-4 rounded-lg bg-[#E8EFE7] p-4 text-sm font-semibold text-[#2F6B4F]">
                신청이 접수되었습니다. 준비되는 대로 먼저 안내드릴게요.
              </p>
            ) : null}
            {submitState === "saved-local" ? (
              <p className="mt-4 rounded-lg bg-[#FFF5E8] p-4 text-sm font-semibold text-[#8A4F12]">
                Google Sheets 연동 URL이 아직 없어 브라우저에 임시 저장했습니다.
                연동 후 다시 제출하면 됩니다.
              </p>
            ) : null}
            {submitState === "error" ? (
              <p className="mt-4 rounded-lg bg-[#FBEAEA] p-4 text-sm font-semibold text-[#9C2E2E]">
                신청 저장 중 문제가 생겼습니다. 잠시 후 다시 시도해주세요.
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-3xl font-bold text-[#17211C]">FAQ</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["배송은 어떻게 진행되나요?", "v0.1에서는 신청자에게 구성과 배송 가능 일정을 먼저 안내합니다."],
              ["진짜 친환경 제품인가요?", "완벽한 제로웨이스트보다 시작 가능한 전환을 먼저 봅니다."],
              ["가격이 일반 제품보다 비싼가요?", "가격, 사용성, 포장 방식을 함께 고려해 처음 쓰기 부담 없는 제품을 고릅니다."],
              ["아직 구매가 고민되면 어떻게 하나요?", "신청 폼에 걱정되는 점을 남겨주시면 상담 안내에 반영합니다."],
            ].map(([question, answer]) => (
              <article
                className="rounded-lg border border-[#DCE6DC] bg-[#FAFAF7] p-5"
                key={question}
              >
                <h3 className="font-semibold text-[#17211C]">{question}</h3>
                <p className="mt-2 leading-7 text-[#52635C]">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
