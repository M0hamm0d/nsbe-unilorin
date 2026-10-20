"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { DEPARTMENTS, LEVELS } from "@/lib/academic-resources";
import { INTERESTS, validateJoin, type Errors, type JoinInput } from "@/lib/validation";
import { submitForm } from "@/lib/submit-form";
import {
  CheckboxField, Honeypot, InterestField, LevelField, SelectField, TextField,
} from "./fields";
import { ErrorCard, SubmittedCard } from "./FormStates";

const EMPTY: JoinInput = { fullName: "", email: "", department: "", level: "", phone: "", interests: [], consent: false };
const FIELD_ORDER: (keyof JoinInput)[] = ["fullName", "email", "department", "level", "phone", "consent"];
const DEPARTMENT_NAMES = DEPARTMENTS.map((d) => d.name);

type Status = "editing" | "submitting" | "success" | "error";

export default function JoinForm() {
  const [values, setValues] = useState<JoinInput>(EMPTY);
  const [errors, setErrors] = useState<Errors<JoinInput>>({});
  const [status, setStatus] = useState<Status>("editing");
  const [attempted, setAttempted] = useState(false);
  const [trap, setTrap] = useState("");

  function update<K extends keyof JoinInput>(key: K, value: JoinInput[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (attempted) {
      // Re-check only the field being edited so errors clear as soon as they are fixed
      const message = validateJoin(next)[key];
      setErrors((prev) => {
        const copy = { ...prev };
        if (message) copy[key] = message; else delete copy[key];
        return copy;
      });
    }
  }

  async function send() {
    setStatus("submitting");
    const result = await submitForm("/api/join", { ...values, website: trap });
    if (result.ok) return setStatus("success");
    if (result.kind === "validation") {
      setErrors(result.errors as Errors<JoinInput>);
      return setStatus("editing");
    }
    setStatus("error");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return; // blocks double submits
    setAttempted(true);
    const found = validateJoin(values);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      document.getElementById(`join-${first}`)?.focus();
      return;
    }
    await send();
  }

  if (status === "success") {
    return (
      <SubmittedCard
        title="Your membership interest has been sent."
        firstName={values.fullName.trim().split(" ")[0]}
        body="An executive will email you about next steps."
        primary={{ href: "/events", label: "See upcoming events" }}
      />
    );
  }
  if (status === "error") return <ErrorCard onRetry={send} retrying={false} />;

  const submitting = status === "submitting";

  return (
    <form className="fm-card fm-form" onSubmit={onSubmit} noValidate>
      <div>
        <h2 className="fm-form__title">Tell us about you</h2>
        <p className="fm-form__note">All fields are required unless marked optional.</p>
      </div>

      <TextField id="join-fullName" name="fullName" label="Full name" placeholder="e.g. Amina Yusuf" autoComplete="name" maxLength={100}
        value={values.fullName} onChange={(e) => update("fullName", e.target.value)} error={errors.fullName} aria-required="true" />

      <TextField id="join-email" name="email" type="email" label="Email address" placeholder="name@example.com" autoComplete="email" maxLength={254}
        help="We reply to this address." value={values.email} onChange={(e) => update("email", e.target.value)} error={errors.email} aria-required="true" />

      <SelectField id="join-department" name="department" autoComplete="off" label="Department" placeholder="Select your department"
        options={DEPARTMENT_NAMES} value={values.department} onChange={(v) => update("department", v)} error={errors.department} />

      <LevelField id="join-level" levels={LEVELS} value={values.level} onChange={(v) => update("level", v)} error={errors.level} />

      <TextField id="join-phone" name="phone" type="tel" label="Phone number" optional placeholder="e.g. 0803 000 0000" autoComplete="tel" maxLength={20}
        help="Only used if we can’t reach you by email." value={values.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />

      <InterestField id="join-interests" options={INTERESTS} value={values.interests} onChange={(v) => update("interests", v)} />

      <CheckboxField id="join-consent" checked={values.consent} onChange={(v) => update("consent", v)} error={errors.consent}>
        I agree that NSBE Unilorin may contact me about joining the chapter.{" "}
        <Link href="/privacy" className="link">Read the privacy notice</Link>.
      </CheckboxField>

      <Honeypot value={trap} onChange={setTrap} />

      <button type="submit" className="btn fm-submit" disabled={submitting} aria-disabled={submitting}>
        {submitting ? "Sending…" : "Send my membership interest"}
      </button>
      <p className="fm-form__foot">We use these details only to contact you about joining the chapter.</p>
    </form>
  );
}
