"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { DEPARTMENTS, LEVELS } from "@/lib/academic-resources";
import { validateTutorial, type Errors, type TutorialInput } from "@/lib/validation";
import { submitForm } from "@/lib/submit-form";
import { CheckboxField, Honeypot, LevelField, SelectField, TextField, TextareaField } from "./fields";
import { ErrorCard, SubmittedCard } from "./FormStates";

const EMPTY: TutorialInput = { fullName: "", email: "", department: "", level: "", subjects: "", phone: "", consent: false };
const FIELD_ORDER: (keyof TutorialInput)[] = ["fullName", "email", "department", "level", "subjects", "phone", "consent"];
const DEPARTMENT_NAMES = DEPARTMENTS.map((d) => d.name);

type Status = "editing" | "submitting" | "success" | "error";

export default function TutorialForm() {
  const [values, setValues] = useState<TutorialInput>(EMPTY);
  const [errors, setErrors] = useState<Errors<TutorialInput>>({});
  const [status, setStatus] = useState<Status>("editing");
  const [attempted, setAttempted] = useState(false);
  const [trap, setTrap] = useState("");

  function update<K extends keyof TutorialInput>(key: K, value: TutorialInput[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (attempted) {
      const message = validateTutorial(next)[key];
      setErrors((prev) => {
        const copy = { ...prev };
        if (message) copy[key] = message; else delete copy[key];
        return copy;
      });
    }
  }

  async function send() {
    setStatus("submitting");
    const result = await submitForm("/api/tutorial-interest", { ...values, website: trap });
    if (result.ok) return setStatus("success");
    if (result.kind === "validation") {
      setErrors(result.errors as Errors<TutorialInput>);
      return setStatus("editing");
    }
    setStatus("error");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setAttempted(true);
    const found = validateTutorial(values);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      document.getElementById(`tutorial-${first}`)?.focus();
      return;
    }
    await send();
  }

  if (status === "success") {
    return (
      <SubmittedCard
        title="Your tutorial interest is registered."
        firstName={values.fullName.trim().split(" ")[0]}
        body="We have recorded your interest and will email you if a tutorial that matches is planned. This is not a booking, and nothing is confirmed yet."
        primary={{ href: "/academic-hub", label: "Browse the Academic Hub" }}
      />
    );
  }
  if (status === "error") return <ErrorCard onRetry={send} retrying={false} />;

  const submitting = status === "submitting";

  return (
    <form className="fm-card fm-form" onSubmit={onSubmit} noValidate>
      <div>
        <h2 className="fm-form__title">Your details</h2>
        <p className="fm-form__note">All fields are required unless marked optional.</p>
      </div>

      <div className="fm-row">
        <TextField id="tutorial-fullName" name="fullName" label="Full name" placeholder="e.g. Amina Yusuf" autoComplete="name" maxLength={100}
          value={values.fullName} onChange={(e) => update("fullName", e.target.value)} error={errors.fullName} aria-required="true" />
        <TextField id="tutorial-email" name="email" type="email" label="Email address" placeholder="name@example.com" autoComplete="email" maxLength={254}
          value={values.email} onChange={(e) => update("email", e.target.value)} error={errors.email} aria-required="true" />
      </div>

      <SelectField id="tutorial-department" name="department" autoComplete="off" label="Department" placeholder="Select your department"
        options={DEPARTMENT_NAMES} value={values.department} onChange={(v) => update("department", v)} error={errors.department} />

      <LevelField id="tutorial-level" levels={LEVELS} value={values.level} onChange={(v) => update("level", v)} error={errors.level} />

      <TextareaField id="tutorial-subjects" name="subjects" label="Tutorial subjects or areas of interest" placeholder="e.g. Engineering Mathematics, Circuit Theory"
        rows={4} maxLength={500} help="List the courses or topics you would like help with."
        value={values.subjects} onChange={(e) => update("subjects", e.target.value)} error={errors.subjects} aria-required="true" />

      <TextField id="tutorial-phone" name="phone" type="tel" label="Phone number" optional placeholder="e.g. 0803 000 0000" autoComplete="tel" maxLength={20}
        help="Optional. Only used to reach you about tutorials." value={values.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />

      <CheckboxField id="tutorial-consent" checked={values.consent} onChange={(v) => update("consent", v)} error={errors.consent}>
        I have read the <Link href="/privacy" className="link">privacy notice</Link> and agree to NSBE Unilorin using my details to coordinate tutorials.
      </CheckboxField>

      <Honeypot value={trap} onChange={setTrap} />

      <button type="submit" className="btn fm-submit" disabled={submitting} aria-disabled={submitting}>
        {submitting ? "Registering…" : "Register my tutorial interest"}
      </button>
      <p className="fm-form__foot">
        Registering interest does not guarantee a tutorial. The chapter will confirm subjects, schedules and tutors.
      </p>
    </form>
  );
}
