"use client";

import PrimaryButton from "@/components/PrimaryButton";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const initialState = {
  error: "",
  ts: 0
};

export default function LoginPage() {

  const [state, action, pending] = useActionState(loginAction, initialState);

  // const router = useRouter();

  const [interacted, setInteracted] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loginDisabled, setLoginDisabled] = useState(false);

  const [errors, setErrors] = useState({
    username: false,
    password: false,
  });

  // const toast = () => {
  //   setShowToast(true);

  //   setTimeout(() => {
  //     setShowToast(false);
  //   }, 3000);
  // };

  // const handleLogin = () => {
  //   const newErrors = {
  //     username: "",
  //     password: "",
  //     validation: ""
  //   };

  //   if (!username) {
  //     newErrors.username = "Username harus diisi";
  //     // return;
  //   }
  //   if (!password) {
  //     newErrors.password = "Password harus diisi";
  //     // return;
  //   }

  //   // setErrors(newErrors);
    
  //   if (newErrors.username || newErrors.password) {
  //     toast();
  //     // alert("Username dan password harus diisi");
  //     console.log("Validation failed:", newErrors);
  //     return;
  //   }
  //   // else if (!errorPassword) return;

  //   // setErrorUsername("");
  //   // setErrorPassword("");

  //   // lanjut ke login nanti
  //   // if(!user.some(u => u.username === username && u.password === password)) {
  //   //   setErrors({
  //   //     ...newErrors,
  //   //     validation: "Username atau password salah!"
  //   //   });
  //   //   console.log("Login failed:", { username, password });
  //   //   toast();
  //   //   return;
  //   // } else if (user.some(u => u.username === "admin")) {
  //   //   redirect("/admin");
  //   //   return;
  //   // }

  //   router.push("/");
  //   console.log("Login:", { username, password });
  // };

  useEffect(() => {
    if(state?.error) {
      setShowToast(true);

      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    };
  }, [state?.ts])
  
  useEffect(() => {
    if(!interacted) return;

    setErrors({ username: username? false : true, password: password? false : true });
  }, [username, password])

  useEffect(() => {
    setLoginDisabled(pending || !username || !password ? true : false);
  }, [pending, password, username])

  return (
    <main className="w-full h-[calc(100dvh-theme(spacing.12))] px-6 pb-4">
      {pending?
        <div className="flex flex-col gap-2 h-full justify-center items-center">
          <img src="/power.png" className="w-54 animate-pulse" />
          <h1 className="text-2xl font-black">Loading...</h1>
        </div>
        :
        <>
          <form action={action} className="flex flex-col items-center justify-end w-full h-full py-4">
            <div className="flex-1 relative min-h-0 max-h-46 py-4">
              <img src="/power.png" alt="Power Gym" className="object-cover w-full h-full" />
            </div>

            <div className="w-full">
              <h1 className="text-2xl font-black text-center text-stroke mt-6 mb-6">
                LOGIN
              </h1>
            </div>

            {/* INPUT FIELDS */}
            <div className="w-full mb-6 flex flex-col gap-2">

              <div>
                <label className="text-xs font-medium text-stroke">
                  Username
                  <span className={`text-prime ${!errors.username && "hidden"}`}>{" (Username harus diisi!)"}</span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  autoComplete="current-username"
                  className={`
                    w-full rounded-sm px-4 py-3 text-sm
                    border-1 border-stroke/40 focus:outline-2 outline-stroke
                    ${username ? "outline-2 bg-background" : "bg-paragraph/5"}
                    ${errors.username && "bg-prime/20"}
                  `}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setInteracted(true);
                  }}
                />
              </div>
              
              {/* ERROR */}
              {/* {errors.username && (
                <p className="mt-0 text-center text-sm text-red-500">{errors.username}</p>
              )} */}

              <div>
                <label className="text-xs font-medium text-stroke">
                  Password
                  <span className={`text-prime ${!errors.password && "hidden"}`}>{" (Pasword harus diisi!)"}</span>
                </label>
                <div className={`flex items-center gap-2 w-full rounded-sm px-4 py-3 text-md border-1 border-stroke/40 outline-stroke focus-within:outline-2 ${password ? "outline-2 bg-background" : "bg-paragraph/5"} ${errors.password && "bg-prime/20"}`}>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full outline-none focus:outline-none focus:ring-0"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setInteracted(true);
                    }}
                  />

                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={() => setShowPassword(!showPassword)} size="lg" className="w-4 text-stroke hover:text-stroke/40 cursor-pointer" />
                </div>
              </div>

            </div>

            <div className="w-full pt-12">
              <PrimaryButton
                type="submit"
                disabled={loginDisabled}
              >
                {pending? "Loading..." : "Log In"}
              </PrimaryButton>
            </div>
          </form>

          {showToast && (
            <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-rose-900 text-white px-6 py-4 rounded-md shadow-xl text-background text-center z-50">
              {state?.error}
              {/* {state?.error ? state.error : (errors.username || errors.password) ? "Username dan password harus diisi!" : errors.validation} */}
              {/* {errors.username ? errors.username : errors.password ? errors.password : errors.validation} */}
            </div>
          )}
        </>
      }
    </main>
  );
}