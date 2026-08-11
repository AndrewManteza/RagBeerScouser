import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askQuestion = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await axios.post('/api/ask', { question });
      setAnswer(response.data.answer);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "What is the alcohol content of a Lager?",
    "What are the flavors in a Belgian Tripel?",
    "How is an IPA different from a Pale Ale?",
    "Describe a Stout beer"
  ];

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🍺 Beer Knowledge Chatbot</h1>
          <p className="subtitle">Ask me anything about beer styles, brewing, and flavors!</p>
        </header>

        <form onSubmit={askQuestion} className="question-form">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about beer..."
            rows="3"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? '🤔 Thinking...' : '🍺 Ask'}
          </button>
        </form>

        <div className="examples">
          <p className="examples-title">Try these:</p>
          {exampleQuestions.map((q, i) => (
            <button
              key={i}
              className="example-btn"
              onClick={() => setQuestion(q)}
              disabled={loading}
            >
              {q}
            </button>
          ))}
        </div>

        {error && (
          <div className="error">
            ❌ {error}
          </div>
        )}

        {answer && (
          <div className="answer">
            <h3>Answer:</h3>
            <p>{answer}</p>
          </div>
        )}

        <footer className="footer">
          Powered by Databricks RAG + Vector Search
        </footer>
      </div>
    </div>
  );
}

export default App;
