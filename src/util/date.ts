export function getDayOfTheWeekGivenANumber(num: number): string {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return days[num];
}

export function getCurrentDayOfTheWeek() {
  const today = new Date();
  const day = today.getDay();
  return day;
}

/**
 * Regresa la fecha de hoy en el siguiente formato "dd_mm_yyyy"
 * @returns {string}
 */
export function getDate() {
  let d = new Date();
  const dd = d.getDate();
  const mm = d.getMonth() + 1;
  const yyyy = d.getFullYear();
  const dt = `${dd}_${mm}_${yyyy}`;
  return dt;
}

export function getDateWithFormat(date: number) {
  const d = new Date(date);
  const dd = d.getDate();
  let mm = d.getMonth() + 1;
  const yyyy = d.getFullYear();
  const mmString = mm < 10 ? `0${mm}` : mm;
  const ddString = dd < 10 ? `0${dd}` : dd;
  const dt = `${yyyy}-${mmString}-${ddString}`;
  return dt;
}
