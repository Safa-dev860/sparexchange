// useAuth.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure, logout } from "./authSlice";
import { auth } from "./firebase";

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        if (user) {
          dispatch(loginSuccess(user));
        } else {
          dispatch(logout());
        }
      },
      (error) => {
        dispatch(loginFailure(error.message));
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  const login = async () => {
    dispatch(loginStart());
    try {
      const result = await auth.signInWithPopup(provider);
      dispatch(loginSuccess(result.user));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  const logoutUser = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  return { login, logoutUser };
};

export default useAuth;
