import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import InputField from "../components/ui-elements/input/InputField";
import PrimaryButton from "../components/ui-elements/buttons/PrimaryButton.jsx";
import Biglogo from "../../public/images/Biglogo.jsx"
import ToastRed from "../components/toasts/ToastRed.jsx"; 
import { loginUser } from "../../redux/login/action"; 
import styles from "./styles.json";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.login);
  const [localEmail, setLocalEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Refs for the input fields
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (isLoading) return;

    // Check if any input is empty and focus on it
    if (!localEmail) {
      emailRef.current.focus();
      return;
    }
    if (!localPassword) {
      passwordRef.current.focus();
      return;
    }

    try {
      const result = await dispatch(
        loginUser({ username: localEmail, password: localPassword })
      ).unwrap();

      if (!result) {
        console.error("Incomplete login response:", result);
        setToastMessage("Login failed. Please try again.");
        return;
      }

      navigate("/lobby");
    } catch (err) {
      console.error("Error during login process:", err);
      setToastMessage(err.message);
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
          ref={emailRef} // Attach ref to the input field
          onChange={(value) => setLocalEmail(value)}
        />
        <InputField
          placeholder="Enter password"
          value={localPassword}
          isPassword
          ref={passwordRef} // Attach ref to the input field
          onChange={(value) => setLocalPassword(value)}
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

      <ToastRed message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
};

export default Login;
