// src/pages/Contact.jsx
import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Alert } from "@mui/material";
import emailjs from "@emailjs/browser";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // from .env
  const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const REPLY_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_REPLY_TEMPLATE_ID;
  const NOTIFY_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_NOTIFY_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const clearStatusAfter = (time = 4000) => {
    setTimeout(() => setStatus(null), time);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", msg: "Please fill all fields." });
      clearStatusAfter();
      return;
    }

    if (!SERVICE_ID || !REPLY_TEMPLATE_ID || !NOTIFY_TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus({ type: "error", msg: "Email service not configured. Check env variables." });
      clearStatusAfter(6000);
      return;
    }

    setLoading(true);
    setStatus(null);

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
    };

    try {
      // 1) Auto-reply to user
      await emailjs.send(SERVICE_ID, REPLY_TEMPLATE_ID, templateParams, PUBLIC_KEY);
      // 2) Notify you
      await emailjs.send(SERVICE_ID, NOTIFY_TEMPLATE_ID, templateParams, PUBLIC_KEY);

      setStatus({ type: "success", msg: "✅ Message sent! Check your inbox and we'll reply soon." });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ type: "error", msg: "❌ Email sending failed. Saved to messages." });
    }

    try {
      await addDoc(collection(db, "messages"), {
        name: form.name,
        email: form.email,
        message: form.message,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Firestore save error:", err);
      if (!status || status.type !== "success") {
        setStatus({ type: "error", msg: "❌ Failed to save message. Try again later." });
      }
    }

    setLoading(false);
    setForm({ name: "", email: "", message: "" });
    clearStatusAfter(6000);
  };

  return (
    <Container className="contact-page">
      <div className="contact-header">
        <Typography variant="h4" component="h1" className="contact-title">
          Get in Touch
        </Typography>
        <Typography className="contact-subtitle">
          We'd love to hear from you — send us a message and we'll respond soon.
        </Typography>
      </div>

      {status && (
        <Alert severity={status.type} sx={{ mb: 2 }}>
          {status.msg}
        </Alert>
      )}

      <div className="contact-wrapper">
        <div className="contact-form">
          <h2>Send us a message</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Your name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              className="input-field"
            />
            <TextField
              name="email"
              label="Email address"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              className="input-field"
            />
            <TextField
              name="message"
              label="Message"
              placeholder="Type your message here..."
              value={form.message}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={5}
              margin="normal"
              className="input-field"
            />

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button className="send-button" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
              <Button
                className="reset-button"
                onClick={() => setForm({ name: "", email: "", message: "" })}
                disabled={loading}
              >
                Reset
              </Button>
            </Box>
          </form>
        </div>

        <aside className="contact-info">
          <h2>Other ways to reach us</h2>
          <div className="reach-buttons">
            <Button
              className="reach-btn email-btn"
              href="mailto:example@gmail.com"
              target="_blank"
            >
              📧 Email Us
            </Button>
            <Button
              className="reach-btn indiamart-btn"
              href="https://www.yashtech.co.in/?pos=2&kwd=panel%20ac&tags=rk:A|plc:1|dt:0|db:01|prc:1|dtp:p|pfs:1|sv:T|rsf:gd|ri:T_A_0_P-|-res:RC3|ktp:N0|stype:attr=1|mtp:S|wc:2|lcf:3|cq:faridabad|qr_nm:gl-gd|cs:18292|com-cf:nl|ptrs:na|mc:131683|cat:66|qry_typ:P|lang:en|tyr:2|qrd:250918|mrd:250819|prdt:250920|msf:hs|pfen:1|gli:G0I1|gc:Faridabad|ic:New%20Delhi|scw:1|v=4|crs=xnh-city"
              target="_blank"
              rel="noreferrer"
            >
              🛒 IndiaMART Profile
            </Button>
            <Button
              className="reach-btn whatsapp-btn"
              href="https://wa.me/911234567890"
              target="_blank"
              rel="noreferrer"
            >
              💬 WhatsApp Message
            </Button>
          </div>

          <div className="map-card">
            <p>📍 Our Location</p>
            <iframe
              title="Google Map"
              src="https://maps.google.com/maps?q=Faridabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="200"
              style={{ border: "none", borderRadius: 12 }}
              loading="lazy"
            />
          </div>
        </aside>
      </div>
    </Container>
  );
};

export default Contact;
