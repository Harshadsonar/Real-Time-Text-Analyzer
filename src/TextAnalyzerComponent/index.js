import "./style.css";
import { useState } from "react";

const TextAnalyzer = () => {
  const [inputText, setInputText] = useState("");
  const [wordDetails, setWordDetails] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [inputType, setInputType] = useState("");
  const [wordData, setWordData] = useState({ chr: 0, word: 0 });
  const [showDetails, setShowDetails] = useState(false);
  const [paragraphData, setParagraphData] = useState({
    chr: 0,
    word: 0,
    sentence: 0,
    paragraph: 0,
    spaces: 0,
    punctuation: 0,
  });

  const handleWords = () => {
    setIsActive(true);
    setInputType("word");
    setParagraphData({
      chr: 0,
      word: 0,
      sentence: 0,
      paragraph: 0,
      spaces: 0,
      punctuation: 0,
    });
    setWordDetails(null);
    setInputText("");
  };

  const handleParagraphs = () => {
    setIsActive(true);
    setInputType("paragraph");
    setWordData({ chr: 0, word: 0 });
    setWordDetails(null);
    setInputText("");
  };

  const updateCountWord = () => {
    const chrs = inputText.replace(/\s/g, "").length;
    const wrd = inputText.split(/\s+/).filter((word) => word !== "").length;
    setWordData({ chr: chrs, word: wrd });
  };

  const updateParagraphCount = (text) => {
    const chrs = text.length;
    const wrd = text.split(/\s+/).filter((word) => word !== "").length;
    const countSentence = text
      .split(/[.!?]+/)
      .filter((sentence) => sentence !== "").length;

    const prg = text
      .split("\n")
      .filter((paragraph) => paragraph.trim() !== "").length;

    const spc = text.split(" ").length - 1;

    const punc = (inputText) => {
      const punctRegex = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g;
      const puncMatch = inputText.match(punctRegex);
      return puncMatch ? puncMatch.length : 0;
    };

    setParagraphData({
      chr: chrs,
      word: wrd,
      sentence: countSentence,
      paragraph: prg,
      spaces: spc,
      punctuation: punc(text),
    });

    setParagraphData({
      chr: chrs,
      word: wrd,
      sentence: countSentence,
      paragraph: prg,
      spaces: spc,
      punctuation: punc(inputText),
    });
  };

  const handleWordCount = () => {
    updateCountWord();
    setShowDetails(true);

    if (inputType === "word") {
      handleText();
    }
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);

    if (isActive) {
      if (inputType === "paragraph") {
        updateParagraphCount(newText); // Pass the new text to the function
      } else if (inputType === "word") {
        updateCountWord();
      }
    }

    if (newText.trim() === "") {
      setWordData({ chr: 0, word: 0 });
      setParagraphData({
        chr: 0,
        word: 0,
        sentence: 0,
        paragraph: 0,
        spaces: 0,
        punctuation: 0,
      });
    }
    setShowDetails(false);
  };

  const handleText = async () => {
    const baseUrl = "https://api.datamuse.com/words";
    const query = inputText.trim();

    try {
      const response = await fetch(`${baseUrl}?ml=${query}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const meaning = data[0];

        setWordDetails({
          definition: meaning?.defs?.[0] || "No definition available",
          partOfSpeech: meaning?.tags?.[0] || "No part of speech available",
          Synonyms:
            (meaning?.synonyms || []).join(", ") || "No synonyms available",
          Antonyms:
            (meaning?.antonyms || []).join(", ") || "No antonyms available",
        });
      } else {
        console.error("No meanings found in the response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div>
        <div className="text-analyzer">
          <h1>Text Analyzer</h1>
          <p>
            Text Analyzer is a simple free online tool for SEO web content
            analysis that helps you find most frequent phrases and words, number
            of characters, words, sentences and paragraphs, and estimated read
            and speak time of your content.
          </p>
        </div>
        <div className="tabs">
          <button
            className={`wordInput-btn btn-hover ${
              inputType === "word" && isActive ? "active-button" : ""
            }`}
            onClick={() => handleWords()}
          >
            Word Input
          </button>
          <button
            className={`paragraph-btn btn-hover ${
              inputType === "paragraph" && isActive ? "active-button" : ""
            }`}
            onClick={() => handleParagraphs()}
          >
            Paragraph
          </button>
        </div>
        <br />
        {isActive && (
          <div>
            {inputType === "word" ? (
              <div className="wordInput">
                <input
                  name="wordInput"
                  id="wordInput"
                  type="text"
                  placeholder="Type a Note..."
                  value={inputText}
                  onChange={handleInputChange}
                />
                <button onClick={handleWordCount}>Process Word</button>
              </div>
            ) : (
              <div className="paragraph-input">
                <textarea
                  name="paragraph"
                  id="paragraph"
                  placeholder="Type, or copy/paste your content here."
                  value={inputText}
                  rows={5}
                  cols={150}
                  onInput={handleInputChange}
                />
              </div>
            )}

            {inputType === "word" && (
              <table className="wordInput-table">
                <thead>
                  <tr>
                    <th>Characters</th>
                    <th>Words</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{wordData.chr}</td>
                    <td>{wordData.word}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {inputType === "word" && showDetails && (
              <div className="wordInput-data visible">
                {wordDetails ? (
                  <>
                    <p>
                      <b>Definition:- </b>
                      {wordDetails.definition}
                    </p>
                    <p>
                      <b>Parts of Speech:- </b>
                      {wordDetails.partOfSpeech}
                    </p>
                    <p>
                      <b>Synonyms:- </b>
                      {wordDetails.Synonyms}
                    </p>
                    <p>
                      <b>Antonyms:- </b>
                      {wordDetails.Antonyms}
                    </p>
                  </>
                ) : (
                  <>
                    <p>Definition:- </p>
                    <p>Parts of speech:-</p>
                    <p>Synonyms:-</p>
                    <p>Antonyms:- </p>
                  </>
                )}
              </div>
            )}

            {inputType === "paragraph" && (
              <table>
                <thead>
                  <tr>
                    <th>Characters</th>
                    <th>Words</th>
                    <th>Sentences</th>
                    <th>Paragraphs</th>
                    <th>Spaces</th>
                    <th>Punctuations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{paragraphData.chr}</td>
                    <td>{paragraphData.word}</td>
                    <td>{paragraphData.sentence}</td>
                    <td>{paragraphData.paragraph}</td>
                    <td>{paragraphData.spaces}</td>
                    <td>{paragraphData.punctuation}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TextAnalyzer;
