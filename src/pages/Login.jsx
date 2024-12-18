import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../components/ui-elements/input/InputField";
import PrimaryButton from "../components/ui-elements/buttons/PrimaryButton.jsx";
import Biglogo from "../../public/images/Biglogo.jsx";
import ToastRed from "../components/toasts/red/ToastRed.jsx";
import ToastYellow from "../components/toasts/yellow/ToastYellow.jsx";
import { loginUser } from "../../redux/login/action";
import styles from "./styles.json";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.login);
  const [localEmail, setLocalEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [toastMessagered, setToastMessagered] = useState("");
  const [toastMessageyellow, setToastMessageyellow] = useState("");
  const [toastedon, setToaston] = useState(false); // Track if a toast is open
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (isLoading) return;
    if (!localPassword && !localEmail) {
      passwordRef.current.focus();
      setToastMessageyellow("Username and password are required to proceed.");
      setToaston(true); // Show toast
      return;
    }
    if (!localEmail) {
      emailRef.current.focus();
      setToastMessageyellow("Please enter your username to continue.");
      setToaston(true); // Show toast
      return;
    }
    if (!localPassword) {
      passwordRef.current.focus();
      setToastMessageyellow("Please enter your password to continue.");
      setToaston(true); // Show toast
      return;
    }

    try {
      const result = await dispatch(
        loginUser({ username: localEmail, password: localPassword })
      ).unwrap();

      if (!result) {
        setToastMessagered("Login failed. Please try again.");
        setToaston(true); // Show error toast
        return;
      }

      navigate("/lobby");
    } catch (err) {
      setToastMessagered(err.message);
      setToaston(true); // Show error toast
    }
  };

  // Close toast when the user types in the input field
  const handleInputChange = () => {
    if (toastedon) {
      setToastMessagered("");
      setToastMessageyellow("");
      console.log("handleInputChange")
      setToaston(false); // Close the toast
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [localEmail, localPassword, isLoading]);

  const Caption = "By joining, you agree to ITCP's Privacy Policy.";

  return (
    <div style={styles.container}>
      <Biglogo />
      <p style={styles.title}>Competitive Programming</p>
      <div style={styles.form} onSubmit={handleSubmit}>
        <InputField
          placeholder="Enter username"
          value={localEmail}
          ref={emailRef}
          onChange={(value) => {
            setLocalEmail(value);
            handleInputChange(); // Close toast on input change
          }}
        />
        <InputField
          placeholder="Enter password"
          value={localPassword}
          isPassword
          ref={passwordRef}
          onChange={(value) => {
            setLocalPassword(value);
            handleInputChange(); // Close toast on input change
          }}
        />
        {error && <p style={styles.errorMessage}>{error}</p>}
        {isLoading ? (
          <p style={styles.loadingText}>Loading ...</p>
        ) : (
          <PrimaryButton
            txt="Join"
            full
            type="submit"
            isicon={false}
            onClick={handleSubmit}
            disabled={isLoading}
          />
        )}

        <div style={styles.caption}>{Caption}</div>
      </div>

      <ToastRed
        message={toastMessagered}
        onClose={() => setToastMessagered("")}
        monitorInputChange={handleInputChange} // Pass the function to ToastRed
      />
      <ToastYellow
        message={toastMessageyellow}
        onClose={() => setToastMessageyellow("")}
        monitorInputChange={handleInputChange} // Pass the function to ToastYellow
      />
    </div>
  );
};

export default Login;
