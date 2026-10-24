"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { DEPARTMENTS, LEVELS, RESOURCE_TYPES } from "@/lib/academic-resources";
import {
  validateResourceRequest,
  type Errors,
  type ResourceRequestInput,
} from "@/lib/validation";
import { submitForm } from "@/lib/submit-form";
import { CheckboxField, Honeypot, SelectField, TextField, TextareaField } from "./fields";
import { ErrorCard, SubmittedCard } from "./FormStates";

const EMPTY: ResourceRequestInput = {
  fullName: "",
  email: "",
  department: "",
  level: "",
  phone: "",
  resourceType: "",
  courseCode: "",
  courseTitle: "",
  session: "",
  details: "",
  consent: false,
};
const FIELD_ORDER: (keyof ResourceRequestInput)[] = [
  "fullName", "email", "department", "level", "resourceType", "courseCode", "courseTitle", "session", "details", "phone", "consent",
];
const DEPARTMENT_NAMES = DEPARTMENTS.map((department) => department.name);
type Status = "editing" | "submitting" | "success" | "error";

export default function ResourceRequestForm() {
  const [values, setValues] = useState<ResourceRequestInput>(EMPTY);
  const [errors, setErrors] = useState<Errors<ResourceRequestInput>>({});
  const [status, setStatus] = useState<Status>("editing");
  const [attempted, setAttempted] = useState(false);
  const [trap, setTrap] = useState("");

  function update<K extends keyof ResourceRequestInput>(key: K, value: ResourceRequestInput[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (attempted) {
      const message = validateResourceRequest(next)[key];
      setErrors((previous) => {
        const copy = { ...previous };
        if (message) copy[key] = message;
        else delete copy[key];
        return copy;
      });
    }
  }

  async function send() {
    setStatus("submitting");
    const result = await submitForm("/api/resource-request", { ...values, website: trap });
    if (result.ok) return setStatus("success");
    if (result.kind === "validation") {
      setErrors(result.errors as Errors<ResourceRequestInput>);
      return setStatus("editing");
    }
    setStatus("error");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setAttempted(true);
    const found = validateResourceRequest(values);
    setErrors(found);
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) {
      document.getElementById(`resource-${first}`)?.focus();
      return;
    }
    await send();
  }

  if (status === "success") {
    return (
      <SubmittedCard
        title="Your resource request has been received."
        firstName={values.fullName.trim().split(" ")[0]}
        body="The chapter will review your request and contact you using the email address you provided if an update is available."
        primary={{ href: "/academic-hub", label: "Browse the Academic Hub" }}
      />
    );
  }
  if (status === "error") return <ErrorCard onRetry={send} retrying={false} />;

  const submitting = status === "submitting";

  return (
    <form className="fm-card fm-form" onSubmit={onSubmit} noValidate>
      <div>
        <h2 className="fm-form__title">What are you looking for?</h2>
        <p className="fm-form__note">Fields marked optional can be left blank.</p>
      </div>

      <div className="fm-row">
        <TextField id="resource-fullName" name="fullName" label="Full name" placeholder="e.g. Amina Yusuf" autoComplete="name" maxLength={100}
          value={values.fullName} onChange={(event) => update("fullName", event.target.value)} error={errors.fullName} aria-required="true" />
        <TextField id="resource-email" name="email" type="email" label="Email address" placeholder="name@example.com" autoComplete="email" maxLength={254}
          value={values.email} onChange={(event) => update("email", event.target.value)} error={errors.email} aria-required="true" />
      </div>

      <div className="fm-row">
        <SelectField id="resource-department" name="department" autoComplete="off" label="Department" placeholder="Select your department"
          options={DEPARTMENT_NAMES} value={values.department} onChange={(value) => update("department", value)} error={errors.department} />
        <SelectField id="resource-level" name="level" autoComplete="off" label="Academic level" placeholder="Select your level"
          options={[...LEVELS]} value={values.level} onChange={(value) => update("level", value)} error={errors.level} />
      </div>

      <SelectField id="resource-resourceType" name="resourceType" autoComplete="off" label="Resource type" placeholder="Select a resource type"
        options={RESOURCE_TYPES.map(({ value, label }) => ({ value, label }))} value={values.resourceType}
        onChange={(value) => update("resourceType", RESOURCE_TYPES.find((type) => type.value === value)?.value ?? "")} error={errors.resourceType} />

      <div className="fm-row">
        <TextField id="resource-courseCode" name="courseCode" label="Course code" optional placeholder="e.g. CPE 311" maxLength={30}
          value={values.courseCode} onChange={(event) => update("courseCode", event.target.value)} error={errors.courseCode} />
        <TextField id="resource-session" name="session" label="Session or year" optional placeholder="e.g. 2023/2024" maxLength={20}
          value={values.session} onChange={(event) => update("session", event.target.value)} error={errors.session} />
      </div>

      <TextField id="resource-courseTitle" name="courseTitle" label="Course or project title" placeholder="e.g. Data Structures & Algorithms" maxLength={150}
        value={values.courseTitle} onChange={(event) => update("courseTitle", event.target.value)} error={errors.courseTitle} aria-required="true" />

      <TextareaField id="resource-details" name="details" label="Anything else we should know?" optional
        placeholder="Add useful context about the material you need." rows={4} maxLength={500}
        value={values.details} onChange={(event) => update("details", event.target.value)} error={errors.details} />

      <TextField id="resource-phone" name="phone" type="tel" label="Phone number" optional placeholder="e.g. 0803 000 0000" autoComplete="tel" maxLength={20}
        help="Optional. Only used to follow up on this request." value={values.phone} onChange={(event) => update("phone", event.target.value)} error={errors.phone} />

      <CheckboxField id="resource-consent" checked={values.consent} onChange={(value) => update("consent", value)} error={errors.consent}>
        I have read the <Link href="/privacy" className="link">privacy notice</Link> and agree to NSBE Unilorin using my details to respond to this request.
      </CheckboxField>

      <Honeypot value={trap} onChange={setTrap} />

      <button type="submit" className="btn fm-submit" disabled={submitting} aria-disabled={submitting}>
        {submitting ? "Sending request…" : "Send resource request"}
      </button>
      <p className="fm-form__foot">
        Requests are reviewed by the chapter. Submitting a request does not guarantee that the resource is available.
      </p>
    </form>
  );
}
