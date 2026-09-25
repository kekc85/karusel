"use client";

import React, { useState, useEffect, useRef } from "react";

type BreathingMode = "box" | "relax";

export function ColdBreathTrainer() {
  // 1. Дыхательный метроном
  const [mode, setMode] = useState<BreathingMode>("box");
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // 2. Калькулятор холодовой адаптации
  const [coldLevel, setColdLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");

  const phases =
    mode === "box"
      ? [
          { name: "Вдох", duration: 4, action: "Глубокий вдох носом в живот", color: "text-cyan-600 border-cyan-400" },
          { name: "Задержка", duration: 4, action: "Задержка на вдохе (раскрытие альвеол)", color: "text-amber-600 border-amber-400" },
          { name: "Выдох", duration: 4, action: "Плавный выдох через рот", color: "text-blue-600 border-blue-400" },
          { name: "Задержка", duration: 4, action: "Пауза на выдохе (гипоксия HIF-1α)", color: "text-terra border-terra" },
        ]
      : [
          { name: "Вдох", duration: 4, action: "Спокойный вдох носом", color: "text-cyan-600 border-cyan-400" },
          { name: "Задержка", duration: 7, action: "Задержка дыхания, расслабление мышц", color: "text-amber-600 border-amber-400" },
          { name: "Выдох", duration: 8, action: "Медленный шипящий выдох через губы", color: "text-emerald-600 border-emerald-400" },
        ];

  const currentPhase = phases[currentPhaseIndex];

  // Таймер дыхания
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Переход к следующей фазе
            setCurrentPhaseIndex((prevPhase) => {
              const nextPhase = (prevPhase + 1) % phases.length;
              if (nextPhase === 0) {
                setCompletedCycles((c) => c + 1);
              }
              return nextPhase;
            });
            return phases[(currentPhaseIndex + 1) % phases.length].duration;
          }
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentPhaseIndex, phases]);

  const toggleTrainer = () => {
    if (!isRunning) {
      setSecondsLeft(phases[currentPhaseIndex].duration);
    }
    setIsRunning(!isRunning);
  };

  const resetTrainer = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setSecondsLeft(phases[0].duration);
    setCompletedCycles(0);
  };

  const switchMode = (newMode: BreathingMode) => {
    setIsRunning(false);
    setMode(newMode);
    setCurrentPhaseIndex(0);
    const newPhases =
      newMode === "box"
        ? [4, 4, 4, 4]
        : [4, 7, 8];
    setSecondsLeft(newPhases[0]);
    setCompletedCycles(0);
  };

  // Параметры холодового протокола
  const coldProtocols = {
    beginner: {
      title: "Новичок (Дни 1–4)",
      waterTemp: "18–20°C (Прохладная вода)",
      duration: "30–45 секунд",
      zone: "Умывание лица ледяной водой + стопы и кисти в конце душа",
      effect: "Активация нырятельного рефлекса, снятие отечности",
      atpBoost: "+10–12%",
    },
    intermediate: {
      title: "Практик (Дни 5–9)",
      waterTemp: "14–16°C (Холодный душ)",
      duration: "60–90 секунд",
      zone: "Шейно-воротниковая зона, межлопаточная область (депо бурого жира)",
      effect: "Выброс норадреналина, термогенез UCP-1, стимуляция митофагии",
      atpBoost: "+20–25%",
    },
    advanced: {
      title: "Биохакер (Дни 10–14)",
      waterTemp: "10–12°C (Контраст / ледяная ванна)",
      duration: "2 минуты",
      zone: "Полное погружение до шеи + задержка дыхания на выдохе после душа",
      effect: "Максимальный синтез HIF-1α, оксида азота (NO) и пролиферация митохондрий",
      atpBoost: "+30–35%",
    },
  };

  const activeCold = coldProtocols[coldLevel];

  return (
    <div className="my-12 rounded-2xl border border-paper-line bg-paper-card p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 text-sm font-bold">
          ❄️
        </span>
        <div>
          <h3 className="font-serif text-2xl font-bold text-clay">
            Интерактивный тренажер дыхания и холодовой адаптации
          </h3>
          <p className="text-sm text-clay-muted font-sans">
            Дыхательный метроном в реальном времени и персональный калькулятор закаливания
          </p>
        </div>
      </div>

      {/* Блок 1: Дыхательный метроном */}
      <div className="mb-8 rounded-xl bg-paper p-6 border border-paper-line/80">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex rounded-lg border border-paper-line p-1 bg-paper-card">
            <button
              onClick={() => switchMode("box")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                mode === "box" ? "bg-terra text-white shadow-xs" : "text-clay-muted hover:text-clay"
              }`}
            >
              Квадрат (4-4-4-4) • Гипоксия
            </button>
            <button
              onClick={() => switchMode("relax")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                mode === "relax" ? "bg-terra text-white shadow-xs" : "text-clay-muted hover:text-clay"
              }`}
            >
              Релаксация (4-7-8) • Вагус
            </button>
          </div>

          <div className="text-xs font-mono text-clay-muted">
            Выполнено циклов: <strong className="text-clay text-sm">{completedCycles}</strong>
          </div>
        </div>

        {/* Визуальный круг-пульсатор */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center">
            {/* Внешний пульсирующий ореол */}
            <div
              className={`absolute h-44 w-44 rounded-full border-2 transition-all duration-1000 ${
                isRunning
                  ? currentPhase.name === "Вдох"
                    ? "scale-110 border-cyan-400 bg-cyan-50/50"
                    : currentPhase.name === "Выдох"
                    ? "scale-90 border-blue-400 bg-blue-50/50"
                    : "scale-100 border-amber-400 bg-amber-50/50"
                  : "border-paper-line bg-paper-card"
              }`}
            />
            {/* Центральный круг с цифрой секунд */}
            <div className="relative z-10 flex flex-col items-center justify-center h-32 w-32 rounded-full bg-paper-card border border-paper-line shadow-xs">
              <span className="text-3xl font-mono font-bold text-clay">{secondsLeft}</span>
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-clay-muted mt-0.5">
                {currentPhase.name}
              </span>
            </div>
          </div>

          <div className="mt-5 text-center">
            <div className="text-sm font-semibold text-clay">{currentPhase.action}</div>
            <div className="text-xs text-clay-subtle mt-1">
              {mode === "box" ? "Равномерный цикл для баланса CO2 и O2" : "Удлиненный выдох для включения парасимпатики"}
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={toggleTrainer}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                isRunning
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-terra hover:bg-terra-hover text-white"
              }`}
            >
              {isRunning ? "Пауза" : "Начать дыхание"}
            </button>
            <button
              onClick={resetTrainer}
              className="px-4 py-2.5 rounded-lg border border-paper-line bg-paper-card text-clay-muted hover:text-clay text-sm font-medium transition-colors"
            >
              Сброс
            </button>
          </div>
        </div>
      </div>

      {/* Блок 2: Индивидуальный расчет холодового протокола */}
      <div className="rounded-xl bg-paper p-6 border border-paper-line/80">
        <h4 className="text-sm font-semibold text-clay mb-3 font-sans">
          Выберите ваш текущий уровень адаптации:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
          {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setColdLevel(lvl)}
              className={`p-3 rounded-lg border text-left transition-all ${
                coldLevel === lvl
                  ? "border-terra bg-terra/5 shadow-xs"
                  : "border-paper-line bg-paper-card hover:bg-paper"
              }`}
            >
              <div className="text-xs font-bold text-clay">{coldProtocols[lvl].title}</div>
              <div className="text-[11px] text-clay-muted mt-0.5">{coldProtocols[lvl].waterTemp}</div>
            </button>
          ))}
        </div>

        {/* Вывод параметров */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-paper-line bg-paper-card p-4 text-xs">
          <div>
            <span className="text-clay-subtle block font-sans">Время воздействия:</span>
            <span className="text-base font-mono font-bold text-clay">{activeCold.duration}</span>
          </div>
          <div>
            <span className="text-clay-subtle block font-sans">Прирост АТФ митохондрий:</span>
            <span className="text-base font-mono font-bold text-emerald-600">{activeCold.atpBoost}</span>
          </div>
          <div className="md:col-span-2 pt-2 border-t border-paper-line">
            <span className="text-clay-subtle block font-sans">Зона воздействия:</span>
            <span className="font-medium text-clay mt-0.5 block">{activeCold.zone}</span>
          </div>
          <div className="md:col-span-2 pt-2 border-t border-paper-line">
            <span className="text-clay-subtle block font-sans">Биохимический эффект:</span>
            <span className="text-clay-muted mt-0.5 block">{activeCold.effect}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
