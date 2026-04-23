import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { authApi, extractApiError } from "../lib/api";

function Sign() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isUsernameValid = username.trim().length >= 3;
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isUsernameValid && isEmailValid && isPasswordValid;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setError("");
    setSuccess("");

    if (!isFormValid) {
      return;
    }

    try {
      setLoading(true);
      await authApi.signup({ username: username.trim(), email, password });
      setSuccess("Account created. You can now sign in.");
      setUsername("");
      setEmail("");
      setPassword("");
      setSubmitted(false);
    } catch (apiError) {
      setError(
        extractApiError(apiError, "Unable to create account right now. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page" aria-labelledby="signup-heading">
      <div className="auth-card">
        <h1 id="signup-heading">Create your account</h1>
        <p className="auth-subtitle">Join BookSwap to list, trade, and discover books.</p>

        <form noValidate onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            aria-invalid={submitted && !isUsernameValid}
            required
          />
          {submitted && !isUsernameValid ? (
            <p className="field-error">Username must be at least 3 characters.</p>
          ) : null}

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={submitted && !isEmailValid}
            required
          />
          {submitted && !isEmailValid ? (
            <p className="field-error">Enter a valid email address.</p>
          ) : null}

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={submitted && !isPasswordValid}
            required
          />
          {submitted && !isPasswordValid ? (
            <p className="field-error">Password must be at least 6 characters.</p>
          ) : null}

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="form-success" role="status">
              {success}
            </p>
          ) : null}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}

export default Sign;
