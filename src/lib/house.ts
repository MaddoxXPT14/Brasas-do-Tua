export const HOUSE = {
  name: "Brasas do Tua",
  phoneDisplay: "969 149 087",
  phoneTel: "+351969149087",
  phoneWa: "351969149087",
  street: "Rua Vasco da Gama, n.º 22",
  postal: "5370-481 Mirandela",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=41.48145,-7.183831",
  trip: "https://www.tripadvisor.pt/Restaurant_Review-g2360351-d27983089-Reviews-Brasas_Do_Tua-Mirandela_Braganca_District_Northern_Portugal.html",
};

export const DAY_NAMES = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

/** Minutes-of-day windows. Tuesday is closed. Source: horário público habitual. */
export const WINDOWS: Record<number, Array<[number, number]>> = {
  0: [
    [12 * 60, 15 * 60],
    [19 * 60, 23 * 60],
  ],
  1: [
    [12 * 60, 15 * 60],
    [19 * 60, 23 * 60],
  ],
  2: [],
  3: [
    [12 * 60, 15 * 60],
    [19 * 60, 23 * 60],
  ],
  4: [
    [12 * 60, 15 * 60],
    [19 * 60, 23 * 60],
  ],
  5: [
    [12 * 60, 15 * 60],
    [19 * 60, 23 * 60],
  ],
  6: [
    [12 * 60, 15 * 60],
    [19 * 60, 23 * 60],
  ],
};

export const WEEK_ROWS = [
  { day: 1, label: "Segunda" },
  { day: 2, label: "Terça" },
  { day: 3, label: "Quarta" },
  { day: 4, label: "Quinta" },
  { day: 5, label: "Sexta" },
  { day: 6, label: "Sábado" },
  { day: 0, label: "Domingo" },
];

export function formatRange(start: number, end: number) {
  const h = (m: number) =>
    `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  return `${h(start)}–${h(end)}`;
}

export function lisbonClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const hour = Number(pick("hour"));
  const minute = Number(pick("minute"));
  return {
    weekday: map[pick("weekday")] ?? 0,
    hour,
    minute,
    minutes: hour * 60 + minute,
  };
}

export function lisbonISODate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export type OpenState =
  | { open: true; until: string }
  | { open: false; next: string; closedDay: boolean };

export function openState(date = new Date()): OpenState {
  const { weekday, minutes } = lisbonClock(date);
  const windows = WINDOWS[weekday] ?? [];
  for (const [start, end] of windows) {
    if (minutes >= start && minutes < end) {
      return { open: true, until: formatRange(start, end).split("–")[1] ?? "" };
    }
  }
  if (windows.length === 0) {
    return { open: false, closedDay: true, next: "quarta, às 12:00" };
  }
  const later = windows.find(([start]) => minutes < start);
  if (later) {
    return {
      open: false,
      closedDay: false,
      next: `hoje às ${formatRange(later[0], later[1]).split("–")[0]}`,
    };
  }
  let d = (weekday + 1) % 7;
  for (let i = 0; i < 7; i += 1) {
    const nextWindows = WINDOWS[d] ?? [];
    if (nextWindows.length > 0) {
      const first = nextWindows[0];
      if (!first) break;
      return {
        open: false,
        closedDay: false,
        next: `${DAY_NAMES[d]?.toLowerCase() ?? ""}, às ${formatRange(first[0], first[1]).split("–")[0]}`,
      };
    }
    d = (d + 1) % 7;
  }
  return { open: false, closedDay: false, next: "em breve" };
}

export function addIsoDays(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year || 2026, (month || 1) - 1, day || 1));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isRealDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function nextOpenISO(from = new Date()) {
  const today = lisbonISODate(from);
  const clock = lisbonClock(from);
  let cursor = today;
  for (let step = 0; step < 14; step += 1) {
    const windows = WINDOWS[weekdayFromISO(cursor)] ?? [];
    const last = windows[windows.length - 1];
    const stillToday = cursor === today && last ? clock.minutes < last[1] : cursor !== today;
    if (windows.length > 0 && stillToday) return cursor;
    cursor = addIsoDays(cursor, 1);
  }
  return cursor;
}

export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
export function weekdayFromISO(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return -1;
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function formatLongDay(iso: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}

export function reservationIssue(input: {
  name: string;
  phone: string;
  date: string;
  time: string;
  minDate: string;
}) {
  if (input.name.trim().length < 2) return "Diga-nos o nome da reserva.";
  if (input.phone.replace(/\D/g, "").length < 9) {
    return "Falta o seu telemóvel. Exemplo: 912 345 678.";
  }
  if (!input.date || !isRealDate(input.date)) return "Escolha um dia válido.";
  if (input.date < input.minDate) return "Esse dia já passou.";
  if (weekdayFromISO(input.date) === 2) {
    return "À terça a casa está encerrada. Escolha outro dia.";
  }
  if (!input.time) return "Escolha a hora.";
  return "";
}

export function buildReservation(input: {
  name: string;
  phone: string;
  date: string;
  service: "almoco" | "jantar";
  time: string;
  guests: string;
  note: string;
}) {
  const people = input.guests === "12" ? "12 ou mais" : input.guests;
  return [
    "Olá, Brasas do Tua. Gostava de reservar mesa.",
    `Nome: ${input.name.trim()}`,
    `Telefone: ${input.phone.trim()}`,
    `Dia: ${formatLongDay(input.date)}`,
    `${input.service === "almoco" ? "Almoço" : "Jantar"} às ${input.time}`,
    `Pessoas: ${people}`,
    input.note.trim() ? `Nota: ${input.note.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}



export const LUNCH_TIMES = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"];
export const DINNER_TIMES = [
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
];

export type MenuItem = {
  name: string;
  detail?: string;
  price: string;
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

export const MENU: MenuSection[] = [
  {
    title: "Entradas",
    items: [
      { name: "Alheira transmontana", price: "7,5 €" },
      {
        name: "Tábua",
        detail: "Presunto, chouriço, queijo, marmelada, compota, tostas, azeitonas e amendoins",
        price: "9 €",
      },
      { name: "Torrada de azeite", detail: "Pão caseiro", price: "2 €" },
      { name: "Pão e azeitonas", price: "1 €" },
    ],
  },
  {
    title: "Saladas",
    items: [
      { name: "Salada mista", detail: "Alface, tomate e cebola", price: "2,5 €" },
      { name: "Salada de alface", price: "2 €" },
    ],
  },
  {
    title: "Sopas",
    items: [
      { name: "Sopa de legumes", price: "1,5 €" },
      { name: "Caldo verde", price: "2 €" },
    ],
  },
  {
    title: "Vegetariano",
    items: [
      {
        name: "Bolonhesa de cogumelos",
        detail: "Cogumelos, nabo, alho francês, alho, tomate e cenoura",
        price: "12 €",
      },
      { name: "Omelete de cebola e salsa", price: "7,5 €" },
    ],
  },
  {
    title: "Carne na brasa",
    items: [
      { name: "Posta transmontana", price: "15 €" },
      { name: "Costeleta de vitela", price: "15 €" },
      { name: "Bife de vitela", price: "10 €" },
      { name: "Rodeão", price: "12 €" },
      { name: "Costeleta do cachaço", price: "10 €" },
      { name: "Entremeada", price: "10 €" },
      { name: "Lombo", price: "10 €" },
      { name: "Bife de peru ou frango", price: "10 €" },
      { name: "Grelhada mista", price: "10 €" },
      { name: "Cordeiro no forno", detail: "Ao fim-de-semana", price: "15 €" },
      { name: "Leitão no forno", detail: "Ao fim-de-semana · 5 pedaços", price: "23 €" },
    ],
  },
  {
    title: "Peixe",
    items: [
      { name: "Dourada", price: "12 €" },
      { name: "Salmão", price: "15 €" },
      { name: "Bacalhau", price: "13 €" },
    ],
  },
];

export const VOICES = [
  {
    text: "Comida muito boa, atendimento fantástico e simpático. Um restaurante sem dúvida a voltar.",
    who: "M. G.",
    where: "Avaliação pública",
  },
  {
    text: "A costeleta de vitela na brasa estava muito boa. A sobremesa, maravilhosa.",
    who: "J. V.",
    where: "Avaliação pública",
  },
  {
    text: "À maneira do chef Beto. Formidáveis saberes no fazer e sabores no comer.",
    who: "Visitante",
    where: "Outubro de 2025",
  },
  {
    text: "As carnes grelhadas são um destaque, suculentas e no ponto certo.",
    who: "Família",
    where: "Fevereiro de 2026",
  },
  {
    text: "Grelhadinha mista, só peçam. A torradinha do chef e, para fechar, o pudim caseiro.",
    who: "Família",
    where: "Julho de 2024",
  },
  {
    text: "O senhor Alberto recebe como poucos. A jardineira veio tenra, o pudim era de casa.",
    who: "Casal",
    where: "Agosto de 2024",
  },
];

export const NAV = [
  { href: "#casa", id: "casa", label: "A casa" },
  { href: "#mesa", id: "mesa", label: "A mesa" },
  { href: "#vozes", id: "vozes", label: "Vozes" },
  { href: "#visita", id: "visita", label: "Visita" },
  { href: "#reserva", id: "reserva", label: "Reservar" },
];
