import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";

import { getRoomAccess, lockSite } from "@/lib/gate.functions";

export const Route = createFileRoute("/room")({
  ssr: false,
  loader: () => getRoomAccess(),
  head: () => ({
    meta: [
      { title: "the room — notes & pictures" },
      {
        name: "description",
        content: "A flickering dark room to keep pictures and write things down.",
      },
      { property: "og:title", content: "the room — notes & pictures" },
      {
        property: "og:description",
        content: "A flickering dark room to keep pictures and write things down.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Room,
});

type Pic = { id: string; src: string; caption: string };

const PICS_KEY = "room.pics";
const NOTES_KEY = "room.notes";

function Room() {
  const router = useRouter();
  const lock = useServerFn(lockSite);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pics, setPics] = useState<Pic[]>([]);
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState<Pic | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setPics(JSON.parse(localStorage.getItem(PICS_KEY) ?? "[]"));
      setNotes(localStorage.getItem(NOTES_KEY) ?? "");
    } catch {
      /* empty */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(PICS_KEY, JSON.stringify(pics));
  }, [pics, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(NOTES_KEY, notes);
  }, [notes, ready]);

  function addFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPics((prev) => [
          { id: crypto.randomUUID(), src: String(reader.result), caption: "" },
          ...prev,
        ]);
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <main className="void-screen flicker min-h-screen px-5 py-10 sm:px-10">
      <div className="noise" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl">
        <header className="flex items-baseline justify-between gap-4">
          <h1
            className="glitch text-2xl font-light tracking-[0.35em] uppercase"
            data-text="inside"
          >
            inside
          </h1>
          <button
            onClick={async () => {
              await lock({ data: undefined });
              await router.navigate({ to: "/" });
            }}
            className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground transition-colors hover:text-foreground"
          >
            lock
          </button>
        </header>

        <section className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xs tracking-[0.35em] uppercase text-muted-foreground">pictures</h2>
            <button
              onClick={() => fileRef.current?.click()}
              className="border border-border/60 px-4 py-2 text-[10px] tracking-[0.35em] uppercase text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              add image
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {pics.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground/70">
              empty walls. add something you don't want to forget.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {pics.map((p) => (
                <figure key={p.id} className="group relative border border-border/50">
                  <button
                    onClick={() => setOpen(p)}
                    className="block w-full"
                    aria-label="open image"
                  >
                    <img
                      src={p.src}
                      alt={p.caption || "saved picture"}
                      loading="lazy"
                      className="aspect-square w-full object-cover opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:contrast-125"
                    />
                  </button>
                  <input
                    value={p.caption}
                    onChange={(e) =>
                      setPics((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, caption: e.target.value } : x)),
                      )
                    }
                    placeholder="say something"
                    className="w-full bg-transparent px-2 py-2 text-[11px] tracking-widest text-muted-foreground outline-none placeholder:text-muted-foreground/40 focus:text-foreground"
                  />
                  <button
                    onClick={() => setPics((prev) => prev.filter((x) => x.id !== p.id))}
                    className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center border border-border/60 bg-background/80 text-xs text-muted-foreground group-hover:flex hover:text-destructive"
                    aria-label="remove image"
                  >
                    ×
                  </button>
                </figure>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16 pb-20">
          <h2 className="text-xs tracking-[0.35em] uppercase text-muted-foreground">write</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={12}
            placeholder="type here... it stays on this device."
            className="mt-6 w-full resize-y border border-border/50 bg-card/40 p-5 text-sm leading-7 text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/60"
          />
        </section>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6 animate-fade-in"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <figure className="max-h-full max-w-4xl text-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={open.src}
              alt={open.caption || "saved picture"}
              className="max-h-[80vh] w-auto border border-border/60 object-contain"
            />
            {open.caption && (
              <figcaption className="mt-4 text-xs tracking-[0.3em] uppercase text-muted-foreground">
                {open.caption}
              </figcaption>
            )}
          </figure>
          <button
            onClick={() => setOpen(null)}
            className="absolute right-6 top-6 text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground"
          >
            close
          </button>
        </div>
      )}
    </main>
  );
}
