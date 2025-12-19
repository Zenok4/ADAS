"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    redirectToLogin();
  }, []);

  const redirectToLogin = () => {
    router.push("/login/username");
  }
  return <></>;
};

export default LoginPage;
