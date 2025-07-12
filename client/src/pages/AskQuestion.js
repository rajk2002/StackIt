import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function AskQuestion() {
  const [form, setForm] = useState({ title: "", body: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Frontend validation
    if (!form.title.trim() || !form.body.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post question");

      navigate("/"); // ✅ redirect to home after success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Ask a Question</h2>
      {error && <div className="error">{error}</div>}

      <input
        type="text"
        name="title"
        placeholder="Question Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="body"
        placeholder="Explain your question in detail"
        rows="6"
        value={form.body}
        onChange={handleChange}
        required
      />

      <button type="submit">Submit Question</button>
    </form>
  );
}

export default AskQuestion;
