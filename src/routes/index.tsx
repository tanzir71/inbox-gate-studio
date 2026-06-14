import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Toaster, toast } from "sonner";
import {
  Box, Rows3, Columns2, Columns3, LayoutPanelLeft, Image as ImageIcon,
  Type, MousePointerClick, Minus, Share2, Mail, Code2, ChevronDown, ChevronRight,
  Monitor, Smartphone, FileCode2, Play, Variable, Download, ArrowUp, ArrowDown,
  Copy, Trash2, X, Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InboxGate Neo-Studio — Email Template Compiler" },
      { name: "description", content: "Ultra-minimalist dark workspace for designing, tuning, and compiling production-ready HTML email templates." },
      { property: "og:title", content: "InboxGate Neo-Studio" },
      { property: "og:description", content: "Design, tune, and compile production-ready HTML email templates in a premium dark workspace." },
    ],
  }),
  component: Index,
});

/* ============================================================
 * Types
 * ========================================================== */
type Padding = { top: number; right: number; bottom: number; left: number };
type TypoFamily = "sans" | "serif" | "mono";
type Frame = "desktop" | "mobile" | "raw";

type BaseStyle = {
  padding: Padding;
  bg: string;        // inner background
  wrapperBg: string; // outer wrapper bg
  fontFamily: TypoFamily;
  fontWeight: 300 | 500 | 700;
  fontSize: number;
  lineHeight: number;
  textColor: string;
};

type Column = { html: string; bg?: string };

type Block =
  | { id: string; type: "row-1" | "row-2" | "row-3" | "row-asym"; style: BaseStyle; columns: Column[] }
  | { id: string; type: "hero"; style: BaseStyle; imageUrl: string; alt: string; caption: string }
  | { id: string; type: "text"; style: BaseStyle; heading: string; body: string }
  | { id: string; type: "cta"; style: BaseStyle; primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string }
  | { id: string; type: "divider"; style: BaseStyle; color: string }
  | { id: string; type: "social"; style: BaseStyle; links: { label: string; url: string }[] }
  | { id: string; type: "footer"; style: BaseStyle; company: string; address: string; unsubscribe: string }
  | { id: string; type: "raw"; style: BaseStyle; html: string };

/* ============================================================
 * Defaults
 * ========================================================== */
const defaultStyle = (): BaseStyle => ({
  padding: { top: 24, right: 24, bottom: 24, left: 24 },
  bg: "#0a0a0a",
  wrapperBg: "#0a0a0a",
  fontFamily: "sans",
  fontWeight: 500,
  fontSize: 16,
  lineHeight: 1.55,
  textColor: "#ffffff",
});

const uid = () => Math.random().toString(36).slice(2, 10);

const fontStack = (f: TypoFamily) =>
  f === "sans"
    ? "-apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', Arial, sans-serif"
    : f === "serif"
    ? "'Iowan Old Style', 'Apple Garamond', Baskerville, Georgia, serif"
    : "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

const seedBlocks = (): Block[] => [
  {
    id: uid(), type: "hero",
    style: { ...defaultStyle(), padding: { top: 0, right: 0, bottom: 0, left: 0 } },
    imageUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80&auto=format&fit=crop",
    alt: "Hero artwork",
    caption: "",
  },
  {
    id: uid(), type: "text",
    style: { ...defaultStyle(), fontSize: 28, fontWeight: 700, lineHeight: 1.2 },
    heading: "Ship email at the speed of code.",
    body: "Hi {{subscriber.first_name}}, InboxGate Neo-Studio compiles your visual canvas into bullet-proof, table-nested HTML in milliseconds.",
  },
  {
    id: uid(), type: "cta",
    style: defaultStyle(),
    primaryLabel: "Open Studio", primaryUrl: "https://example.com/studio",
    secondaryLabel: "Read Changelog", secondaryUrl: "https://example.com/changelog",
  },
  { id: uid(), type: "divider", style: defaultStyle(), color: "#262626" },
  {
    id: uid(), type: "footer",
    style: { ...defaultStyle(), fontSize: 12, textColor: "#737373" },
    company: "InboxGate Labs, Inc.",
    address: "1 Market Street, San Francisco, CA",
    unsubscribe: "{{unsubscribe_url}}",
  },
];

/* ============================================================
 * Compiler — canvas → table-nested HTML email
 * ========================================================== */
function padStr(p: Padding) {
  return `padding:${p.top}px ${p.right}px ${p.bottom}px ${p.left}px;`;
}
function styleStr(s: BaseStyle) {
  return `font-family:${fontStack(s.fontFamily)};font-weight:${s.fontWeight};font-size:${s.fontSize}px;line-height:${s.lineHeight};color:${s.textColor};background:${s.bg};${padStr(s.padding)}`;
}

function renderBlockHtml(b: Block): string {
  const s = b.style;
  switch (b.type) {
    case "hero":
      return `<tr><td style="${padStr(s.padding)}background:${s.bg};"><img src="${b.imageUrl}" alt="${b.alt}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" /></td></tr>`;
    case "text":
      return `<tr><td style="${styleStr(s)}">${b.heading ? `<h1 style="margin:0 0 12px 0;font-size:${s.fontSize}px;line-height:${s.lineHeight};font-weight:${s.fontWeight};color:${s.textColor};">${b.heading}</h1>` : ""}<p style="margin:0;font-size:${Math.max(13, Math.round(s.fontSize * 0.62))}px;line-height:1.6;color:${s.textColor};font-weight:400;">${b.body}</p></td></tr>`;
    case "cta":
      return `<tr><td align="center" style="${padStr(s.padding)}background:${s.bg};"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:0 6px;"><a href="${b.primaryUrl}" style="display:inline-block;background:#10b981;color:#0a0a0a;font-family:${fontStack(s.fontFamily)};font-weight:700;font-size:14px;padding:14px 22px;text-decoration:none;">${b.primaryLabel}</a></td><td style="padding:0 6px;"><a href="${b.secondaryUrl}" style="display:inline-block;background:transparent;color:#ffffff;border:1px solid #262626;font-family:${fontStack(s.fontFamily)};font-weight:500;font-size:14px;padding:13px 22px;text-decoration:none;">${b.secondaryLabel}</a></td></tr></table></td></tr>`;
    case "divider":
      return `<tr><td style="${padStr(s.padding)}background:${s.bg};"><div style="height:1px;line-height:1px;background:${b.color};">&nbsp;</div></td></tr>`;
    case "social":
      return `<tr><td align="center" style="${padStr(s.padding)}background:${s.bg};">${b.links.map(l => `<a href="${l.url}" style="display:inline-block;margin:0 8px;color:${s.textColor};font-family:${fontStack(s.fontFamily)};font-size:12px;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">${l.label}</a>`).join("")}</td></tr>`;
    case "footer":
      return `<tr><td style="${styleStr(s)}"><div>${b.company}</div><div style="margin-top:4px;">${b.address}</div><div style="margin-top:8px;"><a href="${b.unsubscribe}" style="color:${s.textColor};text-decoration:underline;">Unsubscribe</a></div></td></tr>`;
    case "raw":
      return `<tr><td style="${padStr(s.padding)}background:${s.bg};">${b.html}</td></tr>`;
    case "row-1":
    case "row-2":
    case "row-3":
    case "row-asym": {
      const widths =
        b.type === "row-1" ? [600] :
        b.type === "row-2" ? [300, 300] :
        b.type === "row-3" ? [200, 200, 200] :
        [200, 400];
      const cells = b.columns.map((c, i) => `<td valign="top" width="${widths[i]}" style="background:${c.bg ?? "transparent"};padding:12px;font-family:${fontStack(s.fontFamily)};color:${s.textColor};font-size:${s.fontSize}px;line-height:${s.lineHeight};">${c.html || `<span style="opacity:.4;">Column ${i + 1}</span>`}</td>`).join("");
      return `<tr><td style="${padStr(s.padding)}background:${s.bg};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table></td></tr>`;
    }
  }
}

function compileEmail(blocks: Block[], subject = "InboxGate Newsletter"): string {
  const body = blocks.map(renderBlockHtml).join("\n      ");
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#000000;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#000000;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#0a0a0a;border:1px solid #1f1f1f;">
      ${body}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ============================================================
 * UI primitives — sharp-edge, dark, premium
 * ========================================================== */
const Btn = ({ children, onClick, variant = "ghost", className = "", title }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "accent" | "danger"; className?: string; title?: string;
}) => {
  const base = "inline-flex items-center gap-2 rounded-none px-3 py-2 text-xs font-medium tracking-wide transition-colors border";
  const v =
    variant === "primary" ? "bg-white text-neutral-950 border-white hover:bg-neutral-200"
    : variant === "accent" ? "bg-emerald-500 text-neutral-950 border-emerald-500 hover:bg-emerald-400"
    : variant === "danger" ? "bg-transparent text-red-400 border-neutral-800 hover:bg-red-500/10 hover:border-red-500/40"
    : "bg-transparent text-neutral-200 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700";
  return <button title={title} onClick={onClick} className={`${base} ${v} ${className}`}>{children}</button>;
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 mb-1.5">{label}</div>
    {children}
  </label>
);

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full rounded-none bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 ${props.className ?? ""}`} />
);
const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`w-full rounded-none bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 ${props.className ?? ""}`} />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`w-full rounded-none bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-100 focus:outline-none focus:border-emerald-500 ${props.className ?? ""}`} />
);

function Slider({ label, value, min, max, step = 1, onChange, unit = "px" }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-neutral-500 mb-1">
        <span>{label}</span>
        <span className="text-emerald-400 normal-case tracking-normal">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-emerald-500 h-1 bg-neutral-800 rounded-none appearance-none" />
    </div>
  );
}

function Accordion({ title, icon, defaultOpen = true, children }: { title: string; icon?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-800">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-3 py-2.5 text-[11px] uppercase tracking-[0.16em] text-neutral-300 hover:bg-neutral-900">
        <span className="flex items-center gap-2">{icon}{title}</span>
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>
      {open && <div className="px-3 pb-3 space-y-1.5">{children}</div>}
    </div>
  );
}

function PaletteItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full group flex items-center gap-2.5 px-2.5 py-2 border border-neutral-800 bg-neutral-950 hover:border-emerald-500/60 hover:bg-neutral-900 transition-colors">
      <span className="text-neutral-400 group-hover:text-emerald-400">{icon}</span>
      <span className="text-xs text-neutral-200">{label}</span>
    </button>
  );
}

/* ============================================================
 * Canvas block renderer (preview)
 * ========================================================== */
function blockPreviewStyle(s: BaseStyle): CSSProperties {
  return {
    padding: `${s.padding.top}px ${s.padding.right}px ${s.padding.bottom}px ${s.padding.left}px`,
    background: s.bg,
    fontFamily: fontStack(s.fontFamily),
    fontWeight: s.fontWeight,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    color: s.textColor,
  };
}

function BlockPreview({ b }: { b: Block }) {
  const s = b.style;
  if (b.type === "hero")
    return <div style={{ background: s.bg, padding: `${s.padding.top}px ${s.padding.right}px ${s.padding.bottom}px ${s.padding.left}px` }}>
      <img src={b.imageUrl} alt={b.alt} className="block w-full h-auto" />
    </div>;
  if (b.type === "text")
    return <div style={blockPreviewStyle(s)}>
      {b.heading && <h1 style={{ margin: 0, marginBottom: 12, fontSize: s.fontSize, lineHeight: s.lineHeight, fontWeight: s.fontWeight }}>{b.heading}</h1>}
      <p style={{ margin: 0, fontSize: Math.max(13, Math.round(s.fontSize * 0.62)), lineHeight: 1.6, fontWeight: 400 }}>{b.body}</p>
    </div>;
  if (b.type === "cta")
    return <div style={{ background: s.bg, padding: `${s.padding.top}px ${s.padding.right}px ${s.padding.bottom}px ${s.padding.left}px` }} className="flex justify-center gap-2">
      <span className="inline-block bg-emerald-500 text-neutral-950 font-bold text-sm px-5 py-3">{b.primaryLabel}</span>
      <span className="inline-block border border-neutral-800 text-white text-sm px-5 py-3">{b.secondaryLabel}</span>
    </div>;
  if (b.type === "divider")
    return <div style={{ background: s.bg, padding: `${s.padding.top}px ${s.padding.right}px ${s.padding.bottom}px ${s.padding.left}px` }}>
      <div style={{ height: 1, background: b.color }} />
    </div>;
  if (b.type === "social")
    return <div style={blockPreviewStyle(s)} className="text-center">
      {b.links.map((l, i) => <span key={i} className="inline-block mx-2 text-xs uppercase tracking-[0.18em] text-neutral-300">{l.label}</span>)}
    </div>;
  if (b.type === "footer")
    return <div style={blockPreviewStyle(s)}>
      <div>{b.company}</div>
      <div className="mt-1">{b.address}</div>
      <div className="mt-2 underline">Unsubscribe</div>
    </div>;
  if (b.type === "raw")
    return <div style={{ background: s.bg, padding: `${s.padding.top}px ${s.padding.right}px ${s.padding.bottom}px ${s.padding.left}px`, color: s.textColor }}
      dangerouslySetInnerHTML={{ __html: b.html }} />;
  // rows
  const cols = b.columns.length;
  const grid = b.type === "row-asym" ? "1fr 2fr" : `repeat(${cols}, minmax(0, 1fr))`;
  return <div style={{ background: s.bg, padding: `${s.padding.top}px ${s.padding.right}px ${s.padding.bottom}px ${s.padding.left}px` }}>
    <div style={{ display: "grid", gridTemplateColumns: grid, gap: 0 }}>
      {b.columns.map((c, i) => (
        <div key={i} style={{ background: c.bg ?? "transparent", padding: 12, color: s.textColor, fontFamily: fontStack(s.fontFamily), fontSize: s.fontSize, lineHeight: s.lineHeight }}
          dangerouslySetInnerHTML={{ __html: c.html || `<span style="opacity:.35;">Column ${i + 1}</span>` }} />
      ))}
    </div>
  </div>;
}

/* ============================================================
 * Inspector
 * ========================================================== */
function Inspector({ block, update }: { block: Block | null; update: (b: Block) => void }) {
  if (!block) return (
    <div className="p-6 text-xs text-neutral-500 leading-relaxed">
      <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-600 mb-2">Inspector</div>
      Select a block in the canvas to expose its tunable properties — padding arrays, background matrix, typography scale, and interactive bindings.
    </div>
  );
  const s = block.style;
  const setStyle = (patch: Partial<BaseStyle>) => update({ ...block, style: { ...s, ...patch } } as Block);
  const setPad = (k: keyof Padding, v: number) => setStyle({ padding: { ...s.padding, [k]: v } });

  const mergeTags = ["{{subscriber.first_name}}", "{{subscriber.email}}", "{{unsubscribe_url}}", "{{company.name}}", "{{date.today}}"];

  return (
    <div className="text-xs">
      <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Inspector</div>
          <div className="text-sm text-white mt-0.5">{block.type.toUpperCase()}</div>
        </div>
        <div className="h-1.5 w-1.5 bg-emerald-500" />
      </div>

      <Accordion title="Micro-Padding Array" icon={<Box className="h-3.5 w-3.5" />}>
        <Slider label="Top" value={s.padding.top} min={0} max={80} onChange={v => setPad("top", v)} />
        <Slider label="Right" value={s.padding.right} min={0} max={80} onChange={v => setPad("right", v)} />
        <Slider label="Bottom" value={s.padding.bottom} min={0} max={80} onChange={v => setPad("bottom", v)} />
        <Slider label="Left" value={s.padding.left} min={0} max={80} onChange={v => setPad("left", v)} />
      </Accordion>

      <Accordion title="Background Matrix">
        <Field label="Inner background (hex)">
          <div className="flex gap-2">
            <TextInput value={s.bg} onChange={e => setStyle({ bg: e.target.value })} />
            <input type="color" value={s.bg} onChange={e => setStyle({ bg: e.target.value })} className="h-[30px] w-8 border border-neutral-800 bg-neutral-950" />
          </div>
        </Field>
        <Field label="Wrapper background (hex)">
          <div className="flex gap-2">
            <TextInput value={s.wrapperBg} onChange={e => setStyle({ wrapperBg: e.target.value })} />
            <input type="color" value={s.wrapperBg} onChange={e => setStyle({ wrapperBg: e.target.value })} className="h-[30px] w-8 border border-neutral-800 bg-neutral-950" />
          </div>
        </Field>
        <Field label="Text color">
          <div className="flex gap-2">
            <TextInput value={s.textColor} onChange={e => setStyle({ textColor: e.target.value })} />
            <input type="color" value={s.textColor} onChange={e => setStyle({ textColor: e.target.value })} className="h-[30px] w-8 border border-neutral-800 bg-neutral-950" />
          </div>
        </Field>
      </Accordion>

      <Accordion title="Typography Scale Grid">
        <Field label="Family">
          <Select value={s.fontFamily} onChange={e => setStyle({ fontFamily: e.target.value as TypoFamily })}>
            <option value="sans">System Sans</option>
            <option value="serif">Classic Serif</option>
            <option value="mono">Sharp Monospace</option>
          </Select>
        </Field>
        <Field label="Weight">
          <Select value={s.fontWeight} onChange={e => setStyle({ fontWeight: Number(e.target.value) as 300 | 500 | 700 })}>
            <option value={300}>300 — Light</option>
            <option value={500}>500 — Medium</option>
            <option value={700}>700 — Bold</option>
          </Select>
        </Field>
        <Slider label="Size" value={s.fontSize} min={12} max={48} onChange={v => setStyle({ fontSize: v })} />
        <Field label="Line height">
          <TextInput type="number" step={0.05} min={1} max={2.5} value={s.lineHeight}
            onChange={e => setStyle({ lineHeight: Number(e.target.value) || 1.4 })} />
        </Field>
      </Accordion>

      <Accordion title="Interactive Bindings">
        {block.type === "text" && (
          <>
            <Field label="Heading"><TextInput value={block.heading} onChange={e => update({ ...block, heading: e.target.value })} /></Field>
            <Field label="Body"><TextArea rows={4} value={block.body} onChange={e => update({ ...block, body: e.target.value })} /></Field>
            <Field label="Insert merge tag">
              <Select onChange={e => {
                if (!e.target.value) return;
                update({ ...block, body: (block.body + " " + e.target.value).trim() });
                e.currentTarget.value = "";
              }}>
                <option value="">— select ESP merge tag —</option>
                {mergeTags.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
          </>
        )}
        {block.type === "hero" && (
          <>
            <Field label="Image URL"><TextInput value={block.imageUrl} onChange={e => update({ ...block, imageUrl: e.target.value })} /></Field>
            <Field label="Alt text"><TextInput value={block.alt} onChange={e => update({ ...block, alt: e.target.value })} /></Field>
          </>
        )}
        {block.type === "cta" && (
          <>
            <Field label="Primary label"><TextInput value={block.primaryLabel} onChange={e => update({ ...block, primaryLabel: e.target.value })} /></Field>
            <Field label="Primary URI"><TextInput value={block.primaryUrl} onChange={e => update({ ...block, primaryUrl: e.target.value })} /></Field>
            <Field label="Secondary label"><TextInput value={block.secondaryLabel} onChange={e => update({ ...block, secondaryLabel: e.target.value })} /></Field>
            <Field label="Secondary URI"><TextInput value={block.secondaryUrl} onChange={e => update({ ...block, secondaryUrl: e.target.value })} /></Field>
          </>
        )}
        {block.type === "divider" && (
          <Field label="Line color"><TextInput value={block.color} onChange={e => update({ ...block, color: e.target.value })} /></Field>
        )}
        {block.type === "footer" && (
          <>
            <Field label="Company"><TextInput value={block.company} onChange={e => update({ ...block, company: e.target.value })} /></Field>
            <Field label="Address"><TextInput value={block.address} onChange={e => update({ ...block, address: e.target.value })} /></Field>
            <Field label="Unsubscribe URL"><TextInput value={block.unsubscribe} onChange={e => update({ ...block, unsubscribe: e.target.value })} /></Field>
          </>
        )}
        {block.type === "social" && (
          <Field label="Links (label|url per line)">
            <TextArea rows={4} value={block.links.map(l => `${l.label}|${l.url}`).join("\n")}
              onChange={e => update({ ...block, links: e.target.value.split("\n").filter(Boolean).map(line => {
                const [label, url] = line.split("|"); return { label: label?.trim() ?? "", url: url?.trim() ?? "#" };
              }) })} />
          </Field>
        )}
        {block.type === "raw" && (
          <Field label="Raw HTML / inline code">
            <TextArea rows={8} value={block.html} onChange={e => update({ ...block, html: e.target.value })} className="font-mono" />
          </Field>
        )}
        {block.type.startsWith("row") && "columns" in block && (
          <>
            {block.columns.map((c, i) => (
              <div key={i} className="border border-neutral-800 p-2 space-y-2">
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Column {i + 1}</div>
                <TextArea rows={3} value={c.html} placeholder="Cell HTML" onChange={e => {
                  const cols = [...block.columns]; cols[i] = { ...c, html: e.target.value };
                  update({ ...block, columns: cols });
                }} />
                <div className="flex gap-2">
                  <TextInput value={c.bg ?? ""} placeholder="bg hex" onChange={e => {
                    const cols = [...block.columns]; cols[i] = { ...c, bg: e.target.value };
                    update({ ...block, columns: cols });
                  }} />
                </div>
              </div>
            ))}
          </>
        )}
      </Accordion>
    </div>
  );
}

/* ============================================================
 * Main app
 * ========================================================== */
const STORAGE_KEY = "inboxgate-neo-studio-v1";

function Index() {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    if (typeof window === "undefined") return seedBlocks();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return seedBlocks();
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [frame, setFrame] = useState<Frame>("desktop");
  const [exportOpen, setExportOpen] = useState(false);
  const [varsOpen, setVarsOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks)); } catch {}
  }, [blocks]);

  const selected = useMemo(() => blocks.find(b => b.id === selectedId) ?? null, [blocks, selectedId]);

  const addBlock = (b: Block) => { setBlocks(prev => [...prev, b]); setSelectedId(b.id); };
  const updateBlock = (b: Block) => setBlocks(prev => prev.map(x => x.id === b.id ? b : x));
  const moveBlock = (id: string, dir: -1 | 1) => setBlocks(prev => {
    const i = prev.findIndex(b => b.id === id); if (i < 0) return prev;
    const j = i + dir; if (j < 0 || j >= prev.length) return prev;
    const copy = [...prev]; [copy[i], copy[j]] = [copy[j], copy[i]]; return copy;
  });
  const dupBlock = (id: string) => setBlocks(prev => {
    const i = prev.findIndex(b => b.id === id); if (i < 0) return prev;
    const copy = [...prev]; copy.splice(i + 1, 0, { ...prev[i], id: uid() } as Block); return copy;
  });
  const delBlock = (id: string) => { setBlocks(prev => prev.filter(b => b.id !== id)); if (selectedId === id) setSelectedId(null); };

  const compiled = useMemo(() => compileEmail(blocks), [blocks]);

  const frameWidth = frame === "desktop" ? 600 : frame === "mobile" ? 360 : 760;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col" style={{ fontFamily: fontStack("sans") }}>
      <Toaster position="bottom-right" theme="dark" toastOptions={{
        unstyled: false,
        className: "!rounded-none !bg-neutral-900 !border !border-neutral-800 !text-neutral-100"
      }} />

      {/* TOP BAR */}
      <header className="border-b border-neutral-800 bg-neutral-950">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 bg-emerald-500 grid place-items-center">
                <Mail className="h-3.5 w-3.5 text-neutral-950" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold tracking-tight truncate">InboxGate Neo-Studio</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">HTML Email Compiler</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 border border-neutral-800 px-2.5 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping bg-emerald-500 opacity-60"></span>
                <span className="relative inline-flex h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-300">Compiler Engine: Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex border border-neutral-800">
              {[
                { id: "desktop" as Frame, icon: <Monitor className="h-3.5 w-3.5" />, label: "Desktop Frame [600px]" },
                { id: "mobile" as Frame, icon: <Smartphone className="h-3.5 w-3.5" />, label: "Mobile Frame [360px]" },
                { id: "raw" as Frame, icon: <FileCode2 className="h-3.5 w-3.5" />, label: "Raw Code Matrix" },
              ].map(f => (
                <button key={f.id} onClick={() => setFrame(f.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.14em] border-r border-neutral-800 last:border-r-0 transition-colors ${frame === f.id ? "bg-white text-neutral-950" : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"}`}>
                  {f.icon}<span className="hidden xl:inline">{f.label}</span>
                </button>
              ))}
            </div>
            <Btn onClick={() => { toast.success("Live preview synced"); }}><Play className="h-3.5 w-3.5" />Preview Layout Live</Btn>
            <Btn variant="ghost" onClick={() => setVarsOpen(true)}><Variable className="h-3.5 w-3.5" />Inject Dynamic Variables</Btn>
            <Btn variant="accent" onClick={() => setExportOpen(true)}><Download className="h-3.5 w-3.5" />Export Final HTML Code</Btn>
          </div>
        </div>
      </header>

      {/* THREE-COLUMN WORKSPACE */}
      <div className="flex-1 grid grid-cols-12 min-h-0">
        {/* COL A — palette */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r border-neutral-800 bg-neutral-900 overflow-y-auto">
          <div className="px-3 py-3 border-b border-neutral-800">
            <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Atomic Palette</div>
            <div className="text-sm text-white mt-0.5">Components</div>
          </div>

          <Accordion title="Layout Grid Matrix" icon={<LayoutPanelLeft className="h-3.5 w-3.5" />}>
            <PaletteItem icon={<Rows3 className="h-4 w-4" />} label="1-Column Row" onClick={() => addBlock({ id: uid(), type: "row-1", style: defaultStyle(), columns: [{ html: "" }] })} />
            <PaletteItem icon={<Columns2 className="h-4 w-4" />} label="2-Column Balanced Grid" onClick={() => addBlock({ id: uid(), type: "row-2", style: defaultStyle(), columns: [{ html: "" }, { html: "" }] })} />
            <PaletteItem icon={<Columns3 className="h-4 w-4" />} label="3-Column Image Grid" onClick={() => addBlock({ id: uid(), type: "row-3", style: defaultStyle(), columns: [{ html: "" }, { html: "" }, { html: "" }] })} />
            <PaletteItem icon={<LayoutPanelLeft className="h-4 w-4" />} label="1/3 → 2/3 Sidebar Row" onClick={() => addBlock({ id: uid(), type: "row-asym", style: defaultStyle(), columns: [{ html: "" }, { html: "" }] })} />
          </Accordion>

          <Accordion title="Component Blocks" icon={<Box className="h-3.5 w-3.5" />}>
            <PaletteItem icon={<ImageIcon className="h-4 w-4" />} label="Hero Image Framework" onClick={() => addBlock({ id: uid(), type: "hero", style: { ...defaultStyle(), padding: { top: 0, right: 0, bottom: 0, left: 0 } }, imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80", alt: "Hero", caption: "" })} />
            <PaletteItem icon={<Type className="h-4 w-4" />} label="Multi-Heading Rich Text" onClick={() => addBlock({ id: uid(), type: "text", style: defaultStyle(), heading: "A new heading", body: "Write your story here." })} />
            <PaletteItem icon={<MousePointerClick className="h-4 w-4" />} label="Double CTA Buttons" onClick={() => addBlock({ id: uid(), type: "cta", style: defaultStyle(), primaryLabel: "Primary", primaryUrl: "https://example.com", secondaryLabel: "Secondary", secondaryUrl: "https://example.com" })} />
            <PaletteItem icon={<Minus className="h-4 w-4" />} label="Line Divider" onClick={() => addBlock({ id: uid(), type: "divider", style: defaultStyle(), color: "#262626" })} />
            <PaletteItem icon={<Share2 className="h-4 w-4" />} label="Social Icon Strip" onClick={() => addBlock({ id: uid(), type: "social", style: defaultStyle(), links: [{ label: "Twitter", url: "#" }, { label: "GitHub", url: "#" }, { label: "LinkedIn", url: "#" }] })} />
            <PaletteItem icon={<Mail className="h-4 w-4" />} label="Unsubscribe Footer" onClick={() => addBlock({ id: uid(), type: "footer", style: { ...defaultStyle(), fontSize: 12, textColor: "#737373" }, company: "Company, Inc.", address: "1 Market St, SF", unsubscribe: "{{unsubscribe_url}}" })} />
          </Accordion>

          <Accordion title="Advanced Injections" icon={<Code2 className="h-3.5 w-3.5" />}>
            <PaletteItem icon={<Code2 className="h-4 w-4" />} label="Raw Custom HTML / Code" onClick={() => addBlock({ id: uid(), type: "raw", style: defaultStyle(), html: "<!-- inline raw HTML -->\n<p>Custom content</p>" })} />
          </Accordion>

          <div className="mt-auto px-3 py-3 border-t border-neutral-800">
            <a href="https://tanziro.com" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 hover:text-emerald-400 transition-colors">built by tanziro.com</a>
          </div>
        </aside>

        {/* COL B — canvas */}
        <main className="col-span-12 md:col-span-6 lg:col-span-7 bg-neutral-950 overflow-y-auto">
          <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            <span>Production Canvas · {blocks.length} blocks</span>
            <span>{frame === "desktop" ? "600px" : frame === "mobile" ? "360px" : "Raw Matrix"}</span>
          </div>

          <div className="min-h-full py-8 px-4 flex justify-center">
            {frame === "raw" ? (
              <pre className="w-full max-w-4xl border border-neutral-800 bg-black p-4 text-[11px] leading-relaxed text-emerald-300 overflow-x-auto font-mono">{compiled}</pre>
            ) : (
              <div className="border border-neutral-800 bg-neutral-900" style={{ width: frameWidth }}>
                <div className="border-b border-neutral-800 px-3 py-2 flex items-center gap-1.5">
                  <div className="h-2 w-2 bg-neutral-700"></div>
                  <div className="h-2 w-2 bg-neutral-700"></div>
                  <div className="h-2 w-2 bg-neutral-700"></div>
                  <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500">inbox preview</span>
                </div>
                <div className="bg-black">
                  {blocks.length === 0 && (
                    <div className="p-10 text-center text-xs text-neutral-600">
                      Drop blocks from the Atomic Palette to begin composing.
                    </div>
                  )}
                  {blocks.map((b, idx) => (
                    <div key={b.id} onClick={() => setSelectedId(b.id)}
                      className={`group relative cursor-pointer ${selectedId === b.id ? "outline outline-1 outline-white" : ""}`}>
                      <BlockPreview b={b} />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 flex border border-neutral-700 bg-neutral-900">
                        <button title="Move up" onClick={e => { e.stopPropagation(); moveBlock(b.id, -1); }} className="px-1.5 py-1 text-neutral-300 hover:bg-neutral-800 border-r border-neutral-800" disabled={idx === 0}><ArrowUp className="h-3 w-3" /></button>
                        <button title="Move down" onClick={e => { e.stopPropagation(); moveBlock(b.id, 1); }} className="px-1.5 py-1 text-neutral-300 hover:bg-neutral-800 border-r border-neutral-800"><ArrowDown className="h-3 w-3" /></button>
                        <button title="Duplicate" onClick={e => { e.stopPropagation(); dupBlock(b.id); }} className="px-1.5 py-1 text-neutral-300 hover:bg-neutral-800 border-r border-neutral-800"><Copy className="h-3 w-3" /></button>
                        <button title="Delete" onClick={e => { e.stopPropagation(); delBlock(b.id); }} className="px-1.5 py-1 text-red-400 hover:bg-red-500/20"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* COL C — inspector */}
        <aside className="col-span-12 md:col-span-3 border-l border-neutral-800 bg-neutral-900 overflow-y-auto">
          <Inspector block={selected} update={updateBlock} />
        </aside>
      </div>

      {/* EXPORT MODAL */}
      {exportOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Production Compiler</div>
              <div className="text-base font-semibold mt-0.5">Export · Table-Nested HTML</div>
            </div>
            <div className="flex items-center gap-2">
              <Btn variant="accent" onClick={async () => {
                try { await navigator.clipboard.writeText(compiled); toast.success("Production code copied", { icon: <Check className="h-4 w-4" /> }); }
                catch { toast.error("Clipboard unavailable"); }
              }}><Copy className="h-3.5 w-3.5" />Copy Production Code</Btn>
              <Btn onClick={() => {
                const blob = new Blob([compiled], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "inboxgate-newsletter.html"; a.click();
                URL.revokeObjectURL(url);
              }}><Download className="h-3.5 w-3.5" />Download .html</Btn>
              <Btn onClick={() => setExportOpen(false)}><X className="h-3.5 w-3.5" />Close</Btn>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 min-h-0">
            <div className="border-r border-neutral-800 overflow-auto bg-black">
              <div className="px-4 py-2 border-b border-neutral-800 text-[10px] uppercase tracking-[0.18em] text-neutral-500">Raw responsive HTML</div>
              <pre className="p-4 text-[11px] leading-relaxed font-mono text-emerald-300 whitespace-pre-wrap break-words">{compiled}</pre>
            </div>
            <div className="overflow-auto bg-neutral-950">
              <div className="px-4 py-2 border-b border-neutral-800 text-[10px] uppercase tracking-[0.18em] text-neutral-500">Isolated inbox render</div>
              <div className="p-6 flex justify-center">
                <iframe title="render" srcDoc={compiled} className="w-[640px] h-[80vh] border border-neutral-800 bg-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VARS MODAL */}
      {varsOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setVarsOpen(false)}>
          <div className="w-full max-w-lg border border-neutral-800 bg-neutral-900" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <div className="text-sm font-semibold">Inject Dynamic Variables</div>
              <button onClick={() => setVarsOpen(false)} className="text-neutral-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <p className="text-neutral-400">Click a merge tag to copy it. Paste into any text block via the Inspector.</p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {["{{subscriber.first_name}}","{{subscriber.last_name}}","{{subscriber.email}}","{{unsubscribe_url}}","{{company.name}}","{{company.address}}","{{date.today}}","{{campaign.id}}"].map(t => (
                  <button key={t} onClick={() => { navigator.clipboard?.writeText(t); toast.success(`Copied ${t}`); }}
                    className="text-left border border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-950 px-2.5 py-2 font-mono text-emerald-300">{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
