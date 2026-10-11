"use client";

import React, { useState } from "react";

export function DopamineCoffeeCalculator() {
  const [wakeTime, setWakeTime] = useState("07:00");
  const [coffeeCups, setCoffeeCups] = useState(2);
  const [morningSun, setMorningSun] = useState(false);
  const [morningWater, setMorningWater] = useState(false);

  // Расчет идеального окна первого кофе (+90-120 мин от пробуждения)
  const calcCoffeeWindow = (wakeStr: string) => {
    const [h, m] = wakeStr.split(":").map(Number);
    const wake = new Date();
    wake.setHours(h, m, 0, 0);

    const start = new Date(wake.getTime() + 90 * 60 * 1000);
    const end = new Date(wake.getTime() + 120 * 60 * 1000);
    const cutoff = new Date(wake.getTime() + 9 * 60 * 60 * 1000); // кофеин стоп за 9-10 часов до сна

    const fmt = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    return {
      windowStart: fmt(start),
      windowEnd: fmt(end),
      lastCup: fmt(cutoff),
    };
  };

  const schedule = calcCoffeeWindow(wakeTime);

  // Оценка риска послеобеденного краша (Crash Score)
  const getCrashRisk = () => {
    let score = coffeeCups * 25;
    if (!morningSun) score += 20;
    if (!morningWater) score += 15;
    return Math.min(100, Math.max(10, score));
  };

  const risk = getCrashRisk();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 my-8 text-white shadow-xl shadow-amber-500/5">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <span className="text-3xl">☕</span>
        <div>
          <h3 className="text-xl font-bold text-amber-400">
            Калькулятор утреннего дофамина и окна кофе
          </h3>
          <p className="text-sm text-slate-400">
            Рассчитай точное время первой чашки, чтобы избежать спада энергии в 14:00
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Вводные данные */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Во сколько ты просыпаешься?
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-lg font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Сколько чашек кофе пьешь в день? ({coffeeCups})
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={coffeeCups}
              onChange={(e) => setCoffeeCups(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 чашка</span>
              <span>2-3 (норма)</span>
              <span>4+ (перегруз)</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={morningWater}
                onChange={(e) => setMorningWater(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800"
              />
              <span>Пью 500 мл теплой воды сразу после подъема</span>
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={morningSun}
                onChange={(e) => setMorningSun(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800"
              />
              <span>10 минут утреннего света в глаза до первого экрана</span>
            </label>
          </div>
        </div>

        {/* Результаты и график */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Идеальное окно для кофе
            </div>
            <div className="text-3xl font-extrabold text-amber-400 font-mono">
              {schedule.windowStart} – {schedule.windowEnd}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ровно через 90–120 мин после подъема, когда уровень кортизола снизится естественным путем.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-700/60">
              <div className="text-xs text-slate-400">Крайний срок последней чашки:</div>
              <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">
                до {schedule.lastCup}
              </div>
              <p className="text-xs text-slate-500">
                Период полувыведения кофеина — 6–8 часов. Позже — разрушение глубокой фазы сна.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-400">Риск дневного «краша» (14:00):</span>
              <span className={`font-bold ${risk > 60 ? "text-rose-400" : risk > 35 ? "text-amber-400" : "text-emerald-400"}`}>
                {risk}% {risk > 60 ? "Высокий" : risk > 35 ? "Средний" : "Низкий"}
              </span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  risk > 60 ? "bg-rose-500" : risk > 35 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${risk}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300/90 leading-relaxed">
        💡 <b>Научный факт:</b> Кофеин не дает энергию, а лишь временно блокирует аденозиновые рецепторы. Если выпить кофе сразу после звонка будильника, аденозин не распадается, а копится — и в 14:00 рецепторы освобождаются лавинообразно, вызывая сонливость.
      </div>
    </div>
  );
}
