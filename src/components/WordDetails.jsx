import React from "react";
import { FaPlay } from "react-icons/fa";

function WordDetails({ wordData }) {
    const phonetic = wordData.phonetics?.find((p) => p.audio);

    // Play pronunciation audio
    const handlePlayAudio = (url) => {
        const audio = new Audio(url);
        audio.play();
    };

    // Use Web Speech API to read all meanings aloud
    const handleSpeakAllMeanings = () => {
        const combinedText = result.meanings
            .map((meaning) => {
                const defs = meaning.definitions.map((def) => def.definition).join(". ");
                return `${meaning.partOfSpeech}: ${defs}`;
            })
            .join(". ");

        const utterance = new SpeechSynthesisUtterance(combinedText);
        utterance.rate = 1; // Normal speed
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold capitalize">{wordData.word}</h2>
                {phonetic?.audio && (
                    <button
                        onClick={() => {
                            const audio = new Audio(phonetic.audio);
                            audio.play();
                        }}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                        title="Play Pronunciation"
                    >
                        <FaPlay />
                    </button>
                )}
            </div>
            {phonetic?.text && <p className="italic text-gray-600 dark:text-gray-300">/{phonetic.text}/</p>}

            <div className="flex items-center gap-4 mt-4">
                {/* Play phonetic audio */}
                {phonetic?.audio && (
                    <button
                        onClick={() => handlePlayAudio(phonetic.audio)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        ▶️ Pronunciation
                    </button>
                )}

                {/* Read all definitions */}
                {result?.meanings?.length > 0 && (
                    <button
                        onClick={handleSpeakAllMeanings}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                    >
                        🔊 Read Meanings
                    </button>
                )}
            </div>

            {wordData.meanings.map((meaning, idx) => (
                <div key={idx} className="space-y-2">
                    <h3 className="font-semibold text-lg">{meaning.partOfSpeech}</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {meaning.definitions.map((def, i) => (
                            <li key={i}>{def.definition}</li>
                        ))}
                    </ul>
                    {meaning.synonyms.length > 0 && (
                        <p className="text-sm">
                            <span className="font-medium">Synonyms:</span> {meaning.synonyms.join(", ")}
                        </p>
                    )}
                    {meaning.antonyms.length > 0 && (
                        <p className="text-sm">
                            <span className="font-medium">Antonyms:</span> {meaning.antonyms.join(", ")}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default WordDetails;