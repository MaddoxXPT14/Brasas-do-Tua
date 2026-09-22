import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as MapPin, i as Menu, o as Flame, r as Phone, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-keLdS0Sn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HOUSE = {
	name: "Brasas do Tua",
	phoneDisplay: "924 485 587",
	phoneTel: "+351924485587",
	phoneWa: "351924485587",
	street: "Rua Vasco da Gama, n.º 22",
	postal: "5370-481 Mirandela",
	mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=41.48145,-7.183831",
	trip: "https://www.tripadvisor.pt/Restaurant_Review-g2360351-d27983089-Reviews-Brasas_Do_Tua-Mirandela_Braganca_District_Northern_Portugal.html"
};
var DAY_NAMES = [
	"Domingo",
	"Segunda",
	"Terça",
	"Quarta",
	"Quinta",
	"Sexta",
	"Sábado"
];
/** Minutes-of-day windows. Tuesday is closed. Source: horário público habitual. */
var WINDOWS = {
	0: [[720, 900], [1140, 1380]],
	1: [[720, 900], [1140, 1380]],
	2: [],
	3: [[720, 900], [1140, 1380]],
	4: [[720, 900], [1140, 1380]],
	5: [[720, 900], [1140, 1380]],
	6: [[720, 900], [1140, 1380]]
};
var WEEK_ROWS = [
	{
		day: 1,
		label: "Segunda"
	},
	{
		day: 2,
		label: "Terça"
	},
	{
		day: 3,
		label: "Quarta"
	},
	{
		day: 4,
		label: "Quinta"
	},
	{
		day: 5,
		label: "Sexta"
	},
	{
		day: 6,
		label: "Sábado"
	},
	{
		day: 0,
		label: "Domingo"
	}
];
function formatRange(start, end) {
	const h = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
	return `${h(start)}–${h(end)}`;
}
function lisbonClock(date = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Europe/Lisbon",
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(date);
	const pick = (type) => parts.find((p) => p.type === type)?.value ?? "";
	const map = {
		Sun: 0,
		Mon: 1,
		Tue: 2,
		Wed: 3,
		Thu: 4,
		Fri: 5,
		Sat: 6
	};
	const hour = Number(pick("hour"));
	const minute = Number(pick("minute"));
	return {
		weekday: map[pick("weekday")] ?? 0,
		hour,
		minute,
		minutes: hour * 60 + minute
	};
}
function lisbonISODate(date = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Europe/Lisbon",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(date);
}
function openState(date = /* @__PURE__ */ new Date()) {
	const { weekday, minutes } = lisbonClock(date);
	const windows = WINDOWS[weekday] ?? [];
	for (const [start, end] of windows) if (minutes >= start && minutes < end) return {
		open: true,
		until: formatRange(start, end).split("–")[1] ?? ""
	};
	if (windows.length === 0) return {
		open: false,
		closedDay: true,
		next: "quarta, às 12:00"
	};
	const later = windows.find(([start]) => minutes < start);
	if (later) return {
		open: false,
		closedDay: false,
		next: `hoje às ${formatRange(later[0], later[1]).split("–")[0]}`
	};
	let d = (weekday + 1) % 7;
	for (let i = 0; i < 7; i += 1) {
		const nextWindows = WINDOWS[d] ?? [];
		if (nextWindows.length > 0) {
			const first = nextWindows[0];
			if (!first) break;
			return {
				open: false,
				closedDay: false,
				next: `${DAY_NAMES[d]?.toLowerCase() ?? ""}, às ${formatRange(first[0], first[1]).split("–")[0]}`
			};
		}
		d = (d + 1) % 7;
	}
	return {
		open: false,
		closedDay: false,
		next: "em breve"
	};
}
function addIsoDays(iso, days) {
	const [year, month, day] = iso.split("-").map(Number);
	const date = new Date(Date.UTC(year || 2026, (month || 1) - 1, day || 1));
	date.setUTCDate(date.getUTCDate() + days);
	return date.toISOString().slice(0, 10);
}
function isRealDate(iso) {
	const [year, month, day] = iso.split("-").map(Number);
	if (!year || !month || !day) return false;
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function nextOpenISO(from = /* @__PURE__ */ new Date()) {
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
var MONTHS = [
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
	"Dezembro"
];
function weekdayFromISO(iso) {
	const [year, month, day] = iso.split("-").map(Number);
	if (!year || !month || !day) return -1;
	return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}
function formatLongDay(iso) {
	return new Intl.DateTimeFormat("pt-PT", {
		weekday: "long",
		day: "numeric",
		month: "long",
		timeZone: "UTC"
	}).format(/* @__PURE__ */ new Date(`${iso}T12:00:00Z`));
}
function reservationIssue(input) {
	if (input.name.trim().length < 2) return "Diga-nos o nome da reserva.";
	if (input.phone.replace(/\D/g, "").length < 9) return "Falta o seu telemóvel. Exemplo: 912 345 678.";
	if (!input.date || !isRealDate(input.date)) return "Escolha um dia válido.";
	if (input.date < input.minDate) return "Esse dia já passou.";
	if (weekdayFromISO(input.date) === 2) return "À terça a casa está encerrada. Escolha outro dia.";
	if (!input.time) return "Escolha a hora.";
	return "";
}
function buildReservation(input) {
	const people = input.guests === "12" ? "12 ou mais" : input.guests;
	return [
		"Olá, Brasas do Tua. Gostava de reservar mesa.",
		`Nome: ${input.name.trim()}`,
		`Telefone: ${input.phone.trim()}`,
		`Dia: ${formatLongDay(input.date)}`,
		`${input.service === "almoco" ? "Almoço" : "Jantar"} às ${input.time}`,
		`Pessoas: ${people}`,
		input.note.trim() ? `Nota: ${input.note.trim()}` : ""
	].filter(Boolean).join("\n");
}
var LUNCH_TIMES = [
	"12:00",
	"12:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30"
];
var DINNER_TIMES = [
	"19:00",
	"19:30",
	"20:00",
	"20:30",
	"21:00",
	"21:30",
	"22:00",
	"22:30"
];
var DISHES = [
	{
		id: "posta",
		index: "01",
		name: "Posta mirandesa",
		fire: "Forno de lenha",
		note: "A posta grossa que quem passa por Mirandela vem procurar. Crosta viva, ponto pedido à mesa.",
		image: "/media/posta.jpg",
		alt: "Posta grelhada, cortada, com batata assada e o forno ao fundo"
	},
	{
		id: "costeleta",
		index: "02",
		name: "Costeleta de vitela",
		fire: "Na brasa",
		note: "Osso, gordura e carvão. É a peça que os clientes voltam a nomear quando falam da casa.",
		image: "/media/costeleta.jpg",
		alt: "Costeleta de vitela com marcas de grelha num prato de ferro"
	},
	{
		id: "grelhado",
		index: "03",
		name: "Grelhado misto",
		fire: "Vaca, porco, peru e alheira",
		note: "Uma travessa para provar o que o chef faz na brasa. Quantidade de casa, para dividir sem pressa.",
		image: "/media/grelhado.jpg",
		alt: "Travessa de grelhado misto com alheira, pimentos e carnes na brasa"
	},
	{
		id: "jardineira",
		index: "04",
		name: "Jardineira",
		fire: "Quando vai ao lume",
		note: "Carne tenra e legumes da horta. Não está todos os dias — pergunte o que o tacho tem.",
		image: "/media/jardineira.jpg",
		alt: "Tigela de barro com jardineira de carne e legumes"
	},
	{
		id: "pao",
		index: "05",
		name: "Pão e torrada do chef",
		fire: "Casa",
		note: "Pão caseiro, azeite e a torradinha que os habituais pedem antes da carne.",
		image: "/media/pao.jpg",
		alt: "Pão caseiro partido, azeite em taça de barro e sal grosso"
	},
	{
		id: "pudim",
		index: "06",
		name: "Pudim caseiro",
		fire: "Para fechar",
		note: "Caramelo e textura de casa. O fecho que as mesas pedem depois da brasa.",
		image: "/media/pudim.jpg",
		alt: "Pudim de caramelo caseiro num prato claro"
	}
];
var VOICES = [
	{
		text: "Comida muito boa, atendimento fantástico e simpático. Um restaurante sem dúvida a voltar.",
		who: "M. G.",
		where: "Avaliação pública"
	},
	{
		text: "A costeleta de vitela na brasa estava muito boa. A sobremesa, maravilhosa.",
		who: "J. V.",
		where: "Avaliação pública"
	},
	{
		text: "À maneira do chef Beto. Formidáveis saberes no fazer e sabores no comer.",
		who: "Visitante",
		where: "Outubro de 2025"
	},
	{
		text: "As carnes grelhadas são um destaque, suculentas e no ponto certo.",
		who: "Família",
		where: "Fevereiro de 2026"
	},
	{
		text: "Grelhadinha mista, só peçam. A torradinha do chef e, para fechar, o pudim caseiro.",
		who: "Família",
		where: "Julho de 2024"
	},
	{
		text: "O senhor Alberto recebe como poucos. A jardineira veio tenra, o pudim era de casa.",
		who: "Casal",
		where: "Agosto de 2024"
	}
];
var NAV = [
	{
		href: "#casa",
		id: "casa",
		label: "A casa"
	},
	{
		href: "#mesa",
		id: "mesa",
		label: "A mesa"
	},
	{
		href: "#vozes",
		id: "vozes",
		label: "Vozes"
	},
	{
		href: "#visita",
		id: "visita",
		label: "Visita"
	},
	{
		href: "#reserva",
		id: "reserva",
		label: "Reservar"
	}
];
var fieldClass = "h-12 w-full rounded-md border border-line bg-ink px-3 text-cream placeholder:text-mute/70";
function HousePage() {
	const [openNav, setOpenNav] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)("casa");
	const [dishId, setDishId] = (0, import_react.useState)(DISHES[0]?.id ?? "posta");
	const [voice, setVoice] = (0, import_react.useState)(0);
	const [status, setStatus] = (0, import_react.useState)(null);
	const [today, setToday] = (0, import_react.useState)(null);
	const dish = DISHES.find((item) => item.id === dishId) ?? DISHES[0];
	const quote = VOICES[voice] ?? VOICES[0];
	(0, import_react.useEffect)(() => {
		const tick = () => {
			setStatus(openState());
			setToday(lisbonClock().weekday);
		};
		tick();
		const id = window.setInterval(tick, 3e4);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const id = window.setInterval(() => {
			setVoice((current) => (current + 1) % VOICES.length);
		}, 8e3);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const nodes = NAV.map((item) => document.getElementById(item.id)).filter((node) => Boolean(node));
		const observer = new IntersectionObserver((entries) => {
			const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
			if (visible?.target.id) setActive(visible.target.id);
		}, {
			rootMargin: "-45% 0px -45% 0px",
			threshold: [.15, .4]
		});
		nodes.forEach((node) => observer.observe(node));
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "topo",
		className: "min-h-svh bg-ink text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#casa",
				className: "sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-2 focus:text-ink",
				children: "Saltar para o conteúdo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "fixed inset-x-0 top-0 z-40 border-b border-line/80 bg-ink/90 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#topo",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
								className: "size-5 text-ember",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg leading-none tracking-tight",
								children: "Brasas do Tua"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden items-center gap-6 lg:flex",
							"aria-label": "Secções",
							children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: item.href,
								className: `text-sm ${active === item.id ? "text-cream" : "text-mute"}`,
								children: item.label
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${HOUSE.phoneTel}`,
									className: "hidden h-11 items-center gap-2 px-2 text-sm text-cream sm:inline-flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
										className: "size-4 text-ember",
										"aria-hidden": "true"
									}), HOUSE.phoneDisplay]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#reserva",
									className: "inline-flex h-11 items-center rounded-md bg-ember px-4 text-sm font-medium text-ink",
									children: "Reservar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex size-11 items-center justify-center rounded-md border border-line lg:hidden",
									"aria-expanded": openNav,
									"aria-label": openNav ? "Fechar menu" : "Abrir menu",
									onClick: () => setOpenNav((value) => !value),
									children: openNav ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								})
							]
						})
					]
				}), openNav ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "border-t border-line px-5 py-3 lg:hidden",
					"aria-label": "Menu",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.href,
						className: "flex h-12 items-center border-b border-line/70 text-base last:border-b-0",
						onClick: () => setOpenNav(false),
						children: item.label
					}, item.id))
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative flex min-h-svh items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/media/brasa.jpg",
							alt: "Posta a grelhar sobre brasas vivas",
							className: "absolute inset-0 h-full w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-shade absolute inset-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mx-auto w-full max-w-6xl px-5 pt-28 pb-16 md:pb-20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-4 text-sm tracking-widest text-flame uppercase",
									children: "Mirandela · Trás-os-Montes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "max-w-3xl font-display text-6xl leading-none font-medium tracking-tight text-cream md:text-8xl",
									children: "Brasas do Tua"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-6 max-w-xl text-lg text-cream md:text-xl",
									children: "Grelhados e forno de lenha. Uma sala pequena, o chef à mesa, o vale do Tua à porta."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "#reserva",
											className: "inline-flex h-12 items-center justify-center rounded-md bg-ember px-5 font-medium text-ink",
											children: "Pedir mesa"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: "#mesa",
											className: "inline-flex h-12 items-center justify-center rounded-md border border-cream/30 px-5 text-cream",
											children: "Ver a mesa"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status })
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "casa",
					className: "scroll-mt-20 border-t border-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
							className: "md:col-span-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/media/sala.jpg",
								alt: "Sala de pedra e madeira, com o lume ao fundo",
								className: "w-full rounded-lg object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
								className: "mt-3 text-sm text-mute",
								children: "O espírito da casa: mesa curta e lume ao fundo."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-5 md:pt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm tracking-widest text-ember uppercase",
									children: "A casa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-4xl leading-tight md:text-5xl",
									children: "O chef cozinha e recebe."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 text-lg text-mute",
									children: "Na Rua Vasco da Gama, em Mirandela, a sala é curta de propósito. Quem entra encontra o chef Beto — o senhor Alberto — a tratar da brasa e da mesa ao mesmo tempo."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-lg text-mute",
									children: "A cozinha é transmontana e directa: posta no forno de lenha, grelhados, pão e azeite de casa, pudim para fechar. Os temperos são os da região, sem disfarce."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-8 space-y-4 border-t border-line pt-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
											title: "Sala pequena",
											text: "Serviço atento, mesa a mesa."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
											title: "Brasa e forno",
											text: "Posta, costeleta, alheira, grelhado misto."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
											title: "Terça encerrada",
											text: "Nos outros dias, almoço e jantar."
										})
									]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "mesa",
					className: "scroll-mt-20 bg-paper text-ink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm tracking-widest text-ember-deep uppercase",
									children: "A mesa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-4xl leading-tight md:text-5xl",
									children: "O que a casa costuma pôr ao lume."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 text-lg text-ink-soft",
									children: "A ementa segue o forno e o mercado. Não há preços fixos neste sítio — pergunte ao chef. Estas são as peças que as mesas pedem."
								}),
								dish ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
									className: "mt-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: dish.image,
										alt: dish.alt,
										className: "aspect-4/3 w-full rounded-lg object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
										className: "mt-3 text-sm text-ink-soft",
										children: [dish.name, " · fotografia de ambiente. A apresentação muda com o dia."]
									})]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-7 md:pt-16",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: DISHES.map((item) => {
								const selected = item.id === dish?.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "border-b border-line-paper",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setDishId(item.id),
										className: "flex w-full items-start gap-4 py-5 text-left",
										"aria-pressed": selected,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-8 pt-1 font-display text-ember-deep",
											children: item.index
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-display text-2xl",
													children: item.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm text-ink-soft",
													children: item.fire
												})]
											}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-2 block text-base text-ink-soft",
												children: item.note
											}) : null]
										})]
									})
								}, item.id);
							}) })
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "vozes",
					className: "scroll-mt-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-6xl px-5 py-20 md:py-28",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-end justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm tracking-widest text-ember uppercase",
									children: "Vozes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-display text-4xl leading-tight md:text-5xl",
									children: "O que se diz da casa."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: HOUSE.trip,
									target: "_blank",
									rel: "noreferrer",
									className: "text-sm text-flame underline decoration-ember/50 underline-offset-4",
									children: "5,0 no Tripadvisor"
								})]
							}),
							quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
								className: "mt-12 max-w-4xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
									className: "font-display text-3xl leading-snug md:text-5xl",
									children: [
										"“",
										quote.text,
										"”"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
									className: "mt-6 text-mute",
									children: [
										quote.who,
										" · ",
										quote.where
									]
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 flex flex-wrap gap-2",
								role: "tablist",
								"aria-label": "Avaliações",
								children: VOICES.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									role: "tab",
									"aria-selected": index === voice,
									className: `h-11 min-w-11 rounded-md border px-3 text-sm ${index === voice ? "border-ember bg-ember text-ink" : "border-line text-mute"}`,
									onClick: () => setVoice(index),
									children: String(index + 1).padStart(2, "0")
								}, item.text))
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "visita",
					className: "scroll-mt-20 border-t border-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:py-28",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm tracking-widest text-ember uppercase",
								children: "Visita"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-4xl leading-tight md:text-5xl",
								children: "Horário habitual."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-mute",
								children: "Almoço e jantar, excepto à terça. Em feriados, confirme pelo telefone."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-8",
								children: WEEK_ROWS.map((row) => {
									const windows = WINDOWS[row.day] ?? [];
									const isToday = today === row.day;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: `flex items-center justify-between gap-4 border-b border-line py-3 ${isToday ? "text-cream" : "text-mute"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-3",
											children: [
												isToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "size-1.5 rounded-full bg-ember",
													"aria-hidden": "true"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5" }),
												row.label,
												isToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs tracking-wide text-flame uppercase",
													children: "Hoje"
												}) : null
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: windows.length === 0 ? "Encerrado" : windows.map((window) => formatRange(window[0], window[1])).join(" · ") })]
									}, row.label);
								})
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-line bg-panel p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										className: "mt-1 size-5 shrink-0 text-ember",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-lg",
										children: HOUSE.street
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-mute",
										children: HOUSE.postal
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${HOUSE.phoneTel}`,
									className: "mt-5 flex h-12 items-center gap-3 text-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
										className: "size-5 text-ember",
										"aria-hidden": "true"
									}), HOUSE.phoneDisplay]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: HOUSE.mapsUrl,
									target: "_blank",
									rel: "noreferrer",
									className: "mt-4 inline-flex h-12 items-center rounded-md bg-cream px-4 font-medium text-ink",
									children: "Como chegar"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: "Mapa de Brasas do Tua, Rua Vasco da Gama 22, Mirandela",
							src: "https://www.openstreetmap.org/export/embed.html?bbox=-7.198%2C41.474%2C-7.170%2C41.489&layer=mapnik&marker=41.48145%2C-7.183831",
							className: "mt-4 h-72 w-full rounded-lg border border-line",
							loading: "lazy"
						})] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reserve, { todayName: today === null ? null : DAY_NAMES[today] })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Brasas do Tua"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-mute",
						children: [
							HOUSE.street,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							HOUSE.postal
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-sm text-sm text-mute",
						children: "Cozinha de brasa em Mirandela. Reserve por telefone ou WhatsApp — a mesa só fica marcada quando a casa confirmar."
					})]
				})
			})
		]
	});
}
function Fact({ title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-medium text-cream",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-mute",
		children: text
	})] });
}
function StatusChip({ status }) {
	if (!status) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-mute sm:ml-2",
		children: "Horário de Mirandela"
	});
	if (status.open) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-cream sm:ml-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-2 inline-block size-2 rounded-full bg-flame align-middle" }),
			"Aberto até às ",
			status.until
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-mute sm:ml-2",
		children: [
			status.closedDay ? "Hoje encerrado" : "Fechado agora",
			" · abre ",
			status.next
		]
	});
}
function Reserve({ todayName }) {
	const minDate = (0, import_react.useMemo)(() => lisbonISODate(), []);
	const opening = (0, import_react.useMemo)(() => nextOpenISO(), []);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [year, setYear] = (0, import_react.useState)(opening.slice(0, 4));
	const [month, setMonth] = (0, import_react.useState)(String(Number(opening.slice(5, 7))));
	const [day, setDay] = (0, import_react.useState)(String(Number(opening.slice(8, 10))));
	const [service, setService] = (0, import_react.useState)("jantar");
	const [time, setTime] = (0, import_react.useState)("20:00");
	const [guests, setGuests] = (0, import_react.useState)("2");
	const [note, setNote] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)("");
	const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
	const years = [Number(minDate.slice(0, 4)), Number(minDate.slice(0, 4)) + 1];
	const times = service === "almoco" ? LUNCH_TIMES : DINNER_TIMES;
	const closedTuesday = date ? weekdayFromISO(date) === 2 : false;
	const message = reservationIssue({
		name,
		phone,
		date,
		time,
		minDate
	}) ? "" : buildReservation({
		name,
		phone,
		date,
		service,
		time,
		guests,
		note
	});
	const waHref = message ? `https://wa.me/${HOUSE.phoneWa}?text=${encodeURIComponent(message)}` : "#reserva";
	(0, import_react.useEffect)(() => {
		if (!times.includes(time)) setTime(times[0] ?? "");
	}, [
		service,
		time,
		times
	]);
	function openWhatsApp(event) {
		event.preventDefault();
		const form = event.currentTarget instanceof HTMLFormElement ? event.currentTarget : null;
		const data = form ? new FormData(form) : null;
		const guestName = String(data?.get("name") ?? name);
		const guestPhone = String(data?.get("tel") ?? phone).replace(/[^\d+\s]/g, "");
		if (guestName !== name) setName(guestName);
		if (guestPhone !== phone) setPhone(guestPhone);
		const problem = reservationIssue({
			name: guestName,
			phone: guestPhone,
			date,
			time,
			minDate
		});
		if (problem) {
			setError(problem);
			setDraft("");
			form?.querySelector("input[name=\"tel\"]")?.focus();
			return;
		}
		const text = buildReservation({
			name: guestName,
			phone: guestPhone,
			date,
			service,
			time,
			guests,
			note
		});
		const url = `https://wa.me/${HOUSE.phoneWa}?text=${encodeURIComponent(text)}`;
		setError("");
		setDraft(text);
		if (!(window.parent !== window)) {
			const popup = window.open(url, "_blank");
			if (popup && !popup.closed) {
				popup.opener = null;
				return;
			}
		}
		const link = document.createElement("a");
		link.href = url;
		link.target = "_top";
		link.rel = "noopener noreferrer";
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.setTimeout(() => {
			document.getElementById("pedido-whatsapp")?.scrollIntoView({ block: "center" });
		}, 400);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "reserva",
		className: "scroll-mt-20 border-t border-line bg-panel",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-12 md:py-28",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm tracking-widest text-ember uppercase",
						children: "Reservar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl leading-tight md:text-5xl",
						children: "Peça a mesa ao chef."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 text-lg text-mute",
						children: [
							"A sala é pequena. O pedido abre no WhatsApp do ",
							HOUSE.phoneDisplay,
							". A reserva só fica feita quando a casa responder."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-sm text-mute",
						children: [todayName ? `Em Mirandela é ${todayName.toLowerCase()}. ` : "", "Para grupos grandes, o telefone é mais rápido."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `tel:${HOUSE.phoneTel}`,
						className: "mt-6 inline-flex h-12 items-center gap-2 rounded-md border border-line px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
							className: "size-4 text-ember",
							"aria-hidden": "true"
						}), "Ligar agora"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: openWhatsApp,
				className: "reserve-form md:col-span-7",
				noValidate: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Nome", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "name",
									className: `${fieldClass} mt-2`,
									value: name,
									onChange: (event) => setName(event.target.value),
									autoComplete: "name",
									placeholder: "O seu nome",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["O seu telemóvel", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "tel",
									type: "tel",
									className: `${fieldClass} mt-2`,
									value: phone,
									onChange: (event) => setPhone(event.target.value.replace(/[^\d+\s]/g, "").replace(/\s+/g, " ").trimStart().slice(0, 16)),
									autoComplete: "tel",
									inputMode: "tel",
									placeholder: "912 345 678",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: "Dia"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 grid grid-cols-3 gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												"aria-label": "Dia",
												className: fieldClass,
												value: day,
												onChange: (event) => setDay(event.target.value),
												children: Array.from({ length: 31 }, (_, index) => String(index + 1)).map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value,
													children: value
												}, value))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												"aria-label": "Mês",
												className: fieldClass,
												value: month,
												onChange: (event) => setMonth(event.target.value),
												children: MONTHS.map((label, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: String(index + 1),
													children: label
												}, label))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												"aria-label": "Ano",
												className: fieldClass,
												value: year,
												onChange: (event) => setYear(event.target.value),
												children: years.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: String(value),
													children: value
												}, value))
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-mute",
										children: isRealDate(date) ? formatLongDay(date) : "Esse dia não existe."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: ["Pessoas", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: `${fieldClass} mt-2`,
									value: guests,
									onChange: (event) => setGuests(event.target.value),
									children: Array.from({ length: 12 }, (_, index) => String(index + 1)).map((count) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: count,
										children: [count, count === "12" ? " ou mais" : ""]
									}, count))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "text-sm",
							children: "Serviço"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid grid-cols-2 gap-2",
							children: [["almoco", "Almoço"], ["jantar", "Jantar"]].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": service === value,
								onClick: () => setService(value),
								className: `h-12 rounded-md border ${service === value ? "border-ember bg-ember text-ink" : "border-line text-cream"}`,
								children: label
							}, value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block text-sm",
						children: ["Hora", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: `${fieldClass} mt-2`,
							value: time,
							onChange: (event) => setTime(event.target.value),
							children: times.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: slot,
								children: slot
							}, slot))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 block text-sm",
						children: ["Nota para o chef", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "mt-2 min-h-28 w-full rounded-md border border-line bg-ink px-3 py-3 text-cream placeholder:text-mute/70",
							value: note,
							onChange: (event) => setNote(event.target.value),
							placeholder: "Alergias, cadeira de bebé, ocasião…"
						})]
					}),
					closedTuesday ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-flame",
						role: "status",
						children: "À terça a casa está encerrada."
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-flame",
						role: "alert",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "mt-6 inline-flex h-12 items-center rounded-md bg-ember px-5 font-medium text-ink",
						children: "Abrir pedido no WhatsApp"
					}),
					draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						id: "pedido-whatsapp",
						className: "mt-6 rounded-lg border border-line bg-ink p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-cream",
								children: [
									"Se o WhatsApp não abriu, use o link ou copie a mensagem para ",
									HOUSE.phoneDisplay,
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: waHref,
								target: "_top",
								rel: "noopener noreferrer",
								className: "mt-3 inline-flex h-12 items-center rounded-md bg-ember px-4 font-medium text-ink",
								children: "Abrir WhatsApp agora"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-4 whitespace-pre-wrap font-sans text-sm text-mute",
								children: draft
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-3 h-11 rounded-md border border-line px-4 text-sm",
								onClick: () => {
									navigator.clipboard?.writeText(draft);
								},
								children: "Copiar mensagem"
							})
						]
					}) : null
				]
			})]
		})
	});
}
var SplitComponent = HousePage;
//#endregion
export { SplitComponent as component };
