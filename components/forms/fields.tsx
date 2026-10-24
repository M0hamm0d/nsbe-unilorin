import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type Common = { id: string; label: string; optional?: boolean; help?: string; error?: string };

const describedBy = (id: string, help?: string, error?: string) =>
  [help ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="fm-error">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.5" />
      </svg>
      <span>{error}</span>
    </p>
  );
}

function Label({ id, label, optional }: Pick<Common, "id" | "label" | "optional">) {
  return (
    <label htmlFor={id} className="fm-label">
      {label} {optional && <span className="fm-opt">(optional)</span>}
    </label>
  );
}

const Help = ({ id, help }: { id: string; help?: string }) =>
  help ? <p id={`${id}-help`} className="fm-help">{help}</p> : null;

export function TextField({ id, label, optional, help, error, ...input }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="fm-field">
      <Label id={id} label={label} optional={optional} />
      <input id={id} className="fm-input" aria-invalid={!!error} aria-describedby={describedBy(id, help, error)} {...input} />
      <Help id={id} help={help} />
      <FieldError id={id} error={error} />
    </div>
  );
}

export function TextareaField({ id, label, optional, help, error, ...input }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="fm-field">
      <Label id={id} label={label} optional={optional} />
      <textarea id={id} className="fm-input fm-textarea" aria-invalid={!!error} aria-describedby={describedBy(id, help, error)} {...input} />
      <Help id={id} help={help} />
      <FieldError id={id} error={error} />
    </div>
  );
}

export function SelectField({
  id, label, error, value, onChange, placeholder, options, name, autoComplete,
}: Common & {
  value: string; onChange: (v: string) => void; placeholder: string;
  options: (string | { value: string; label: string })[]; name?: string; autoComplete?: string;
}) {
  return (
    <div className="fm-field">
      <Label id={id} label={label} />
      <select
        id={id} name={name} autoComplete={autoComplete}
        className="fm-input fm-select" data-empty={value === ""}
        value={value} onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error} aria-describedby={describedBy(id, undefined, error)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const optionValue = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;
          return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
        })}
      </select>
      <FieldError id={id} error={error} />
    </div>
  );
}

export function LevelField({
  id, value, onChange, levels, error,
}: { id: string; value: string; onChange: (v: string) => void; levels: readonly string[]; error?: string }) {
  return (
    <fieldset className={`fm-field fm-fieldset${error ? " fm-fieldset--invalid" : ""}`} aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="fm-label">Academic level</legend>
      <div className="fm-chips">
        {levels.map((l, i) => (
          <label className="fm-chip" key={l}>
            <input
              type="radio" name={id} value={l} id={i === 0 ? id : undefined}
              checked={value === l} onChange={() => onChange(l)}
            />
            <span>{l}</span>
          </label>
        ))}
      </div>
      <FieldError id={id} error={error} />
    </fieldset>
  );
}

export function CheckboxField({
  id, checked, onChange, error, children,
}: { id: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: ReactNode }) {
  return (
    <div className="fm-field">
      <label className="fm-check">
        <input
          id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
          aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        />
        <span>{children}</span>
      </label>
      <FieldError id={id} error={error} />
    </div>
  );
}

export function InterestField({
  id, options, value, onChange,
}: { id: string; options: readonly string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  return (
    <fieldset className="fm-field fm-fieldset">
      <legend className="fm-label">What are you interested in? <span className="fm-opt">(optional)</span></legend>
      <div className="fm-interests">
        {options.map((o) => (
          <label className="fm-interest" key={o}>
            <input type="checkbox" name={id} value={o} checked={value.includes(o)} onChange={() => toggle(o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Hidden spam trap. Real users never see or fill it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="fm-hp" aria-hidden="true">
      <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} /></label>
    </div>
  );
}
