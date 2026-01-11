import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
//import apiPrivate from "../api/axiosPrivate";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser(); // Clerk user object
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Attach token and check admin
  useEffect(() => {
    const attachToken = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken();

          if (token) {
            // ✅ Attach token to axios private instance
            apiPrivate.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${token}`;
          }

          // ✅ Check admin role from privateMetadata
          if (user?.privateMetadata?.isAdmin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (err) {
       // console.error("AuthProvider error:", err);
      } finally {
        setLoading(false);
      }
    };

    attachToken();
  }, [isSignedIn, getToken, user]);

  // ✅ Admin-only route / action helper
  const requireAdmin = (callback) => {
    if (!isAdmin) {
      toast.error("Only admin can access this!");
      return false;
    }
    return callback?.();
  };

  // ✅ Admin-only route wrapper for components
  const adminRouteGuard = (element) => {
    if (loading) return <p>Loading...</p>;

    if (!isSignedIn) {
      toast.error("You must be signed in!");
      return null;
    }

    if (!isAdmin) {
      toast.error("Only admin can access this page!");
      return null;
    }

    return element;
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        loading,
        isAdmin,
        requireAdmin,
        adminRouteGuard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Named export hook
export const useAuthContext = () => useContext(AuthContext);
