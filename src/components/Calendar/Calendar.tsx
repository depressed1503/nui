import { useState } from "react";
import "./Calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

interface CalendarProps {
  mode: "single" | "range";
  value: Date | DateRange | null;
  onChange: (v: Date | DateRange | null) => void;
}

/* -------------------- ISO helpers -------------------- */

const isoDay = (d: Date) => {
  const day = d.getDay();
  return day === 0 ? 7 : day;
};

/* -------------------- Presets -------------------- */

function getCurrentWeek(): DateRange {
  const today = new Date();
  const d = isoDay(today);

  const from = new Date(today);
  from.setDate(today.getDate() - (d - 1));

  const to = new Date(from);
  to.setDate(from.getDate() + 6);

  return { from, to };
}

function getLastWeek(): DateRange {
  const cw = getCurrentWeek();

  const from = new Date(cw.from!);
  from.setDate(from.getDate() - 7);

  const to = new Date(cw.to!);
  to.setDate(to.getDate() - 7);

  return { from, to };
}

function getCurrentMonth(): DateRange {
  const today = new Date();
  return {
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
  };
}

function getLastMonth(): DateRange {
  const today = new Date();
  return {
    from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
    to: new Date(today.getFullYear(), today.getMonth(), 0),
  };
}

/* -------------------- Component -------------------- */

export default function Calendar({ mode, value, onChange }: CalendarProps) {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [selectingMY, setSelectingMY] = useState(false);
  const [tmpMonth, setTmpMonth] = useState(month);
  const [tmpYear, setTmpYear] = useState(year);

  const rangeValue: DateRange =
    (mode === "range" ? (value as DateRange) : null) || {
      from: null,
      to: null,
    };

  /* -------------------- Day selection -------------------- */

  function selectDay(d: Date) {
    if (mode === "single") {
      onChange(d);
      return;
    }

    const { from, to } = rangeValue;

    if (!from || (from && to)) {
      onChange({ from: d, to: null });
    } else {
      if (d < from) onChange({ from: d, to: from });
      else onChange({ from, to: d });
    }
  }

  /* -------------------- Calendar grid -------------------- */

  const firstDay = new Date(year, month, 1);
  const start = isoDay(firstDay);

  const grid = Array.from({ length: 42 }, (_, i) => {
    const day = i - (start - 1) + 1;
    return new Date(year, month, day);
  });

  const isSame = (a: Date | null, b: Date) =>
    a &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isInRange = (d: Date) => {
    if (!rangeValue.from || !rangeValue.to) return false;
    return d >= rangeValue.from && d <= rangeValue.to;
  };

  /* -------------------- Render -------------------- */
    const nextMonth = () => {
        let newMonth = month + 1;
        let newYear = year;

        if (newMonth > 11) {
            newMonth = 0;
            newYear = year + 1;
        }

        setMonth(newMonth);
        setYear(newYear);
    };

    const prevMonth = () => {
        let newMonth = month - 1;
        let newYear = year;

        if (newMonth < 0) {
            newMonth = 11;
            newYear = year - 1;
        }

        setMonth(newMonth);
        setYear(newYear);
    };
  return (
    <div className="calendar">
      {/* LEFT PRESETS */}
      <div className="calendar-left">
        <div className="preset" onClick={() => onChange(getLastWeek())}>
          Прошлая неделя
        </div>
        <div className="preset" onClick={() => onChange(getCurrentWeek())}>
          Текущая неделя
        </div>
        <div className="preset" onClick={() => onChange(getLastMonth())}>
          Прошлый месяц
        </div>
        <div className="preset" onClick={() => onChange(getCurrentMonth())}>
          Текущий месяц
        </div>

        <div className="preset-clear" onClick={() => onChange(null)}>
          Очистить
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="calendar-body">

        {/* Month-Year Selector */}
        {selectingMY && (
          <div className="month-year-panel">
            <div className="my-row">
              <label>Месяц:</label>
              <select
                value={tmpMonth}
                onChange={(e) => setTmpMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i}>
                    {new Date(2025, i).toLocaleString("ru", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div className="my-row">
              <label>Год:</label>
              <input
                type="number"
                className="year-input"
                value={tmpYear}
                onChange={(e) => setTmpYear(Number(e.target.value))}
              />
            </div>

            <div className="my-actions">
              <button
                className="btn-cancel"
                onClick={() => setSelectingMY(false)}
              >
                Отмена
              </button>

              <button
                className="btn-apply"
                onClick={() => {
                  setYear(tmpYear);
                  setMonth(tmpMonth);
                  setSelectingMY(false);
                }}
              >
                Перейти
              </button>
            </div>
          </div>
        )}

        {!selectingMY && (
          <>
            <div className="cal-header">
              <button
                onClick={prevMonth}
                >
                <ChevronLeft />
                </button>

                <span
                className="cal-header__month"
                onClick={() => {
                    setTmpMonth(month);
                    setTmpYear(year);
                    setSelectingMY(true);
                }}
                >
                {new Date(year, month).toLocaleString("ru", { month: "long" })} {year}
                </span>

                <button
                    onClick={nextMonth}
                >
                    <ChevronRight/>
                </button>
            </div>

            <div className="cal-weekdays">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="cal-grid">
              {grid.map((d, i) => {
                const inCurrent = d.getMonth() === month;
                const singleSel =
                  mode === "single" &&
                  value instanceof Date &&
                  isSame(value, d);

                const start = isSame(rangeValue.from, d);
                const end = isSame(rangeValue.to, d);

                return (
                  <div
                    key={i}
                    className={[
                      "day",
                      !inCurrent ? "dim" : "",
                      singleSel ? "sel" : "",
                      start ? "sel-start" : "",
                      end ? "sel-end" : "",
                      isInRange(d) ? "in-range" : "",
                    ].join(" ")}
                    onClick={() => selectDay(d)}
                  >
                    {d.getDate()}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
