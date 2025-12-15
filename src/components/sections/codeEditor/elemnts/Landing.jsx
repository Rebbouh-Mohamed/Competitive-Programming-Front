import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import Problem from "./Problem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import LanguagesDropdown from "./LanguagesDropdown";
import "./CodeEditorWindow.css";
import { postDefaultCode } from "../../../../../redux/code/action";
import { useDispatch, useSelector } from "react-redux";
import Push from "../../Push";
import { testcode } from "../../../../../redux/test/action";
import { useNavigate } from "react-router-dom";

const Landing = ({ problem, scores }) => {
  const dispatch = useDispatch();
  const { upcomingContest } = useSelector((state) => state.contests);
  const [isScaled, setIsScaled] = useState(false);
  const defaultcode = problem.codejs || "";
  const toggleScale = () => {
    setIsScaled((prev) => !prev);
  };

  const [code, setCode] = useState(defaultcode);
  const toggleRefresh = () => {

    onChange("code", defaultcode);

  };

  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [msg, setmsg] = useState("");
  const [showModal, setShowModal] = useState(false);


  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    dispatch(
      postDefaultCode({
        problemId: problem.id,
        language: selectedLanguage.lang,
      })
    )
      .unwrap()
      .then((data) => {
        setCode(data.code_snippet); // Set default code on success
      })
      .catch((err) => {
        console.error("Error fetching default code:", err);
        setCode(""); // Use fallback code if there's an error
      });
  };

  // Fetch default code on mount if empty
  useEffect(() => {
    if (!code || code.trim() === "") {
      dispatch(
        postDefaultCode({
          problemId: problem.id,
          language: language.lang,
        })
      )
        .unwrap()
        .then((data) => {
          setCode(data.code_snippet);
        })
        .catch((err) => {
          console.error("Error fetching initial default code:", err);
        });
    }
  }, [problem.id]); // Re-run if problem changes (though component remounts usually handle this)

  useEffect(() => {
    if (enterPress && ctrlPress) {


      // handleCompile();
    }
  }, [ctrlPress, enterPress]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const processResults = (results) => {
    if (!results || results.length === 0) return "";

    // Find the first failed test with an error message
    const failedTest = results.find(test =>
      !test.passed || (test.error && test.error.trim() !== "")
    );

    if (!failedTest) return "";

    if (failedTest.error && failedTest.error.trim() !== "") {
      // If there's an error (like syntax error, runtime error)
      return `Error: ${failedTest.error}`;
    } else {
      // If test failed but no error (just wrong output)
      return `Input: ${failedTest.input}\nActual: ${failedTest.actual}\nExpected: ${failedTest.expected}`;
    }
  };

  const handleCompile = (code, language, is_test) => {
    setProcessing(true);

    const formData = {
      language: language.lang,
      code: code,
    };
    dispatch(testcode({ problem_id: problem.id, data: formData, is_test }))
      .unwrap()
      .then((data) => {

        if (is_test) {
          if (data.all_passed) {
            // showSuccessToast();
            setOutputDetails(100);
            setShowModal(true);
          }
          else {

            setOutputDetails(0);
            const errorMsg = processResults(data.results);
            setmsg(errorMsg === "" && data.error ? data.error : errorMsg);
            setShowModal(true);
          }
        }
        //setOutputDetails(data.percentage || 0); // Set default code on success
      })
      .catch((err) => {

      })
      .finally(() => {
        if (!is_test && upcomingContest?.contest?.type !== 'cup') {
          window.location.reload();
        }
      })
    // if (!is_test) { window.location.reload(); }

  };



  function handleThemeChange(th) {
    const theme = th;


    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }

  useEffect(() => {
    defineTheme("monokai").then((_) =>
      setTheme({ value: "monokai", label: "monokai" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 300,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%", // Ensure full width
    }}>
      {/* Score Display for Cup Matches */}
      {scores && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
          padding: "10px 20px",
          background: "#2c2c2c",
          borderRadius: "0 0 12px 12px",
          marginBottom: "10px",
          width: "60%",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#4CAF50" }}></div>
            <span style={{ color: "white", fontWeight: "bold" }}>You: {scores.p1 !== undefined ? (scores.player1?.username === localStorage.getItem('username') ? scores.p1 : scores.p2) : 0}</span>
          </div>
          <span style={{ color: "#FFD60A", fontWeight: "bold" }}>VS</span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "white", fontWeight: "bold" }}>{scores.player2 ? (scores.player1?.username === localStorage.getItem('username') ? scores.player2.username : scores.player1.username) : "Opponent"}: {scores.p1 !== undefined ? (scores.player1?.username === localStorage.getItem('username') ? scores.p2 : scores.p1) : 0}</span>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F44336" }}></div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          padding: "32px 0",
          height: "612px",
          flex: "1 0 0",
          width: "1440px",
          alignSelf: "stretch",
          justifyContent: "space-between",
        }}
      >
        <Problem isScaled={isScaled} problem={problem} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            borderRadius: "16px",
            background: "var(--White-12, rgba(255, 255, 255, 0.12))",
          }}
        >
          <LanguagesDropdown
            isScaled={isScaled}
            onScale={toggleScale}
            toggleRefresh={toggleRefresh}
            onSelectChange={onSelectChange}
          />
          <CodeEditorWindow
            isScaled={isScaled}
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
          <div style={{ marginTop: "auto", width: "100%" }}></div>
        </div>
      </div>
      <Push
        func={(is_test) => handleCompile(code, language, is_test)}
        value={outputDetails ? outputDetails : 0}
      />
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#1e1e1e",
              padding: "2rem",
              borderRadius: "8px",
              textAlign: "center",
              color: "white",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            {outputDetails === 100 ? (
              <>
                <h2 style={{ color: "#4caf50", marginBottom: "1rem" }}>
                  Success!
                </h2>
                <p></p>
              </>
            ) : (
              <>
                <h2 style={{ color: "#f44336", marginBottom: "1rem" }}>
                  Keep Trying
                </h2>
                {/* <p>Your score: {outputDetails}%</p> */}
                {msg && (
                  <div style={{
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    padding: "1rem",
                    borderRadius: "6px",
                    marginBottom: "1.5rem",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    textAlign: "left",
                  }}>
                    {msg}
                  </div>
                )}

                <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#aaa" }}>
                  Check your logic and try again.
                </p>
              </>
            )}
            <button
              onClick={() => {
                setmsg("");
                setShowModal(false);
              }}
              style={{
                marginTop: "1.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
