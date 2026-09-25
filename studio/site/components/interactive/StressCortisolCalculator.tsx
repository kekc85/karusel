"use client";

import React, { useState, useEffect } from "react";

export function StressCortisolCalculator() {
  // 1. Состояние для теста симптомов кортизола
  const [answers, setAnswers] = useState<{ [key: number]: number }>({
    0: 1,
    1: 1,
    2: 1,
    3: 1,
  });

  // 2. Состояние для веса (дозировка нутрицевтиков)
  const [weight, setWeight] = useState<number>(70);

  // 3. Состояние для тренажера физиологического вздоха
  const [sighActive, setSighActive] = useState<boolean>(false);
  const [sighStep, setSighStep] = useState<number>(0); // 0: вдох, 1: довдох, 2: длинный выдох
  const [sighSeconds, setSighSeconds] = useState<number>(3);
  const [sighCount, setSighCount] = useState<number>(0);

  // Вопросы теста кортизола
  const questions = [
    {
      q: "Как вы чувствуете себя в первые 30–45 минут после пробуждения?",
      options: [
        { text: "Бодрый, легко встаю без будильника", score: 0 },
        { text: "Нужно 1–2 чашки кофе, чтобы раскачаться", score: 1 },
        { text: "Разбит, ощущение «тумана в голове» и слабости", score: 3 },
      ],
    },
    {
      q: "Что происходит с вашей энергией около 15:00–17:00?",
      options: [
        { text: "Ровный уровень энергии до вечера", score: 0 },
        { text: "Тянет на сладкое, углеводы или еще кофе", score: 2 },
        { text: "Сильный энергетический спад, непреодолимая сонливость", score: 3 },
      ],
    },
    {
      q: "Каково состояние нервной системы после 22:00?",
      options: [
        { text: "Спокойная сонливость, легко засыпаю за 10–15 минут", score: 0 },
        { text: "Периодически сложно отключить мысли о делах", score: 2 },
        { text: "«Второе дыхание», мыслительный шторм, тревожность", score: 3 },
      ],
    },
    {
      q: "Просыпаетесь ли вы ночью между 02:00 и 04:30?",
      options: [
        { text: "Сплю непрерывно до утра", score: 0 },
        { text: "Редко (1–2 раза в неделю при стрессе)", score: 1 },
        { text: "Регулярно просыпаюсь с учащенным сердцебиением", score: 3 },
      ],
    },
  ];

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  // Интерпретация баллов
  const getCortisolStatus = (score: number) => {
    if (score <= 3) {
      return {
        label: "Оптимальный циркадный ритм",
        desc: "Кортизол и мелатонин сбалансированы. Пик бодрости утром, плавный спад к вечеру.",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-300",
        curveType: "normal",
      };
    }
    if (score <= 7) {
      return {
        label: "Умеренный кортизоловый сдвиг",
        desc: "Истощение утреннего пика CAR, компенсаторный подъем вечером. Требуется поддержка вагуса.",
        badge: "bg-amber-50 text-amber-800 border-amber-300",
        curveType: "shifted",
      };
    }
    return {
      label: "Инверсия кортизоловой кривой (HPA-ось в дистрессе)",
      desc: "Утренний гипокортицизм + ночные всплески. Митохондрии лишены мелатонина.",
      badge: "bg-terra/10 text-terra border-terra/30",
      curveType: "inverted",
    };
  };

  const status = getCortisolStatus(totalScore);

  // Расчет нутрицевтиков по весу
  // Магний элементный: 5.5 мг на кг массы тела (бисглицинат)
  // L-теанин: 2.2 мг на кг
  const magnesiumDose = Math.round(weight * 5.5);
  const theanineDose = Math.round(weight * 2.2);

  // Логика дыхания: Физиологический вздох
  // Шаг 0: Вдох носом (2.5 сек)
  // Шаг 1: Довдох носом (1 сек)
  // Шаг 2: Выдох ртом (5.5 сек)
  const sighSteps = [
    { title: "Вдох животом через нос", duration: 3, action: "Медленно наполните нижнюю часть легких" },
    { title: "Резкий довдох", duration: 1, action: "Максимально раскройте спавшиеся альвеолы" },
    { title: "Долгий расслабленный выдох", duration: 6, action: "Медленный выдох ртом со вздохом облегчения" },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (sighActive) {
      timer = setInterval(() => {
        setSighSeconds((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            setSighStep((curStep) => {
              const next = (curStep + 1) % sighSteps.length;
              if (next === 0) {
                setSighCount((c) => c + 1);
              }
              return next;
            });
            return sighSteps[(sighStep + 1) % sighSteps.length].duration;
          }
        });
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sighActive, sighStep, sighSteps]);

  const toggleSigh = () => {
    if (!sighActive) {
      setSighStep(0);
      setSighSeconds(sighSteps[0].duration);
    }
    setSighActive(!sighActive);
  };

  return (
    <div className="my-12 rounded-2xl border border-paper-line bg-paper-card p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terra/10 text-terra text-sm font-bold">
          ⚖️
        </span>
        <div>
          <h3 className="font-serif text-2xl font-bold text-clay">
            Интерактивный диагностический комплекс «Кортизол & Антистресс»
          </h3>
          <p className="text-sm text-clay-muted font-sans">
            Оценка суточного ритма, расчет персонализированных дозировок и тренажер вагуса
          </p>
        </div>
      </div>

      {/* Блок 1: Экспресс-оценка кортизоловой кривой */}
      <div className="mb-8 rounded-xl bg-paper p-6 border border-paper-line/80">
        <h4 className="text-base font-bold text-clay mb-4 font-sans">
          1. Экспресс-тест состояния вашей оси надпочечников:
        </h4>

        <div className="space-y-4 mb-6">
          {questions.map((item, qIdx) => (
            <div key={qIdx} className="rounded-lg border border-paper-line bg-paper-card p-4">
              <div className="text-xs font-semibold text-clay mb-2.5 font-sans">
                {qIdx + 1}. {item.q}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {item.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [qIdx]: opt.score,
                      }))
                    }
                    className={`p-2.5 text-left text-xs rounded-md border transition-all ${
                      answers[qIdx] === opt.score
                        ? "border-terra bg-terra/10 font-medium text-clay shadow-xs"
                        : "border-paper-line/70 bg-paper text-clay-muted hover:text-clay"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Результат теста */}
        <div className={`p-4 rounded-xl border ${status.badge}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <span className="font-bold text-sm">{status.label}</span>
            <span className="font-mono text-xs font-bold">Индекс нагрузки: {totalScore} из 12</span>
          </div>
          <p className="text-xs mt-1 text-clay-muted">{status.desc}</p>
        </div>

        {/* SVG визуализация кривой кортизола */}
        <div className="mt-5 rounded-lg border border-paper-line bg-paper-card p-4">
          <div className="text-xs font-semibold text-clay mb-2 flex items-center justify-between">
            <span>Суточная кривая кортизола:</span>
            <div className="flex items-center gap-3 text-[11px] font-normal">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-emerald-500 inline-block" /> Норма
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-terra inline-block" /> Ваш профиль
              </span>
            </div>
          </div>

          <div className="relative w-full h-32">
            <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
              {/* Линии сетки */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="#E4DAC7" strokeDasharray="3 3" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="#E4DAC7" strokeDasharray="3 3" />
              <line x1="40" y1="100" x2="380" y2="100" stroke="#E4DAC7" />

              {/* Метки времени */}
              <text x="50" y="115" fontSize="10" fill="#6E655A" textAnchor="middle">07:00</text>
              <text x="150" y="115" fontSize="10" fill="#6E655A" textAnchor="middle">13:00</text>
              <text x="250" y="115" fontSize="10" fill="#6E655A" textAnchor="middle">19:00</text>
              <text x="350" y="115" fontSize="10" fill="#6E655A" textAnchor="middle">23:00</text>

              {/* Физиологическая норма (высокий пик утром, падение к ночи) */}
              <path
                d="M 50 30 Q 150 70 250 85 T 350 95"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Кривая пользователя */}
              {status.curveType === "normal" && (
                <path
                  d="M 50 35 Q 150 72 250 88 T 350 93"
                  fill="none"
                  stroke="#BE4A24"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
              )}
              {status.curveType === "shifted" && (
                <path
                  d="M 50 65 Q 150 60 250 55 T 350 70"
                  fill="none"
                  stroke="#BE4A24"
                  strokeWidth="2.5"
                />
              )}
              {status.curveType === "inverted" && (
                <path
                  d="M 50 85 Q 150 75 250 45 T 350 30"
                  fill="none"
                  stroke="#BE4A24"
                  strokeWidth="2.5"
                />
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Блок 2: Персональный расчет нутрицевтиков */}
      <div className="mb-8 rounded-xl bg-paper p-6 border border-paper-line/80">
        <h4 className="text-base font-bold text-clay mb-2 font-sans">
          2. Калькулятор вечернего нутрицевтического щита:
        </h4>
        <p className="text-xs text-clay-muted mb-4">
          Терапевтическая дозировка рассчитывается исходя из массы тела
        </p>

        <div className="flex items-center justify-between mb-3">
          <label htmlFor="weight-range" className="text-xs font-semibold text-clay">
            Ваш вес:
          </label>
          <span className="font-mono text-xl font-bold text-clay">{weight} кг</span>
        </div>

        <input
          id="weight-range"
          type="range"
          min="45"
          max="120"
          value={weight}
          onChange={(e) => setWeight(parseInt(e.target.value))}
          className="w-full h-2 bg-paper-line rounded-lg appearance-none cursor-pointer accent-terra mb-6"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-paper-line bg-paper-card">
            <span className="text-[11px] font-sans uppercase font-bold text-terra">Шаг 1 • Глубокий сон</span>
            <div className="text-sm font-bold text-clay mt-1">Магний Бисглицинат (Mg Bisglycinate)</div>
            <div className="text-2xl font-mono font-bold text-clay mt-2">{magnesiumDose} мг</div>
            <p className="text-[11px] text-clay-muted mt-1.5">
              Элементного магния. Бисглицинат проходит ГЭБ, тормозит активность рецепторов NMDA и расслабляет гладкую мускулатуру.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-paper-line bg-paper-card">
            <span className="text-[11px] font-sans uppercase font-bold text-terra">Шаг 2 • Отключение мыслей</span>
            <div className="text-sm font-bold text-clay mt-1">L-Теанин (L-Theanine)</div>
            <div className="text-2xl font-mono font-bold text-clay mt-2">{theanineDose} мг</div>
            <p className="text-[11px] text-clay-muted mt-1.5">
              Природная аминокислота из зеленого чая. Повышает выработку ГАМК и альфа-волн в коре мозга без эффекта седации и сонливости днем.
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-paper-card border border-paper-line text-xs text-clay-muted">
          💡 <strong>Время приема:</strong> за 40 минут до сна со стаканом теплой воды (не горячей).
        </div>
      </div>

      {/* Блок 3: Интерактивный физиологический вздох */}
      <div className="rounded-xl bg-paper p-6 border border-paper-line/80">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-base font-bold text-clay font-sans">
              3. Экспресс-тренажер: «Физиологический вздох»
            </h4>
            <p className="text-xs text-clay-muted">
              Мгновенный сброс пульса и кортизола через барорецепторы
            </p>
          </div>
          <span className="text-xs font-mono text-clay-muted">
            Выполнено циклов: <strong className="text-clay font-bold text-sm">{sighCount}</strong> / 5
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-6 rounded-xl border border-paper-line bg-paper-card">
          <div className="text-4xl font-mono font-bold text-terra mb-1">{sighSeconds}s</div>
          <div className="text-base font-bold text-clay mb-1">{sighSteps[sighStep].title}</div>
          <div className="text-xs text-clay-muted text-center max-w-sm px-4 mb-5">
            {sighSteps[sighStep].action}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSigh}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                sighActive
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-terra hover:bg-terra-hover text-white"
              }`}
            >
              {sighActive ? "Пауза" : "Запустить вздох"}
            </button>
            <button
              onClick={() => {
                setSighActive(false);
                setSighStep(0);
                setSighSeconds(sighSteps[0].duration);
                setSighCount(0);
              }}
              className="px-4 py-2.5 rounded-lg border border-paper-line bg-paper text-clay-muted hover:text-clay text-sm font-medium transition-colors"
            >
              Сброс
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
