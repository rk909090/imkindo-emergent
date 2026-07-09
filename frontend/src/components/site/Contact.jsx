import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight, Check } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const INTERESTED_IN = [
    "Investing in Imkindo / AI Ventures",
    "NowMoveMe Partnership / Investment",
    "NowAgentAI Partnership",
    "AI Implementation for my Business",
    "Bespoke AI Project",
    "Strategic Partnership",
    "Media / Other",
];

const ORG_TYPES = [
    "Investor / VC",
    "Family Office",
    "Private Investor",
    "Enterprise Business",
    "SME Business",
    "Property / Real Estate",
    "Hospitality / Travel",
    "Technology Partner",
    "Other",
];

const initialForm = {
    name: "",
    company: "",
    position: "",
    email: "",
    phone: "",
    country: "",
    interested_in: "",
    organisation_type: "",
    message: "",
    website: "", // honeypot — must remain empty for real users
};

export default function Contact() {
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const set = (k) => (e) =>
        setForm((p) => ({ ...p, [k]: e.target ? e.target.value : e }));

    const submit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.interested_in || !form.organisation_type || !form.message) {
            toast.error("Please complete the required fields.");
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(`${API}/enquiries`, form);
            setSubmitted(true);
            setForm(initialForm);
            toast.success("Enquiry received. We'll be in touch.");
        } catch (err) {
            const detail = err?.response?.data?.detail;
            toast.error(
                typeof detail === "string"
                    ? detail
                    : "Unable to send enquiry. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section
            id="contact"
            data-testid="contact-section"
            className="relative border-t border-white/10 py-24 lg:py-40"
        >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Left */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex items-center gap-3 reveal">
                            <span className="card-marker" />
                            <span className="overline">06 // Contact</span>
                        </div>
                        <h2
                            data-testid="contact-headline"
                            className="font-display text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[0.95] reveal"
                        >
                            Start a
                            <br />
                            Conversation
                            <span className="text-[#e60000]">.</span>
                        </h2>
                        <p className="text-neutral-400 leading-relaxed text-[15px] max-w-md reveal">
                            Whether you are interested in investment,
                            partnerships or exploring AI opportunities, we
                            would like to hear from you.
                        </p>

                        <div className="pt-8 border-t border-white/10 space-y-4 reveal">
                            <Row
                                k="Direct"
                                v={
                                    <a
                                        href="mailto:mark@imkindo.com"
                                        className="text-white hover:text-[#e60000] transition-colors"
                                        data-testid="contact-email-link"
                                    >
                                        mark@imkindo.com
                                    </a>
                                }
                            />
                            <Row k="Ventures" v="NowAgentAI™ · NowMoveMe™" />
                            <Row k="Response" v="Personal — where value fits." />
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="lg:col-span-7">
                        {submitted ? (
                            <SuccessBlock
                                onReset={() => setSubmitted(false)}
                            />
                        ) : (
                            <form
                                onSubmit={submit}
                                className="reveal"
                                data-testid="enquiry-form"
                                noValidate
                            >
                                {/* Honeypot — hidden from humans and screen readers,
                                    but bots will fill it. Server silently drops any
                                    submission where this field is non-empty. */}
                                <div
                                    aria-hidden="true"
                                    style={{
                                        position: "absolute",
                                        left: "-10000px",
                                        top: "auto",
                                        width: "1px",
                                        height: "1px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <label>
                                        Website (leave blank)
                                        <input
                                            type="text"
                                            name="website"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            value={form.website}
                                            onChange={set("website")}
                                        />
                                    </label>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                    <Field label="Name *" required>
                                        <input
                                            className="imk-input"
                                            value={form.name}
                                            onChange={set("name")}
                                            required
                                            autoComplete="name"
                                            data-testid="enquiry-name-input"
                                        />
                                    </Field>
                                    <Field label="Company">
                                        <input
                                            className="imk-input"
                                            value={form.company}
                                            onChange={set("company")}
                                            autoComplete="organization"
                                            data-testid="enquiry-company-input"
                                        />
                                    </Field>
                                    <Field label="Position">
                                        <input
                                            className="imk-input"
                                            value={form.position}
                                            onChange={set("position")}
                                            autoComplete="organization-title"
                                            data-testid="enquiry-position-input"
                                        />
                                    </Field>
                                    <Field label="Email *" required>
                                        <input
                                            type="email"
                                            className="imk-input"
                                            value={form.email}
                                            onChange={set("email")}
                                            required
                                            autoComplete="email"
                                            data-testid="enquiry-email-input"
                                        />
                                    </Field>
                                    <Field label="Phone">
                                        <input
                                            type="tel"
                                            className="imk-input"
                                            value={form.phone}
                                            onChange={set("phone")}
                                            autoComplete="tel"
                                            data-testid="enquiry-phone-input"
                                        />
                                    </Field>
                                    <Field label="Country">
                                        <input
                                            className="imk-input"
                                            value={form.country}
                                            onChange={set("country")}
                                            autoComplete="country-name"
                                            data-testid="enquiry-country-input"
                                        />
                                    </Field>
                                    <Field label="I am interested in *" required>
                                        <BareSelect
                                            value={form.interested_in}
                                            onChange={(v) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    interested_in: v,
                                                }))
                                            }
                                            placeholder="Select an option"
                                            options={INTERESTED_IN}
                                            testId="enquiry-interested-select"
                                        />
                                    </Field>
                                    <Field label="Organisation Type *" required>
                                        <BareSelect
                                            value={form.organisation_type}
                                            onChange={(v) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    organisation_type: v,
                                                }))
                                            }
                                            placeholder="Select an option"
                                            options={ORG_TYPES}
                                            testId="enquiry-orgtype-select"
                                        />
                                    </Field>
                                    <div className="sm:col-span-2">
                                        <Field label="Tell us about the opportunity *" required>
                                            <textarea
                                                className="imk-input"
                                                rows={4}
                                                value={form.message}
                                                onChange={set("message")}
                                                required
                                                data-testid="enquiry-message-input"
                                            />
                                        </Field>
                                    </div>
                                </div>

                                <div className="mt-12 flex items-center justify-between gap-6 flex-wrap">
                                    <p className="text-xs text-neutral-500 max-w-md leading-relaxed">
                                        We respond personally where there is an
                                        opportunity to create value together.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="imk-btn imk-btn-primary"
                                        data-testid="enquiry-submit-button"
                                    >
                                        {submitting
                                            ? "Sending..."
                                            : "Send Enquiry"}
                                        <ArrowUpRight
                                            size={18}
                                            strokeWidth={1.5}
                                        />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Row({ k, v }) {
    return (
        <div className="flex items-baseline justify-between gap-6 py-3 border-b border-white/5">
            <span className="overline">{k}</span>
            <span className="text-sm text-neutral-300">{v}</span>
        </div>
    );
}

function Field({ label, required, children }) {
    return (
        <label className="flex flex-col gap-1">
            <span className="overline">{label}</span>
            {children}
        </label>
    );
}

function BareSelect({ value, onChange, options, placeholder, testId }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger
                data-testid={testId}
                className="w-full !bg-transparent !border-0 !border-b !border-b-white/20 !rounded-none !h-auto !px-0 !py-[14px] !text-[15px] text-white hover:!border-b-white/40 focus:!border-b-[#e60000] focus:!ring-0 shadow-none"
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent
                className="bg-[#0a0a0a] border border-white/10 text-white rounded-none"
                position="popper"
            >
                {options.map((o) => (
                    <SelectItem
                        key={o}
                        value={o}
                        data-testid={`${testId}-option-${o
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")}`}
                        className="text-white focus:bg-[#161616] focus:text-white rounded-none"
                    >
                        {o}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function SuccessBlock({ onReset }) {
    return (
        <div
            className="border border-white/10 bg-[#0a0a0a] p-10 lg:p-14 reveal in-view"
            data-testid="enquiry-success"
        >
            <div className="flex items-center gap-3 mb-8">
                <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-none bg-[#e60000]"
                    aria-hidden="true"
                >
                    <Check size={16} strokeWidth={2.5} className="text-white" />
                </span>
                <span className="overline">Enquiry Received</span>
            </div>
            <h3 className="font-display text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                Thank you for contacting Imkindo
                <span className="text-[#e60000]">.</span>
            </h3>
            <p className="mt-6 text-neutral-400 leading-relaxed max-w-xl">
                Your enquiry has been received and we will respond personally
                where there is an opportunity to create value together.
            </p>
            <button
                type="button"
                onClick={onReset}
                className="imk-btn imk-btn-secondary mt-10"
                data-testid="enquiry-send-another-button"
            >
                Send another enquiry
            </button>
        </div>
    );
}
