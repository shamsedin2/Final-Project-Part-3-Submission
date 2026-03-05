import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, csrfToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.includes("@")) errs.email = "Enter a valid email";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, formCsrf: csrfToken });
      navigate("/");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🍳</span>
          <h1>Create account</h1>
          <p>Join to save and discover recipes</p>
        </div>

        {serverError && (
          <div className="auth-error" role="alert">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="_csrf" value={csrfToken} readOnly />

          {[
            { id: "name", label: "Full Name", type: "text", placeholder: "Jane Smith", autoComplete: "name" },
            { id: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
            { id: "password", label: "Password", type: "password", placeholder: "Min. 8 characters", autoComplete: "new-password" },
            { id: "confirm", label: "Confirm Password", type: "password", placeholder: "Repeat password", autoComplete: "new-password" },
          ].map(({ id, label, type, placeholder, autoComplete }) => (
            <div className="form-group" key={id}>
              <label htmlFor={id}>{label}</label>
              <input
                id={id}
                type={type}
                name={id}
                value={form[id]}
                onChange={handleChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-invalid={!!errors[id]}
                aria-describedby={errors[id] ? `${id}-error` : undefined}
              />
              {errors[id] && (
                <span id={`${id}-error`} className="field-error" role="alert">
                  {errors[id]}
                </span>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
