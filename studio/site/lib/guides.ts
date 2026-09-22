// Реестр гайдов
export type Guide = {
  slug: string;        // папка в app/guides/<slug>/
  title: string;       // заголовок карточки
  excerpt: string;     // 1–2 предложения, зачем читать
  date: string;        // YYYY-MM-DD
  readMin: number;     // время чтения, минут
  tag: string;         // короткая метка темы
  keyword?: string;    // кодовое слово воронки, если гайд связан с ней
};

export const guides: Guide[] = [
  {
    slug: "mito-sleep-protocol",
    title: "Протокол сна и перезапуска митохондрий",
    excerpt:
      "Практический биохакинг глубокого сна: как снизить температуру тела, исключить синий свет и восстановить клеточную энергию за ночь.",
    date: "2026-09-22",
    readMin: 5,
    tag: "биохакинг",
    keyword: "ПРОТОКОЛ",
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
