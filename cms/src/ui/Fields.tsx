import { useState } from 'react';

import type { Field } from '../schema';
import { type Doc, type Json, store } from '../store';

type Ctx = { docs: Doc[] };

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ne', label: 'नेपाली Nepali' },
  { code: 'hi', label: 'हिन्दी Hindi' },
] as const;

let idSeq = 0;
const useId = () => useState(() => `f${++idSeq}`)[0];

function Label({ f, htmlFor }: { f: Field; htmlFor?: string }) {
  return (
    <>
      <label className="label" htmlFor={htmlFor}>
        {f.label} {'required' in f && f.required ? <span className="req" aria-label="required">*</span> : null}
      </label>
      {f.help ? <span className="help">{f.help}</span> : null}
    </>
  );
}

function Localized({ f, value, onChange }: { f: Extract<Field, { type: 'localized' }>; value: Json | undefined; onChange: (v: Json) => void }) {
  const id = useId();
  const v = (value ?? {}) as Record<string, string>;
  const set = (code: string, text: string) => {
    const next: Record<string, string> = { ...v, [code]: text };
    if (code !== 'en' && !text) delete next[code]; // missing translation → app falls back to English
    onChange(next);
  };
  return (
    <div className="field" role="group" aria-labelledby={`${id}-l`}>
      <span id={`${id}-l`} className="label">{f.label} {f.required ? <span className="req">*</span> : null}</span>
      {f.help ? <span className="help">{f.help}</span> : null}
      <div className="loc">
        {LANGS.map((l) => {
          const missing = l.code !== 'en' && !!v.en && !v[l.code];
          const props = {
            id: `${id}-${l.code}`,
            lang: l.code,
            value: v[l.code] ?? '',
            onChange: (e: { target: { value: string } }) => set(l.code, e.target.value),
            'aria-label': `${f.label} — ${l.label}`,
          };
          return (
            <div key={l.code} className="field">
              <span className="lang">
                <span>{l.label}</span>
                {missing ? <span className="missing">needs translation</span> : null}
              </span>
              {f.multiline ? <textarea {...props} /> : <input type="text" {...props} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tags({ f, value, onChange }: { f: Extract<Field, { type: 'tags' }>; value: unknown; onChange: (v: string[]) => void }) {
  const id = useId();
  const list = Array.isArray(value) ? (value as string[]) : [];
  const [text, setText] = useState('');
  const add = (t: string) => {
    const v = t.trim().toLowerCase();
    if (v && !list.includes(v)) onChange([...list, v]);
    setText('');
  };
  return (
    <div className="field">
      <Label f={f} htmlFor={id} />
      <div className="tags">
        {list.map((t) => (
          <span key={t} className="tag">{t}<button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(list.filter((x) => x !== t))}>×</button></span>
        ))}
        <input id={id} type="text" value={text} placeholder="Add…" style={{ width: 140 }} list={`${id}-s`}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(text); } }} onBlur={() => text && add(text)} />
        {f.suggestions ? <datalist id={`${id}-s`}>{f.suggestions.map((s) => <option key={s} value={s} />)}</datalist> : null}
      </div>
    </div>
  );
}

function FileField({ f, value, onChange }: { f: Extract<Field, { type: 'file' }>; value: unknown; onChange: (v: string | undefined) => void }) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="field">
      <Label f={f} htmlFor={id} />
      <div className="row">
        <input id={id} type="url" value={typeof value === 'string' ? value : ''} placeholder="https://…" onChange={(e) => onChange(e.target.value || undefined)} style={{ flex: 1, minWidth: 200 }} />
        <label className="btn small">
          {busy ? 'Uploading…' : 'Upload'}
          <input type="file" accept={f.accept} hidden onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true); setErr(null);
            try { onChange(await store.upload(file)); } catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
          }} />
        </label>
        {typeof value === 'string' && value && f.accept.startsWith('audio') ? <audio controls src={value} style={{ height: 32 }} /> : null}
      </div>
      {err ? <span className="help" style={{ color: 'var(--danger)' }}>{err}</span> : null}
    </div>
  );
}

function ListField({ f, value, onChange, ctx }: { f: Extract<Field, { type: 'list' | 'localizedList' }>; value: unknown; onChange: (v: unknown[]) => void; ctx: Ctx }) {
  const items = Array.isArray(value) ? value : [];
  const move = (i: number, d: number) => {
    const next = [...items];
    const [x] = next.splice(i, 1);
    next.splice(i + d, 0, x);
    onChange(next);
  };
  const blank = () => (f.type === 'localizedList' ? { en: '' } : {});
  return (
    <fieldset className="group">
      <legend>{f.label} <span className="count">({items.length})</span></legend>
      {f.help ? <span className="help small muted">{f.help}</span> : null}
      {items.map((item, i) => {
        const title = f.type === 'list' ? (f.summary?.(item as Json) || `${f.itemLabel} ${i + 1}`) : ((item as Json)?.en as string) || `${f.itemLabel} ${i + 1}`;
        return (
          <details key={i} className="list-item" open={!title || items.length <= 3}>
            <summary>
              <span className="muted small">{i + 1}.</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
              <button type="button" className="btn text small" disabled={i === 0} aria-label={`Move ${f.itemLabel} ${i + 1} up`} onClick={(e) => { e.preventDefault(); move(i, -1); }}>↑</button>
              <button type="button" className="btn text small" disabled={i === items.length - 1} aria-label={`Move ${f.itemLabel} ${i + 1} down`} onClick={(e) => { e.preventDefault(); move(i, 1); }}>↓</button>
              <button type="button" className="btn text small" style={{ color: 'var(--danger)' }} aria-label={`Remove ${f.itemLabel} ${i + 1}`} onClick={(e) => { e.preventDefault(); onChange(items.filter((_, j) => j !== i)); }}>Remove</button>
            </summary>
            <div className="body">
              {f.type === 'list' ? (
                <FieldList fields={f.fields} value={item as Json} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} ctx={ctx} />
              ) : (
                <Localized f={{ type: 'localized', name: '', label: `${f.itemLabel} ${i + 1}` }} value={item as Json} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
              )}
            </div>
          </details>
        );
      })}
      <div><button type="button" className="btn small" onClick={() => onChange([...items, blank()])}>+ Add {f.itemLabel}</button></div>
    </fieldset>
  );
}

export function FieldInput({ f, value, onChange, ctx }: { f: Field; value: unknown; onChange: (v: unknown) => void; ctx: Ctx }) {
  const id = useId();
  switch (f.type) {
    case 'text':
    case 'url':
    case 'date':
      return (
        <div className="field">
          <Label f={f} htmlFor={id} />
          <input id={id} type={f.type === 'text' ? 'text' : f.type} value={typeof value === 'string' ? value : ''} placeholder={'placeholder' in f ? f.placeholder : undefined}
            onChange={(e) => onChange(e.target.value === '' && !f.required ? undefined : e.target.value)} />
        </div>
      );
    case 'textarea':
      return (
        <div className="field">
          <Label f={f} htmlFor={id} />
          <textarea id={id} value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case 'number':
      return (
        <div className="field">
          <Label f={f} htmlFor={id} />
          <input id={id} type="number" value={typeof value === 'number' ? value : ''} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} style={{ maxWidth: 200 }} />
        </div>
      );
    case 'boolean':
      return (
        <label className="row" style={{ gap: 10, minHeight: 32 }}>
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
          <span style={{ fontWeight: 600 }}>{f.label}</span>
          {f.help ? <span className="muted small">{f.help}</span> : null}
        </label>
      );
    case 'select':
      return (
        <div className="field">
          <Label f={f} htmlFor={id} />
          <select id={id} value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value || undefined)} style={{ maxWidth: 320 }}>
            {f.optional || !f.required ? <option value="">—</option> : null}
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      );
    case 'reference': {
      const opts = ctx.docs.filter((d) => d.collection === f.collection);
      return (
        <div className="field">
          <Label f={f} htmlFor={id} />
          <select id={id} value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value || undefined)} style={{ maxWidth: 420 }}>
            <option value="">— none —</option>
            {opts.map((d) => (
              <option key={d.id} value={d.key}>
                {String((d.data.title as Json | undefined)?.en ?? d.data.name ?? d.key)}{d.status !== 'published' ? ' (not live)' : ''}
              </option>
            ))}
          </select>
        </div>
      );
    }
    case 'localized':
      return <Localized f={f} value={value as Json} onChange={onChange} />;
    case 'term': {
      const v = (value ?? {}) as Json;
      return (
        <div className="field">
          <Label f={f} htmlFor={id} />
          <div className="row">
            <span className="de" aria-hidden>DE</span>
            <input id={id} type="text" lang="de" value={(v.term as string) ?? ''} placeholder="Anmeldung" style={{ maxWidth: 320 }}
              onChange={(e) => onChange(e.target.value ? { ...v, term: e.target.value } : undefined)} />
          </div>
          <FileField f={{ type: 'file', name: 'audioUrl', label: 'Pronunciation audio (optional — otherwise the phone speaks it)', accept: 'audio/*' }}
            value={v.audioUrl} onChange={(u) => onChange({ ...v, term: v.term ?? '', audioUrl: u })} />
        </div>
      );
    }
    case 'tags':
      return <Tags f={f} value={value} onChange={onChange} />;
    case 'file':
      return <FileField f={f} value={value} onChange={onChange} />;
    case 'group': {
      const v = value && typeof value === 'object' ? (value as Json) : undefined;
      if (f.optional && !v) {
        return (
          <fieldset className="group">
            <legend>{f.label}</legend>
            <div><button type="button" className="btn small" onClick={() => onChange({})}>+ Add {f.label.toLowerCase()}</button></div>
          </fieldset>
        );
      }
      return (
        <fieldset className="group">
          <legend>{f.label}</legend>
          {f.help ? <span className="help small muted">{f.help}</span> : null}
          <FieldList fields={f.fields} value={v ?? {}} onChange={onChange} ctx={ctx} />
          {f.optional ? <div><button type="button" className="btn text small" onClick={() => onChange(undefined)}>Remove {f.label.toLowerCase()}</button></div> : null}
        </fieldset>
      );
    }
    case 'list':
    case 'localizedList':
      return <ListField f={f} value={value} onChange={onChange} ctx={ctx} />;
    default:
      return null;
  }
}

/** Renders a set of fields for one object; removes keys set to undefined. */
export function FieldList({ fields, value, onChange, ctx }: { fields: Field[]; value: Json; onChange: (v: Json) => void; ctx: Ctx }) {
  return (
    <>
      {fields.map((f) => (
        <FieldInput key={f.name} f={f} value={value?.[f.name]} ctx={ctx}
          onChange={(v) => {
            const next = { ...value };
            if (v === undefined) delete next[f.name];
            else next[f.name] = v;
            onChange(next);
          }} />
      ))}
    </>
  );
}
