import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('qa');
  
  // Q&A state
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Comparison state
  const [style1, setStyle1] = useState('');
  const [style2, setStyle2] = useState('');
  const [comparison, setComparison] = useState('');
  const [compLoading, setCompLoading] = useState(false);
  const [compError, setCompError] = useState('');

  // Q&A Handler
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

  // Comparison Handler
  const compareStyles = async (e) => {
    e.preventDefault();
    
    if (!style1.trim() || !style2.trim()) {
      setCompError('Please enter both beer styles');
      return;
    }

    if (style1.trim().toLowerCase() === style2.trim().toLowerCase()) {
      setCompError('Please enter two different beer styles');
      return;
    }

    setCompLoading(true);
    setCompError('');
    setComparison('');

    try {
      const response = await axios.post('/api/compare', { style1, style2 });
      setComparison(response.data.comparison);
    } catch (err) {
      console.error('Error:', err);
      setCompError(err.response?.data?.error || 'Failed to compare styles. Please try again.');
    } finally {
      setCompLoading(false);
    }
  };

  const exampleQuestions = [
    "What is the alcohol content of a Lager?",
    "What are the flavors in a Belgian Tripel?",
    "How is an IPA different from a Pale Ale?",
    "Describe a Stout beer"
  ];

  const exampleComparisons = [
    { style1: "IPA", style2: "Lager" },
    { style1: "Stout", style2: "Porter" },
    { style1: "Pilsner", style2: "Wheat Beer" }
  ];

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🍺 Beer Knowledge Chatbot</h1>
          <p className="subtitle">Ask questions or compare beer styles!</p>
        </header>

        {/* Tab Navigation */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'qa' ? 'active' : ''}`}
            onClick={() => setActiveTab('qa')}
          >
            💬 Q&A Chat
          </button>
          <button
            className={`tab ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            ⚖️ Compare Styles
          </button>
        </div>

        {/* Q&A Tab Content */}
        {activeTab === 'qa' && (
          <div className="tab-content">
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
          </div>
        )}

        {/* Comparison Tab Content */}
        {activeTab === 'compare' && (
          <div className="tab-content">
            <form onSubmit={compareStyles} className="comparison-form">
              <div className="input-group">
                <label>First Beer Style</label>
                <input
                  type="text"
                  value={style1}
                  onChange={(e) => setStyle1(e.target.value)}
                  placeholder="e.g., IPA"
                  disabled={compLoading}
                />
              </div>
              
              <div className="input-group">
                <label>Second Beer Style</label>
                <input
                  type="text"
                  value={style2}
                  onChange={(e) => setStyle2(e.target.value)}
                  placeholder="e.g., Lager"
                  disabled={compLoading}
                />
              </div>

              <button type="submit" disabled={compLoading}>
                {compLoading ? '⚖️ Comparing...' : '⚖️ Compare'}
              </button>
            </form>

            <div className="examples">
              <p className="examples-title">Try these comparisons:</p>
              {exampleComparisons.map((comp, i) => (
                <button
                  key={i}
                  className="example-btn"
                  onClick={() => {
                    setStyle1(comp.style1);
                    setStyle2(comp.style2);
                  }}
                  disabled={compLoading}
                >
                  {comp.style1} vs {comp.style2}
                </button>
              ))}
            </div>

            {compError && (
              <div className="error">
                ❌ {compError}
              </div>
            )}

            {comparison && (
              <div className="comparison-result">
                <div className="markdown-content">
                  {comparison.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) {
                      return <h2 key={i}>{line.replace('## ', '')}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={i}>{line.replace('### ', '')}</h3>;
                    } else if (line.startsWith('---')) {
                      return <hr key={i} />;
                    } else if (line.startsWith('- **')) {
                      const match = line.match(/- \*\*(.+?)\*\*(.+)/);
                      if (match) {
                        return <li key={i}><strong>{match[1]}</strong>{match[2]}</li>;
                      }
                      return <li key={i}>{line.replace('- ', '')}</li>;
                    } else if (line.trim()) {
                      return <p key={i}>{line}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
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
