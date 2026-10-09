"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSent(true);
      setFormState({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="hq-form hq-form-sent" role="status">
        <b>Message sent.</b>
        <p>We&apos;ll get back to you shortly.</p>
        <button type="button" className="hq-btn-ghost" onClick={() => setIsSent(false)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hq-form">
      <div className="hq-form-row">
        <label>
          <span>Name</span>
          <input
            required
            type="text"
            autoComplete="name"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            placeholder="Your name"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label>
        <span>Message</span>
        <textarea
          required
          rows={4}
          value={formState.message}
          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
          placeholder="What keeps breaking?"
        />
      </label>
      <div className="hq-form-foot">
        {error && <p role="alert">Something went wrong. Try again, or email info@bespokeapps.co.za.</p>}
        <button type="submit" className="hq-btn" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send message"} <Send size={13} />
        </button>
      </div>
    </form>
  );
}
