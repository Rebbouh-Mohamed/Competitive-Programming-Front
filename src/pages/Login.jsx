import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector from Redux
import { useNavigate } from "react-router-dom";
import InputField from "../components/ui-elements/input/InputField";
import PrimaryButton from "../components/ui-elements/buttons/PrimaryButton.jsx";
import Biglogo from "../../public/images/Biglogo.jsx";
import ToastDemo from "../components/toasts/ToastDemo.jsx"; // Import Toast component
import { loginUser } from "../../redux/login/action"; // Redux action

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.login); // Get loading and error from Redux store
  const [localEmail, setLocalEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [toastMessage, setToastMessage] = useState(""); // State for controlling the toast

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (isLoading) return; // Prevent submission when loading

    try {
      const result = await dispatch(
        loginUser({ username: localEmail, password: localPassword })
      ).unwrap();

      console.log("Login action result:", result);

      if (!result) {
        console.error("Incomplete login response:", result);
        setToastMessage("Login failed. Please try again."); // Set error message for toast
        return;
      }

      // Navigate to dashboard after successful login
      navigate("/lobby");
    } catch (err) {
      console.error("Error during login process:", err);
      setToastMessage(err.message); // Set error message for toast
    }
  };

  const Caption = "By joining, you agree to ITCP's Privacy Policy.";

  const styles = {
    container: {
      display: "flex",
      width: "37.5rem",
      flexDirection: "column",
      alignItems: "center",
      gap: "2.5rem",
    },
    title: {
      color: "var(--White, #FFF)",
      textAlign: "center",
      fontFamily: "Inter",
      fontSize: "2rem",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "2.5rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "1.5rem",
      alignSelf: "stretch",
    },
    errorMessage: {
      color: "red",
    },
    loadingText: {
      color: "var(--White, #FFF)",
    },
    caption: {
      color: "var(--Light-Gray, #929292)",
      textAlign: "center",
      fontFamily: "Inter",
      fontSize: "0.875rem",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "1.25rem",
      alignSelf: "stretch",
    },
  };

  return (
    <div style={styles.container}>
      <Biglogo />
      <p style={styles.title}>Competitive Programming</p>
      <div style={styles.form} onSubmit={handleSubmit}>
        {/* Input field for email */}
        <InputField
          placeholder="Enter username"
          value={localEmail}
          onChange={(value) => setLocalEmail(value)}
        />
        {/* Input field for password */}
        <InputField
          placeholder="Enter password"
          value={localPassword}
          isPassword
          onChange={(value) => setLocalPassword(value)} // Ensure value is passed
        />
        {/* Display errors if exists */}
        {error && <p style={styles.errorMessage}>{error}</p>}
        {/* Show loading or submit button */}
        {isLoading ? (
          <p style={styles.loadingText}>Loading ...</p>
        ) : (
          <PrimaryButton
            txt="Join"
            full
            type="submit"
            isicon={false}
            onClick={handleSubmit} // Pass handleSubmit function here
            disabled={isLoading} // Disable button when loading
          />
        )}

        <div style={styles.caption}>{Caption}</div>
      </div>

      {/* Show toast notification if there's an error */}
      <ToastDemo message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
};

export default Login;
