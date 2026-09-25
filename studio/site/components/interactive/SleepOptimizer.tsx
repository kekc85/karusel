"use client";

import React, { useState } from "react";

// Интерактивный калькулятор циркадных ритмов и оптимизатор условий глубокого сна
export function SleepOptimizer() {
  // 1. Состояние для расчета времени сна
  const [wakeHour, setWakeHour] = useState("07:00");
  
  // 2. Состояние для термодинамического ползунка температуры
  const [temp, setTemp] = useState<number>(18.5);

  // 3. Состояние чек-листа вечерней подготовки
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    ventilation: false,
    light: false,
    food: false,
    darkness: false,
  });

  // Расчет времени для циклов сна (каждый цикл = 90 минут, 15 минут на засыпание)
  const calculateSleepTimes = (wakeTimeStr: string) => {
    const [h, m] = wakeTimeStr.split(":").map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(h, m, 0, 0);

    const calcTime = (cycles: number) => {
      // cycles * 90 min + 15 min buffer
      const totalMinutes = cycles * 90 + 15;
      const bedDate = new Date(wakeDate.getTime() - totalMinutes * 60 * 1000);
      const hours = String(bedDate.getHours()).padStart(2, "0");
      const minutes = String(bedDate.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    return {
      cycles6: calcTime(6), // 9.25 часов
      cycles5: calcTime(5), // 7.75 часов (Оптимально)
      cycles4: calcTime(4), // 6.25 часов
    };
  };

  const sleepTimes = calculateSleepTimes(wakeHour);

  // Расчет детокса и последнего приема пищи от оптимального времени отхода ко сну (5 циклов)
  const getPreSleepSchedule = (bedTimeStr: string) => {
    const [h, m] = bedTimeStr.split(":").map(Number);
    const bedDate = new Date();
    bedDate.setHours(h, m, 0, 0);

    const screenDate = new Date(bedDate.getTime() - 90 * 60 * 1000); // -90 мин
    const foodDate = new Date(bedDate.getTime() - 180 * 60 * 1000); // -3 часа

    const format = (d: Date) =>
      `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

    return {
      screensOff: format(screenDate),
      dinnerLast: format(foodDate),
    };
  };

  const preSleep = getPreSleepSchedule(sleepTimes.cycles5);

  // Оценка температуры спальни
  const getTempAssessment = (t: number) => {
    if (t < 17) {
      return {
        label: "Слишком прохладно",
        status: "Риск микропробуждений от мышечной дрожи",
        color: "text-blue-600 bg-blue-50 border-blue-200",
      };
    }
    if (t >= 17 && t <= 19.5) {
      return {
        label: "Идеально для митофагии",
        status: "Золотой стандарт: пик фазы глубокого NREM-3/4 сна",
        color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      };
    }
    if (t > 19.5 && t <= 21) {
      return {
        label: "Приемлемо",
        status: "Необходим легкий дышащий текстиль (лен/хлопок)",
        color: "text-amber-700 bg-amber-50 border-amber-200",
      };
    }
    return {
      label: "Критический перегрев",
      status: "Ядро тела не охлаждается. Глубокий сон урезается вдвое",
      color: "text-terra bg-terra/10 border-terra/30",
    };
  };

  const tempAssessment = getTempAssessment(temp);

  // Подсчет готовности чек-листа
  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((checkedCount / 4) * 100);

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="my-12 rounded-2xl border border-paper-line bg-paper-card p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terra/10 text-terra text-sm font-bold">
          ⚡
        </span>
        <div>
          <h3 className="font-serif text-2xl font-bold text-clay">
            Интерактивный оптимизатор митохондриального сна
          </h3>
          <p className="text-sm text-clay-muted font-sans">
            Рассчитайте персональные тайминги и настройте параметры спальни
          </p>
        </div>
      </div>

      {/* Блок 1: Калькулятор 90-минутных циклов сна */}
      <div className="mb-8 rounded-xl bg-paper p-5 border border-paper-line/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <label htmlFor="wake-time" className="block text-sm font-semibold text-clay mb-1 font-sans">
              Во сколько вам нужно проснуться?
            </label>
            <p className="text-xs text-clay-subtle">
              Расчет по 90-минутным фазам (NREM + REM) + 15 мин на засыпание
            </p>
          </div>
          <input
            id="wake-time"
            type="time"
            value={wakeHour}
            onChange={(e) => setWakeHour(e.target.value)}
            className="px-4 py-2 text-lg font-mono font-bold rounded-lg border border-paper-line bg-paper-card text-clay focus:outline-none focus:ring-2 focus:ring-terra"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* 5 циклов - Оптимально */}
          <div className="rounded-lg border-2 border-terra/40 bg-terra/5 p-3.5 text-center relative overflow-hidden">
            <span className="absolute top-1 right-2 text-[10px] font-mono uppercase bg-terra text-white px-1.5 py-0.5 rounded font-bold">
              Идеал
            </span>
            <div className="text-xs font-semibold text-clay-muted">5 циклов (7.5 ч)</div>
            <div className="text-2xl font-mono font-bold text-terra mt-0.5">{sleepTimes.cycles5}</div>
            <div className="text-[11px] text-clay-subtle mt-1">Оптимальная митофагия</div>
          </div>

          {/* 6 циклов */}
          <div className="rounded-lg border border-paper-line bg-paper-card p-3.5 text-center">
            <div className="text-xs font-semibold text-clay-muted">6 циклов (9 ч)</div>
            <div className="text-2xl font-mono font-bold text-clay mt-0.5">{sleepTimes.cycles6}</div>
            <div className="text-[11px] text-clay-subtle mt-1">При высоких нагрузках</div>
          </div>

          {/* 4 цикла */}
          <div className="rounded-lg border border-paper-line bg-paper-card p-3.5 text-center">
            <div className="text-xs font-semibold text-clay-muted">4 цикла (6 ч)</div>
            <div className="text-2xl font-mono font-bold text-clay mt-0.5">{sleepTimes.cycles4}</div>
            <div className="text-[11px] text-clay-subtle mt-1">Минимальный порог</div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-paper-line flex flex-wrap items-center justify-between text-xs text-clay-muted gap-2">
          <span>
            🍽 Последний прием пищи до: <strong className="text-clay font-mono">{preSleep.dinnerLast}</strong>
          </span>
          <span>
            📱 Световой детокс (экраны офф) с: <strong className="text-clay font-mono">{preSleep.screensOff}</strong>
          </span>
        </div>
      </div>

      {/* Блок 2: Температурный регулятор спальни */}
      <div className="mb-8 rounded-xl bg-paper p-5 border border-paper-line/80">
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="temp-range" className="text-sm font-semibold text-clay font-sans">
            Температура в вашей спальне:
          </label>
          <span className="font-mono text-2xl font-bold text-clay">{temp.toFixed(1)}°C</span>
        </div>

        <input
          id="temp-range"
          type="range"
          min="16"
          max="24"
          step="0.5"
          value={temp}
          onChange={(e) => setTemp(parseFloat(e.target.value))}
          className="w-full h-2 bg-paper-line rounded-lg appearance-none cursor-pointer accent-terra"
        />

        <div className="flex justify-between text-[11px] text-clay-subtle mt-1 font-mono">
          <span>16°C</span>
          <span className="text-emerald-600 font-bold">18–19°C (Оптимум)</span>
          <span>24°C</span>
        </div>

        <div className={`mt-4 p-3 rounded-lg border text-xs ${tempAssessment.color} transition-colors`}>
          <div className="font-bold text-[13px]">{tempAssessment.label}</div>
          <div className="mt-0.5">{tempAssessment.status}</div>
        </div>
      </div>

      {/* Блок 3: Чек-лист готовности к митофагии */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-clay font-sans">
            Чек-лист вечерней готовности митохондрий:
          </span>
          <span className="font-mono text-xs font-bold text-clay">
            {progressPercent}% ({checkedCount}/4)
          </span>
        </div>

        {/* Прогресс-бар */}
        <div className="w-full bg-paper-line h-2 rounded-full mb-4 overflow-hidden">
          <div
            className="bg-terra h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="space-y-2.5">
          {[
            {
              id: "ventilation",
              title: "Проветривание спальни",
              desc: "Окно открыто минимум на 20 мин, температура снижена до 18–19°C",
            },
            {
              id: "light",
              title: "Световой карантин",
              desc: "Выключен верхний холодный свет, включены торшеры / желтые фильтры",
            },
            {
              id: "food",
              title: "Чистое инсулиновое окно",
              desc: "Прошло не менее 2.5–3 часов с момента последнего приема пищи",
            },
            {
              id: "darkness",
              title: "100% блэкаут",
              desc: "Плотные шторы закрыты, индикаторы приборов заклеены или надета маска",
            },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-paper-line bg-paper-card cursor-pointer hover:bg-paper transition-colors"
            >
              <input
                type="checkbox"
                checked={checklist[item.id]}
                onChange={() => toggleCheck(item.id)}
                className="mt-1 h-4 w-4 rounded border-paper-line text-terra focus:ring-terra cursor-pointer accent-terra"
              />
              <div className="text-xs">
                <span className={`font-semibold block ${checklist[item.id] ? "line-through text-clay-subtle" : "text-clay"}`}>
                  {item.title}
                </span>
                <span className="text-clay-muted text-[11px]">{item.desc}</span>
              </div>
            </label>
          ))}
        </div>

        {progressPercent === 100 && (
          <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-center">
            🎉 Все биофизические условия выполнены! Сегодня ночью запустится полноценная митофагия.
          </div>
        )}
      </div>
    </div>
  );
}
