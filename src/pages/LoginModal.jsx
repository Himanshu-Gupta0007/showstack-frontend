import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const LoginModal = ({ onClose }) => {
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!signInLoaded || !signUpLoaded) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) {
      toast.error("Email & password required");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // 🔐 LOGIN
        await signIn.create({
          identifier: email,
          password,
        });

        toast.success("Login successful");
      } else {
        // 🆕 REGISTER
        await signUp.create({
          emailAddress: email,
          password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        toast.success("Account created! Verify email");
      }

      onClose();
    } catch (err) {
      toast.error(err.errors?.[0]?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <h2>
          {isLogin ? "Sign in to" : "Sign up to"}{" "}
          <span>QuickShow-Live</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Processing..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <p className="switch-text">
          {isLogin ? (
            <>
              New user?{" "}
              <span onClick={() => setIsLogin(false)}>Sign up</span>
            </>
          ) : (
            <>
              Already have account?{" "}
              <span onClick={() => setIsLogin(true)}>Sign in</span>
            </>
          )}
        </p>

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
