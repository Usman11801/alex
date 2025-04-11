import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

import { userActions } from "@/store/slices/user";
import { getAuth } from "@/utils/firebase";
import { ROUTES } from "@/utils/constants";

const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    const auth = getAuth();
    const unsubcribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(userActions.setCurrentUser(user));
      } else {
        dispatch(userActions.setCurrentUser(null));
        if (pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP) return;
        router.push(ROUTES.LOGIN);
      }
    });

    return () => {
      unsubcribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
};

export default useAuth;
