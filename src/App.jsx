import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { FaPlay, FaStop } from "react-icons/fa";

const App = () => {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : false;
  });

  const [isReading, setIsReading] = useState(false);

  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem("dictionary-history");
    return stored ? JSON.parse(stored) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("dictionary-favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("dictionary-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("dictionary-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleSearch = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setResult(data[0]);
        setHistory((prev) => [word, ...prev.filter((w) => w !== word)].slice(0, 20));
      } else {
        setError("Word not found.");
        setResult(null);
      }
    } catch (err) {
      setError("Failed to fetch.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (w) => {
    setFavorites((prev) =>
      prev.includes(w) ? prev.filter((f) => f !== w) : [...prev, w]
    );
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.voice = speechSynthesis.getVoices()[0];
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    speechSynthesis.cancel();
    setIsReading(false);
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start sm:items-center gap-3">
          <h1 className="text-xl sm:text-4xl font-bold">📖 WordWise</h1>
          <button
            onClick={toggleTheme}
            className="rounded-md bg-gray-700 px-3 py-2 text-white hover:bg-gray-600 w-auto"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Search Input & Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word..."
            className="px-4 py-2 w-full border rounded-md dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="flex justify-center">
            <ClipLoader color="#2563eb" size={40} />
          </div>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Search Result */}
        {result && (
          <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-bold">{result.word}</h2>
              {result.phonetics?.[0]?.audio && (
                <button onClick={() => new Audio(result.phonetics[0].audio).play()}></button>
              )}
            </div>

            {/* Audio Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <button
                onClick={() => speakText(result.word)}
                className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 flex items-center gap-2 justify-center"
              >
                <FaPlay /> Read Word
              </button>
              <button
                onClick={() => speakText(result.meanings.map(m => m.definitions.map(d => d.definition).join(" ")).join(" "))}
                className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-700 flex items-center gap-2 justify-center"
              >
                <FaPlay /> Read Meaning
              </button>
              {isReading && (
                <button
                  onClick={stopReading}
                  className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 flex items-center gap-2 animate-pulse justify-center"
                >
                  <FaStop /> Stop Reading
                </button>
              )}
            </div>

            {result.meanings.map((meaning, index) => (
              <div key={index}>
                <p className="italic font-medium">{meaning.partOfSpeech}</p>
                <ul className="list-disc ml-6 space-y-1">
                  {meaning.definitions.map((def, idx) => (
                    <li key={idx}>{def.definition}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Favorite Toggle */}
        {word && (
          <button
            onClick={() => toggleFavorite(word)}
            className={`w-full sm:w-auto px-4 py-2 rounded text-white ${favorites.includes(word) ? "bg-yellow-500" : "bg-gray-500 hover:bg-yellow-600"}`}
          >
            {favorites.includes(word) ? "⭐ Favorited" : "☆ Add to Favorites"}
          </button>
        )}

        {/* History and Favorites Sections */}
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          {/* History */}
          <div className="border rounded-md dark:border-gray-600 w-full">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full text-left px-4 py-2 font-semibold bg-gray-200 dark:bg-gray-700 dark:text-white"
            >
              🕓 Search History {showHistory ? "▲" : "▼"}
            </button>
            {showHistory && (
              <ul className="p-4 space-y-2">
                {history.map((h, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setWord(h);
                      handleSearch();
                    }}
                    className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {h}
                  </li>
                ))}
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="mt-3 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Clear History
                  </button>
                )}
              </ul>
            )}
          </div>

          {/* Favorites */}
          <div className="border rounded-md dark:border-gray-600 w-full">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className="w-full text-left px-4 py-2 font-semibold bg-gray-200 dark:bg-gray-700 dark:text-white"
            >
              ⭐ Favorites {showFavorites ? "▲" : "▼"}
            </button>
            {showFavorites && (
              <ul className="p-4 space-y-2">
                {favorites.map((fav, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setWord(fav);
                      handleSearch();
                    }}
                    className="cursor-pointer text-yellow-600 hover:underline dark:text-yellow-400"
                  >
                    {fav}
                  </li>
                ))}
                {favorites.length > 0 && (
                  <button
                    onClick={() => setFavorites([])}
                    className="mt-3 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Clear Favorites
                  </button>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;