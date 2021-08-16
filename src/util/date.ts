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

export function getDate() {
  let d = new Date();
  const dd = d.getDate();
  const mm = d.getMonth() + 1;
  const yyyy = d.getFullYear();
  const dt = `${dd}_${mm}_${yyyy}`;
  return dt;
}
