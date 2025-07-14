import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { FaPlay, FaStop } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import axios from "axios"; // ✅ You must import axios since you're using it

const Dictionary = () => {
    const [word, setWord] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [notFound, setNotFound] = useState(false);

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

    const handleSearch = async (customWord) => {
        const query = (customWord || word).trim();
        if (!query) return;
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`
            );
            setResult(res.data[0]);
            setNotFound(false);
            setHistory((prev) => [query, ...prev.filter((w) => w !== query)].slice(0, 20));
        } catch (error) {
            setNotFound(true);
            setResult(null);
            setError("Word not found.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!word.trim()) {
                setSuggestions([]);
                return;
            }
            try {
                const res = await fetch(`https://api.datamuse.com/sug?s=${word}`);
                const data = await res.json();
                setSuggestions(data.slice(0, 5));
            } catch {
                setSuggestions([]);
            }
        };

        const timeout = setTimeout(fetchSuggestions, 300); // debounce
        return () => clearTimeout(timeout);
    }, [word]);

    const toggleFavorite = (w) => {
        setFavorites((prev) =>
            prev.includes(w) ? prev.filter((f) => f !== w) : [...prev, w]
        );
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.voice = speechSynthesis.getVoices()[0] || null;
        utterance.onstart = () => setIsReading(true);
        utterance.onend = () => setIsReading(false);
        speechSynthesis.speak(utterance);
    };

    const stopReading = () => {
        speechSynthesis.cancel();
        setIsReading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen text-gray-900 dark:text-white bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        >
            <Header />
            <div className="max-w-3xl mx-auto space-y-6 px-4 py-10 sm:px-8">

                {/* Search Input */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative flex flex-col sm:flex-row gap-3 items-stretch"
                >
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={word}
                            onChange={(e) => {
                                setWord(e.target.value);
                                setIsTyping(true);
                            }}
                            onBlur={() => setTimeout(() => setIsTyping(false), 150)}
                            onFocus={() => word && setIsTyping(true)}
                            placeholder="Enter a word..."
                            className="px-4 py-2 w-full border rounded-md dark:bg-gray-800 dark:border-gray-600"
                        />

                        <button
                            onClick={() => handleSearch()}
                            className="mt-2 sm:mt-0 sm:absolute right-0 top-0 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                        >
                            Search
                        </button>

                        {isTyping && suggestions.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow mt-1">
                                {suggestions.map((sugg, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => {
                                            setWord(sugg.word);
                                            setIsTyping(false);
                                            handleSearch(sugg.word);
                                        }}
                                        className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer"
                                    >
                                        {sugg.word}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </motion.div>

                {/* Loader */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center"
                    >
                        <ClipLoader color="#2563eb" size={40} />
                    </motion.div>
                )}

                {/* Error */}
                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-red-500"
                    >
                        {error}
                    </motion.p>
                )}

                {/* Result */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow space-y-4"
                        >
                            <div className="flex justify-between items-center flex-wrap gap-2">
                                <h2 className="text-xl sm:text-2xl font-bold">{result.word}</h2>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                                <button
                                    onClick={() => speakText(result.word)}
                                    className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 flex items-center gap-2 justify-center"
                                >
                                    <FaPlay /> Read Word
                                </button>
                                <button
                                    onClick={() =>
                                        speakText(
                                            result.meanings
                                                .map((m) =>
                                                    m.definitions
                                                        .map((d) => d.definition)
                                                        .join(" ")
                                                )
                                                .join(" ")
                                        )
                                    }
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
                            {result?.phonetic && (
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    <span className="font-medium">Transcription:</span>{" "}
                                    <span className="italic">{result?.phonetic}</span>
                                </p>
                            )}

                            {result.meanings.map((meaning, index) => (
                                <div key={index}>
                                    <p className="italic font-medium">{meaning.partOfSpeech}</p>
                                    <ul className="list-disc ml-6 space-y-1">
                                        {meaning.definitions.map((def, j) => (
                                            <li key={j} className="mb-4">
                                                <p className="text-base">{def.definition}</p>
                                                {def.example && (
                                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium">Example:</span>{" "}
                                                        <em>{def.example}</em>
                                                    </p>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Favorite Button */}
                {word && (
                    <motion.button
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => toggleFavorite(word)}
                        className={`w-full sm:w-auto px-4 py-2 rounded text-white ${favorites.includes(word)
                            ? "bg-yellow-500"
                            : "bg-gray-500 hover:bg-yellow-600"
                            }`}
                    >
                        {favorites.includes(word) ? "⭐ Favorited" : "☆ Add to Favorites"}
                    </motion.button>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* History */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="border rounded-md dark:border-gray-600 w-full"
                    >
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="w-full text-left px-4 py-2 font-semibold bg-gray-200 dark:bg-gray-700 dark:text-white"
                        >
                            🕓 Search History {showHistory ? "▲" : "▼"}
                        </button>
                        <AnimatePresence>
                            {showHistory && (
                                <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-4 space-y-2 overflow-hidden"
                                >
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
                                    {history.length > 0 ? (
                                        <button
                                            onClick={() => setHistory([])}
                                            className="mt-3 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >
                                            Clear History
                                        </button>
                                    ) : (
                                        <div>You do not have any history</div>
                                    )}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Favorites */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="border rounded-md dark:border-gray-600 w-full"
                    >
                        <button
                            onClick={() => setShowFavorites(!showFavorites)}
                            className="w-full text-left px-4 py-2 font-semibold bg-gray-200 dark:bg-gray-700 dark:text-white"
                        >
                            ⭐ Favorites {showFavorites ? "▲" : "▼"}
                        </button>
                        <AnimatePresence>
                            {showFavorites && (
                                <motion.ul
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-4 space-y-2 overflow-hidden"
                                >
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
                                    {favorites.length > 0 ? (
                                        <button
                                            onClick={() => setFavorites([])}
                                            className="mt-3 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >
                                            Clear Favorites
                                        </button>
                                    ) : (
                                        <div>You do not have any favorites</div>
                                    )}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dictionary;
