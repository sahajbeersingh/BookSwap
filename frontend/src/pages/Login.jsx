import { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { authApi, extractApiError, setAuthToken } from "../lib/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

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
      const data = await authApi.login({ email, password });
      const token =
        data?.session?.access_token ||
        data?.access_token ||
        data?.accessToken ||
        data?.token ||
        "";
      if (token) {
        localStorage.setItem("bookswap.accessToken", token);
        setAuthToken(token);
      }
      setSuccess("Signed in successfully.");
    } catch (apiError) {
      setError(extractApiError(apiError, "Unable to sign in right now. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page" aria-labelledby="login-heading">
      <div className="auth-card">
        <h1 id="login-heading">Welcome back</h1>
        <p className="auth-subtitle">Sign in to manage listings and saved books.</p>

        <form noValidate onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
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

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/signup">Create your account</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
