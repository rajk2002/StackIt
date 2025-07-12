import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function AllQuestions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

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
          questions.map((q) => (
            <div key={q._id} className="question-card">
              <h3>{q.title}</h3>
              <p>{q.body.slice(0, 120)}...</p>
              <div className="question-footer">
                <span className="username">@{q.askedBy || "anonymous"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllQuestions;
