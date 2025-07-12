import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function AllQuestions() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [answerInputs, setAnswerInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/questions");
      const questions = res.data;
      setQuestions(questions);

      // Fetch answers for each question
      const answersMap = {};
      for (const q of questions) {
        const res = await axios.get(`http://localhost:5000/api/answers/${q._id}`);
        answersMap[q._id] = res.data;
      }
      setAnswers(answersMap);
    } catch (err) {
      console.error("Error fetching questions/answers:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswerInputs((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleAnswerSubmit = async (questionId) => {
    const answerText = answerInputs[questionId];
    if (!answerText || answerText.trim() === "") {
      alert("Answer cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/answers/${questionId}`,
        { content: answerText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAnswerInputs((prev) => ({ ...prev, [questionId]: "" }));
      await fetchQuestions(); // ✅ Refresh to show new answer
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Failed to submit answer: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <h1 className="heading">All Questions</h1>
        <div className="button-group">
          <button onClick={() => navigate("/ask")} className="ask-btn">Ask Question</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="questions-grid">
        {questions.length === 0 ? (
          <p className="no-questions">No questions found.</p>
        ) : (
          questions.slice().reverse().map((q) => (
            <div key={q._id} className="question-card">
              <h3>{q.title || "Untitled"}</h3>
              <p>{q.description?.slice(0, 120) || "No description"}...</p>

              <div className="tags">
                {q.tags?.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>

              <div className="question-footer">
                <span className="username">@{q.userId?.username || "anonymous"}</span>
              </div>

              <div className="existing-answers">
                <h4>Answers:</h4>
                {answers[q._id]?.length > 0 ? (
                  answers[q._id].map((ans) => (
                    <div key={ans._id} className="answer-item">
                      <p>{ans.content}</p>
                      <small>— @{ans.userId?.username || "anonymous"}</small>
                    </div>
                  ))
                ) : (
                  <p className="no-answers">No answers yet.</p>
                )}
              </div>

              <div className="answer-section">
                <textarea
                  placeholder="Write your answer..."
                  value={answerInputs[q._id] || ""}
                  onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                  rows="3"
                  className="answer-textarea"
                />
                <button
                  onClick={() => handleAnswerSubmit(q._id)}
                  disabled={loading}
                  className="submit-answer-btn"
                >
                  {loading ? "Submitting..." : "Submit Answer"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllQuestions;
