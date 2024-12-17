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
import { useDispatch } from "react-redux";
import Push from "../../Push";
import { testcode } from "../../../../../redux/test/action";


const Landing = ({problem}) => {
  const dispatch=useDispatch()
  const [isScaled, setIsScaled] = useState(false);
  const defaultcode = `${problem.codejs}`;
  const toggleScale = () => {
    setIsScaled((prev) => !prev);
  };

  const [code, setCode] = useState(defaultcode);
  const toggleRefresh = () => {
    console.log("Refreshing...");
    onChange("code", defaultcode);
    console.log(code);
  };

  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    dispatch(postDefaultCode({ problemId: problem.id, language: selectedLanguage.value }))
      .unwrap()
      .then((data) => {
        setCode(data.code_snippet); // Set default code on success
      })
      .catch((err) => {
        console.error("Error fetching default code:", err);
        setCode(""); // Use fallback code if there's an error
      });
  };


  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
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

const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language: language.value,
      code: code,
    };
    dispatch(testcode({ problem_id: problem.id, data: formData}))
      .unwrap()
      .then((data) => {
        setOutputDetails(data.percentage); // Set default code on success
      })
      .catch((err) => {
        console.log("Error fetching default code:", err);
      });

  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

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
      autoClose: 1000,
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "32px 0",
        height: "612px",
        flex: "1 0 0",
        width:"1440px",
        alignSelf: "stretch",
        justifyContent:"space-between",
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
         {/* <div style={{ marginTop: "auto", width: "100%" }}>
         <Push 
            func={() => handleCompile(code, language)} 
            value={outputDetails ? outputDetails: 0} 
          />
          </div> */}
      </div>
    </div>

    
    
  );
};

export default Landing;
