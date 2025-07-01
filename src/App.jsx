import { useEffect, useRef, useState } from "react";
import { FiDelete } from "react-icons/fi";
import { MdHistory } from "react-icons/md";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [previewResult, setPreviewResult] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("calc-history");
    return saved ? JSON.parse(saved) : [];
  });

  const inputRef = useRef(null);
  const historyRef = useRef(null);

  const handleClick = (value) => {
    const cursorPos = inputRef.current.selectionStart;
    const newValue =
      input.slice(0, cursorPos) + value + input.slice(cursorPos);
    setInput(newValue);
    setTimeout(() => {
      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        cursorPos + value.length;
    }, 0);
  };

  const handleClear = () => setInput("");

  const handleDelete = () => {
    const cursorPos = inputRef.current.selectionStart;
    if (cursorPos === 0) return;
    const newValue =
      input.slice(0, cursorPos - 1) + input.slice(cursorPos);
    setInput(newValue);
    setTimeout(() => {
      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        cursorPos - 1;
    }, 0);
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleEqual = () => {
    try {
      const expression = input.replace(/%/g, "/100");
      const result = eval(expression);
      setHistory((prev) => {
        const updated = [...prev, { input, result }];
        localStorage.setItem("calc-history", JSON.stringify(updated));
        return updated;
      });
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calc-history");
  };

  useEffect(() => {
    if (!input) return setPreviewResult("");
    try {
      const formatted = input.replace(/%/g, "/100");
      const result = eval(formatted);
      setPreviewResult(isNaN(result) ? "" : result.toString());
    } catch {
      setPreviewResult("");
    }
  }, [input]);

  // Auto-close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        historyRef.current &&
        !historyRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="max-w-sm mx-auto mt-10 p-4 border rounded-lg shadow-md">
        <div className="w-full max-w-md mx-auto mt-10 px-4">
          <h1 className="text-2xl font-semibold text-center mb-2">SmartCalc</h1>
          <p className="text-sm text-center text-gray-500 mb-4">A simple yet powerful calculator</p>

          <div className="relative mb-2">
            {/* History icon inside input */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black z-10"
            >
              <MdHistory size={22} />
            </button>

            <input
              type="text"
              value={input}
              ref={inputRef}
              onChange={handleInputChange}
              placeholder="0"
              onKeyDown={(e) => {
                const allowedKeys = [
                  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                  "+", "-", "*", "/", ".", "%", "(", ")",
                  "Backspace", "Enter", "Delete", "ArrowLeft", "ArrowRight"
                ];

                if (e.key === "Enter") {
                  e.preventDefault();
                  handleEqual();
                } else if (e.key === "Backspace") {
                  handleDelete();
                } else if (!allowedKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className="w-full p-2 pl-10 pr-2 border rounded text-right text-xl outline-none"
            />
          </div>

          {/* Live preview result */}
          {previewResult && (
            <div className="text-right text-sm text-gray-500 mb-3">
              = {previewResult}
            </div>
          )}

          {/* History dropdown */}
          {showHistory && (
            <div
              ref={historyRef}
              className="border rounded p-2 max-h-40 overflow-y-auto mb-4 bg-white shadow text-sm relative z-20"
            >
              {history.length > 0 ? (
                <ul className="space-y-1">
                  {history.map((item, idx) => (
                    <li key={idx} className="flex justify-between border-b pb-1">
                      <span>{item.input}</span>
                      <span className="text-gray-500">= {item.result}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center">No history yet</p>
              )}

              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="mt-2 text-xs text-red-500 hover:underline block mx-auto"
                >
                  Clear history
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-4 grid-rows-6 gap-2">
            {/* Top controls */}
            <button onClick={handleClear} className="btn bg-red-100">C</button>
            <button onClick={() => handleClick("(")} className="btn">(</button>
            <button onClick={() => handleClick(")")} className="btn">)</button>
            <button
              onClick={handleDelete}
              className="btn bg-yellow-100 flex items-center justify-center"
            >
              <FiDelete size={20} />
            </button>

            {/* Operators */}
            <button onClick={() => handleClick("/")} className="btn">/</button>
            <button onClick={() => handleClick("*")} className="btn">*</button>
            <button onClick={() => handleClick("-")} className="btn">-</button>
            <button onClick={() => handleClick("+")} className="btn">+</button>

            {/* Digits and % */}
            <button onClick={() => handleClick("7")} className="btn">7</button>
            <button onClick={() => handleClick("8")} className="btn">8</button>
            <button onClick={() => handleClick("9")} className="btn">9</button>
            <button onClick={() => handleClick("%")} className="btn">%</button>

            <button onClick={() => handleClick("4")} className="btn">4</button>
            <button onClick={() => handleClick("5")} className="btn">5</button>
            <button onClick={() => handleClick("6")} className="btn">6</button>
            {/* Equal button starts here */}
            <button
              onClick={handleEqual}
              className="btn bg-green-100 row-span-3"
            >
              =
            </button>

            <button onClick={() => handleClick("1")} className="btn">1</button>
            <button onClick={() => handleClick("2")} className="btn">2</button>
            <button onClick={() => handleClick("3")} className="btn">3</button>

            <button onClick={() => handleClick("0")} className="btn col-span-2">0</button>
            <button onClick={() => handleClick(".")} className="btn">.</button>
            {/* last cell is taken by = */}
          </div>
        </div>
      </div>
    </div>
  );
}