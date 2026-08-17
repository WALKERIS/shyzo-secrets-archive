import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { Dread } from "@/components/Dread";
import { unlockSite } from "@/lib/gate.functions";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "who pushed me — locked" },
      { name: "description", content: "A locked door. One question, one word, one way in." },
      { property: "og:title", content: "who pushed me — locked" },
      {
        property: "og:description",
        content: "A locked door. One question, one word, one way in.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gate,
});

function Gate() {
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const { ok } = await unlock({ data: { password: value } });
    setBusy(false);
    if (ok) await router.navigate({ to: "/room" });
    else setError(true);
  }

  return (
    <main className="void-screen relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="noise" aria-hidden="true" />
      <Dread />
      <form onSubmit={onSubmit} className="jitter relative z-40 w-full max-w-sm text-center">
        <h1 className="glitch flicker text-3xl font-light tracking-[0.3em] uppercase" data-text="who pushed me">
          who pushed me
        </h1>

        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="answer"
          aria-label="answer"
          className="mt-10 w-full border-b border-border/60 bg-transparent px-2 py-3 text-center text-lg tracking-[0.4em] text-foreground caret-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground"
        />
        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full border border-border/60 px-4 py-3 text-xs tracking-[0.4em] uppercase text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:opacity-40"
        >
          {busy ? "..." : "enter"}
        </button>
        <p
          className={`mt-6 text-xs tracking-[0.3em] uppercase text-destructive transition-opacity ${error ? "opacity-100" : "opacity-0"}`}
        >
          wrong
        </p>
      </form>
    </main>
  );
}
