import { useEffect, useMemo, useState } from "react";
import { MapPin, Menu, Phone, X } from "lucide-react";
import {
  DAY_NAMES,
  DINNER_TIMES,
  DISHES,
  HOUSE,
  LUNCH_TIMES,
  NAV,
  VOICES,
  WEEK_ROWS,
  WINDOWS,
  formatRange,
  lisbonClock,
  lisbonISODate,
  openState,
  weekdayFromISO,
  reservationIssue,
  buildReservation,
  nextOpenISO,
  isRealDate,
  formatLongDay,
  MONTHS,
  type OpenState,
} from "@/lib/house";

const fieldClass =
  "h-12 w-full rounded-md border border-line bg-ink px-3 text-cream placeholder:text-mute/70";

export function HousePage() {
  const [openNav, setOpenNav] = useState(false);
  const [active, setActive] = useState("casa");
  const [dishId, setDishId] = useState(DISHES[0]?.id ?? "posta");
  const [voice, setVoice] = useState(0);
  const [status, setStatus] = useState<OpenState | null>(null);
  const [today, setToday] = useState<number | null>(null);

  const dish = DISHES.find((item) => item.id === dishId) ?? DISHES[0];
  const quote = VOICES[voice] ?? VOICES[0];

  useEffect(() => {
    const tick = () => {
      setStatus(openState());
      setToday(lisbonClock().weekday);
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    const id = window.setInterval(() => {
      setVoice((current) => (current + 1) % VOICES.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const nodes = NAV.map((item) => document.getElementById(item.id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="topo" className="min-h-svh bg-ink text-cream">
      <a
        href="#casa"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-2 focus:text-ink"
      >
        Saltar para o conteúdo
      </a>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line/80 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#topo" className="flex items-center">
            <img
              src="/media/logo.jpg"
              alt="Brasas do Tua"
              className="h-12 w-auto rounded-sm bg-white px-1.5"
            />
          </a>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Secções">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`text-sm ${active === item.id ? "text-cream" : "text-mute"}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${HOUSE.phoneTel}`}
              className="hidden h-11 items-center gap-2 px-2 text-sm text-cream sm:inline-flex"
            >
              <Phone className="size-4 text-ember" aria-hidden="true" />
              {HOUSE.phoneDisplay}
            </a>
            <a
              href="#reserva"
              className="inline-flex h-11 items-center rounded-md bg-ember px-4 text-sm font-medium text-ink"
            >
              Reservar
            </a>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-md border border-line lg:hidden"
              aria-expanded={openNav}
              aria-label={openNav ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpenNav((value) => !value)}
            >
              {openNav ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {openNav ? (
          <nav className="border-t border-line px-5 py-3 lg:hidden" aria-label="Menu">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="flex h-12 items-center border-b border-line/70 text-base last:border-b-0"
                onClick={() => setOpenNav(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>

      <main>
        <section className="relative flex min-h-svh items-end">
          <img
            src="/media/brasa.jpg"
            alt="Posta a grelhar sobre brasas vivas"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="hero-shade absolute inset-0" />
          <div className="relative mx-auto w-full max-w-6xl px-5 pt-28 pb-16 md:pb-20">
            <p className="mb-4 text-sm tracking-widest text-flame uppercase">
              Mirandela · Trás-os-Montes
            </p>
            <h1 className="max-w-3xl font-display text-6xl leading-none font-medium tracking-tight text-cream md:text-8xl">
              Brasas do Tua
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream md:text-xl">
              Grelhados e forno de lenha. Uma sala pequena, o chef à mesa, o vale
              do Tua à porta.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#reserva"
                className="inline-flex h-12 items-center justify-center rounded-md bg-ember px-5 font-medium text-ink"
              >
                Pedir mesa
              </a>
              <a
                href="#mesa"
                className="inline-flex h-12 items-center justify-center rounded-md border border-cream/30 px-5 text-cream"
              >
                Ver a mesa
              </a>
              <StatusChip status={status} />
            </div>
          </div>
        </section>

        <section id="casa" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
            <figure className="md:col-span-7">
              <img
                src="/media/sala.jpg"
                alt="Sala do restaurante, com mesas postas, tecto de madeira e a oliveira na parede"
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
              <figcaption className="mt-3 text-sm text-mute">
                A sala, com as mesas postas e a oliveira na parede.
              </figcaption>
            </figure>
            <div className="md:col-span-5 md:pt-6">
              <p className="text-sm tracking-widest text-ember uppercase">A casa</p>
              <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
                O chef cozinha e recebe.
              </h2>
              <p className="mt-5 text-lg text-mute">
                Na Rua Vasco da Gama, em Mirandela, a sala é curta de propósito.
                Quem entra encontra o chef Beto — o senhor Alberto — a tratar da
                brasa e da mesa ao mesmo tempo.
              </p>
              <p className="mt-4 text-lg text-mute">
                A cozinha é transmontana e directa: posta no forno de lenha,
                grelhados, pão e azeite de casa, pudim para fechar. Os temperos
                são os da região, sem disfarce.
              </p>
              <ul className="mt-8 space-y-4 border-t border-line pt-6">
                <Fact title="Sala pequena" text="Serviço atento, mesa a mesa." />
                <Fact title="Brasa e forno" text="Posta, costeleta, alheira, grelhado misto." />
                <Fact title="Terça encerrada" text="Nos outros dias, almoço e jantar." />
              </ul>
            </div>
          </div>
        </section>

        <section id="mesa" className="scroll-mt-20 bg-paper text-ink">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:py-28">
            <div className="md:col-span-5">
              <p className="text-sm tracking-widest text-ember-deep uppercase">A mesa</p>
              <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
                O que a casa costuma pôr ao lume.
              </h2>
              <p className="mt-5 text-lg text-ink-soft">
                A ementa segue o forno e o mercado. Não há preços fixos neste
                sítio — pergunte ao chef. Estas são as peças que as mesas pedem.
              </p>
              {dish ? (
                <figure className="mt-8">
                  <img
                    src={dish.image}
                    alt={dish.alt}
                    className="aspect-4/3 w-full rounded-lg object-cover"
                  />
                  <figcaption className="mt-3 text-sm text-ink-soft">
                    {dish.name} · fotografia de ambiente. A apresentação muda com o dia.
                  </figcaption>
                </figure>
              ) : null}
            </div>
            <div className="md:col-span-7 md:pt-16">
              <ul>
                {DISHES.map((item) => {
                  const selected = item.id === dish?.id;
                  return (
                    <li key={item.id} className="border-b border-line-paper">
                      <button
                        type="button"
                        onClick={() => setDishId(item.id)}
                        className="flex w-full items-start gap-4 py-5 text-left"
                        aria-pressed={selected}
                      >
                        <span className="w-8 pt-1 font-display text-ember-deep">
                          {item.index}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <span className="font-display text-2xl">{item.name}</span>
                            <span className="text-sm text-ink-soft">{item.fire}</span>
                          </span>
                          {selected ? (
                            <span className="mt-2 block text-base text-ink-soft">{item.note}</span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        <section id="vozes" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm tracking-widest text-ember uppercase">Vozes</p>
                <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
                  O que se diz da casa.
                </h2>
              </div>
              <a
                href={HOUSE.trip}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-flame underline decoration-ember/50 underline-offset-4"
              >
                5,0 no Tripadvisor
              </a>
            </div>
            {quote ? (
              <figure className="mt-12 max-w-4xl">
                <blockquote className="font-display text-3xl leading-snug md:text-5xl">
                  “{quote.text}”
                </blockquote>
                <figcaption className="mt-6 text-mute">
                  {quote.who} · {quote.where}
                </figcaption>
              </figure>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Avaliações">
              {VOICES.map((item, index) => (
                <button
                  key={item.text}
                  type="button"
                  role="tab"
                  aria-selected={index === voice}
                  className={`h-11 min-w-11 rounded-md border px-3 text-sm ${
                    index === voice
                      ? "border-ember bg-ember text-ink"
                      : "border-line text-mute"
                  }`}
                  onClick={() => setVoice(index)}
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="visita" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
            <div>
              <p className="text-sm tracking-widest text-ember uppercase">Visita</p>
              <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
                Horário habitual.
              </h2>
              <p className="mt-4 text-mute">
                Almoço e jantar, excepto à terça. Em feriados, confirme pelo telefone.
              </p>
              <ul className="mt-8">
                {WEEK_ROWS.map((row) => {
                  const windows = WINDOWS[row.day] ?? [];
                  const isToday = today === row.day;
                  return (
                    <li
                      key={row.label}
                      className={`flex items-center justify-between gap-4 border-b border-line py-3 ${
                        isToday ? "text-cream" : "text-mute"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {isToday ? (
                          <span className="size-1.5 rounded-full bg-ember" aria-hidden="true" />
                        ) : (
                          <span className="size-1.5" />
                        )}
                        {row.label}
                        {isToday ? <span className="text-xs tracking-wide text-flame uppercase">Hoje</span> : null}
                      </span>
                      <span>
                        {windows.length === 0
                          ? "Encerrado"
                          : windows.map((window) => formatRange(window[0], window[1])).join(" · ")}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <div className="rounded-lg border border-line bg-panel p-6">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-1 size-5 shrink-0 text-ember" aria-hidden="true" />
                  <span>
                    <span className="block text-lg">{HOUSE.street}</span>
                    <span className="text-mute">{HOUSE.postal}</span>
                  </span>
                </p>
                <a
                  href={`tel:${HOUSE.phoneTel}`}
                  className="mt-5 flex h-12 items-center gap-3 text-lg"
                >
                  <Phone className="size-5 text-ember" aria-hidden="true" />
                  {HOUSE.phoneDisplay}
                </a>
                <a
                  href={HOUSE.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-12 items-center rounded-md bg-cream px-4 font-medium text-ink"
                >
                  Como chegar
                </a>
              </div>
              <iframe
                title="Mapa de Brasas do Tua, Rua Vasco da Gama 22, Mirandela"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-7.198%2C41.474%2C-7.170%2C41.489&layer=mapnik&marker=41.48145%2C-7.183831"
                className="mt-4 h-72 w-full rounded-lg border border-line"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <Reserve todayName={today === null ? null : DAY_NAMES[today]} />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <img
              src="/media/logo.jpg"
              alt="Brasas do Tua"
              className="h-16 w-auto rounded-sm bg-white px-2"
            />
            <p className="mt-2 text-sm text-mute">
              {HOUSE.street}
              <br />
              {HOUSE.postal}
            </p>
          </div>
          <p className="max-w-sm text-sm text-mute">
            Cozinha de brasa em Mirandela. Reserve por telefone ou WhatsApp — a
            mesa só fica marcada quando a casa confirmar.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Fact({ title, text }: { title: string; text: string }) {
  return (
    <li>
      <p className="font-medium text-cream">{title}</p>
      <p className="text-mute">{text}</p>
    </li>
  );
}

function StatusChip({ status }: { status: OpenState | null }) {
  if (!status) {
    return (
      <p className="text-sm text-mute sm:ml-2">Horário de Mirandela</p>
    );
  }
  if (status.open) {
    return (
      <p className="text-sm text-cream sm:ml-2">
        <span className="mr-2 inline-block size-2 rounded-full bg-flame align-middle" />
        Aberto até às {status.until}
      </p>
    );
  }
  return (
    <p className="text-sm text-mute sm:ml-2">
      {status.closedDay ? "Hoje encerrado" : "Fechado agora"} · abre {status.next}
    </p>
  );
}

function Reserve({ todayName }: { todayName: string | null }) {
  const minDate = useMemo(() => lisbonISODate(), []);
  const opening = useMemo(() => nextOpenISO(), []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [year, setYear] = useState(opening.slice(0, 4));
  const [month, setMonth] = useState(String(Number(opening.slice(5, 7))));
  const [day, setDay] = useState(String(Number(opening.slice(8, 10))));
  const [service, setService] = useState<"almoco" | "jantar">("jantar");
  const [time, setTime] = useState("20:00");
  const [guests, setGuests] = useState("2");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const years = [Number(minDate.slice(0, 4)), Number(minDate.slice(0, 4)) + 1];

  const times = service === "almoco" ? LUNCH_TIMES : DINNER_TIMES;
  const closedTuesday = date ? weekdayFromISO(date) === 2 : false;
  const issue = reservationIssue({ name, phone, date, time, minDate });
  const message = issue
    ? ""
    : buildReservation({ name, phone, date, service, time, guests, note });
  const waHref = message
    ? `https://wa.me/${HOUSE.phoneWa}?text=${encodeURIComponent(message)}`
    : "#reserva";

  useEffect(() => {
    if (!times.includes(time)) setTime(times[0] ?? "");
  }, [service, time, times]);

  function openWhatsApp(event: {
    preventDefault(): void;
    currentTarget: EventTarget | null;
  }) {
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
      minDate,
    });
    if (problem) {
      setError(problem);
      setDraft("");
      form?.querySelector<HTMLInputElement>('input[name="tel"]')?.focus();
      return;
    }
    const text = buildReservation({
      name: guestName,
      phone: guestPhone,
      date,
      service,
      time,
      guests,
      note,
    });
    const url = `https://wa.me/${HOUSE.phoneWa}?text=${encodeURIComponent(text)}`;
    setError("");
    setDraft(text);
    const embedded = window.parent !== window;
    if (!embedded) {
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

  return (
    <section id="reserva" className="scroll-mt-20 border-t border-line bg-panel">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5">
          <p className="text-sm tracking-widest text-ember uppercase">Reservar</p>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
            Peça a mesa ao chef.
          </h2>
          <p className="mt-5 text-lg text-mute">
            A sala é pequena. O pedido abre no WhatsApp do {HOUSE.phoneDisplay}.
            A reserva só fica feita quando a casa responder.
          </p>
          <p className="mt-6 text-sm text-mute">
            {todayName ? `Em Mirandela é ${todayName.toLowerCase()}. ` : ""}
            Para grupos grandes, o telefone é mais rápido.
          </p>
          <a
            href={`tel:${HOUSE.phoneTel}`}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-md border border-line px-4"
          >
            <Phone className="size-4 text-ember" aria-hidden="true" />
            Ligar agora
          </a>
        </div>
        <form
          onSubmit={openWhatsApp}
          className="reserve-form md:col-span-7"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Nome
              <input
                name="name"
                className={`${fieldClass} mt-2`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="O seu nome"
                required
              />
            </label>
            <label className="block text-sm">
              O seu telemóvel
              <input
                name="tel"
                type="tel"
                className={`${fieldClass} mt-2`}
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                      .replace(/[^\d+\s]/g, "")
                      .replace(/\s+/g, " ")
                      .trimStart()
                      .slice(0, 16),
                  )
                }
                autoComplete="tel"
                inputMode="tel"
                placeholder="912 345 678"
                required
              />
            </label>
            <div className="sm:col-span-2">
              <p className="text-sm">Dia</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <select
                  aria-label="Dia"
                  className={fieldClass}
                  value={day}
                  onChange={(event) => setDay(event.target.value)}
                >
                  {Array.from({ length: 31 }, (_, index) => String(index + 1)).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Mês"
                  className={fieldClass}
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                >
                  {MONTHS.map((label, index) => (
                    <option key={label} value={String(index + 1)}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Ano"
                  className={fieldClass}
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                >
                  {years.map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-sm text-mute">
                {isRealDate(date) ? formatLongDay(date) : "Esse dia não existe."}
              </p>
            </div>
            <label className="block text-sm">
              Pessoas
              <select
                className={`${fieldClass} mt-2`}
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
              >
                {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((count) => (
                  <option key={count} value={count}>
                    {count}
                    {count === "12" ? " ou mais" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <fieldset className="mt-4">
            <legend className="text-sm">Serviço</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ["almoco", "Almoço"],
                  ["jantar", "Jantar"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={service === value}
                  onClick={() => setService(value)}
                  className={`h-12 rounded-md border ${
                    service === value
                      ? "border-ember bg-ember text-ink"
                      : "border-line text-cream"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="mt-4 block text-sm">
            Hora
            <select
              className={`${fieldClass} mt-2`}
              value={time}
              onChange={(event) => setTime(event.target.value)}
            >
              {times.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-sm">
            Nota para o chef
            <textarea
              className="mt-2 min-h-28 w-full rounded-md border border-line bg-ink px-3 py-3 text-cream placeholder:text-mute/70"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Alergias, cadeira de bebé, ocasião…"
            />
          </label>
          {closedTuesday ? (
            <p className="mt-4 text-sm text-flame" role="status">
              À terça a casa está encerrada.
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 text-sm text-flame" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-6 inline-flex h-12 items-center rounded-md bg-ember px-5 font-medium text-ink"
          >
            Abrir pedido no WhatsApp
          </button>
          {draft ? (
            <div id="pedido-whatsapp" className="mt-6 rounded-lg border border-line bg-ink p-4">
              <p className="text-sm text-cream">
                Se o WhatsApp não abriu, use o link ou copie a mensagem para {HOUSE.phoneDisplay}.
              </p>
              <a
                href={waHref}
                target="_top"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-12 items-center rounded-md bg-ember px-4 font-medium text-ink"
              >
                Abrir WhatsApp agora
              </a>
              <pre className="mt-4 whitespace-pre-wrap font-sans text-sm text-mute">{draft}</pre>
              <button
                type="button"
                className="mt-3 h-11 rounded-md border border-line px-4 text-sm"
                onClick={() => {
                  void navigator.clipboard?.writeText(draft);
                }}
              >
                Copiar mensagem
              </button>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
