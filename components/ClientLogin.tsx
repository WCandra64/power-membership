"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { useActionState, useEffect, useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import BareButton from "./BareButton";

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

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [forgotPassword, setForgotPassword] = useState(false);
  const [fpwStep, setFpwStep] = useState(1);
  const [registrationDate, setRegistrationDate] = useState("");
  const [registrationTime, setRegistrationTime] = useState("");
  const [checkUsername, setCheckUsername] = useState(false);
  const [checkRegisDate, setCheckRegisDate] = useState(false);
  const [checkRegisTime, setCheckRegisTime] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [fpwLoading, setFpwLoading] = useState(false);
  const [successfulChange, setSuccessfulChange] = useState(false);

  const [loginDisabled, setLoginDisabled] = useState(false);

  const [errors, setErrors] = useState({
    username: false,
    password: false,
  });

  function resetForgotPassword() {
    setForgotPassword(false);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setRegistrationDate("");
    setRegistrationTime("");
    setFpwStep(1);
    setCheckUsername(false);
    setCheckRegisDate(false);
    setCheckRegisTime(false);
    setCheckPassword(false);
    setFpwLoading(false);
  }

  async function findUsername() {
    setFpwLoading(true);

    const res = await fetch("/api/forgot-password/"+username, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      setFpwStep(2);
    } else {
      setCheckUsername(true);
    }

    setFpwLoading(false);
  }

  async function verifyRegistrationDate() {
    setFpwLoading(true);

    const res = await fetch("/api/forgot-password/"+username, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registrationDate,
        registrationTime
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setFpwStep(3);
    } else {
      setCheckRegisDate(true);
      setCheckRegisTime(true);
    }

    setFpwLoading(false);
  }
  
  async function updatePassword() {
    setFpwLoading(true);

    if (password === confirmPassword) {
      const res = await fetch("/api/forgot-password/"+username, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setForgotPassword(false);
        resetForgotPassword();
        setSuccessfulChange(true);
      }
    } else
      setCheckPassword(true);

    setFpwLoading(false);
  }

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
    if(successfulChange) {
      setShowToast(true);

      const timer = setTimeout(() => {
        setShowToast(false);
        setSuccessfulChange(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    };
  }, [successfulChange])
  
  useEffect(() => {
    if(!interacted) return;

    setErrors({ username: username? false : true, password: password? false : true });
  }, [username, password])

  useEffect(() => {
    setLoginDisabled(pending || !username || !password ? true : false);
  }, [pending, password, username])

  useEffect(() => {
    if(forgotPassword)
      setCheckUsername(false);
      setCheckRegisDate(false);
      setCheckRegisTime(false);
      setCheckPassword(false);
  }, [username, registrationDate, registrationTime, password, confirmPassword])

  useEffect(() => {
    if(registrationDate !== "" && registrationTime !== "")
      verifyRegistrationDate();
  }, [registrationDate, registrationTime])

  return (
    <main className="w-full h-[calc(100dvh-theme(spacing.12))] px-6 pb-4">
      {pending?
        <div className="flex flex-col gap-2 h-full justify-center items-center">
          <img src="/power.svg" className="w-54 animate-pulse" />
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
                    ${!forgotPassword && username ? "outline-2 bg-background" : "bg-paragraph/5"}
                    ${errors.username && "bg-prime/20"}
                  `}
                  value={forgotPassword ? "" : username}
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
                <div className={`flex items-center gap-2 w-full rounded-sm px-4 py-3 text-md border-1 border-stroke/40 outline-stroke focus-within:outline-2 ${!forgotPassword && password ? "outline-2 bg-background" : "bg-paragraph/5"} ${errors.password && "bg-prime/20"}`}>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full outline-none focus:outline-none focus:ring-0"
                    value={forgotPassword ? "" : password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setInteracted(true);
                    }}
                  />

                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={() => setShowPassword(!showPassword)} size="lg" className="w-4 text-stroke hover:text-stroke/40 cursor-pointer" />
                </div>
              </div>

              <div onClick={() => {setForgotPassword(true); setUsername("");}} className="underline text-prime text-sm cursor-pointer hover:text-stroke">Lupa Password?</div>

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
            <div className={`fixed top-16 left-1/2 -translate-x-1/2 ${successfulChange? "bg-green-600" : "bg-rose-900"} text-white px-6 py-4 rounded-md shadow-xl text-background text-center z-50`}>
              {successfulChange? "Password berhasil diperbarui." : state?.error}
              {/* {state?.error ? state.error : (errors.username || errors.password) ? "Username dan password harus diisi!" : errors.validation} */}
              {/* {errors.username ? errors.username : errors.password ? errors.password : errors.validation} */}
            </div>
          )}

          {forgotPassword && (
            <div className={`fixed inset-0 flex items-center justify-center z-50 w-full h-full ${!forgotPassword && "hidden"}`}>
            
              <div onClick={() => resetForgotPassword()} className="absolute inset-0 bg-stroke/80" />
    
              <div className="absolute w-full max-w-md p-6">
                <div className="flex flex-col gap-4 bg-background p-6 rounded-sm">
                  <h3 className="text-lg font-black font-mulish text-center">Ganti Password</h3>
    
                  <hr className="border-stroke" />

                  {fpwStep === 1 && (
                    <>
                      <span className="text-sm">Masukkan username anda</span>
                      <div className="flex flex-col">
                        <label className="text-xs">
                          Username
                          <span className="text-prime">{checkUsername && " (Username tidak ditemukan)"}</span>
                        </label>
                        <input
                          type="text"
                          name="findUsername"
                          placeholder="Username anda"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={fpwStep > 1}
                          className={`rounded-lg border px-3 py-2 ${checkUsername && "bg-prime/20"}`}
                        />
                      </div>
                    </>
                  )}

                  {fpwStep === 2 && (
                    <>
                      <span className="text-sm">Masukkan waktu pendaftaran (silakan tanya admin)</span>
                      <div className="flex flex-col">
                        <label className="text-xs">
                          Tanggal Pendaftaran
                          <span className="text-prime">{checkRegisDate && " (Tanggal salah)"}</span>
                        </label>
                        <input
                          type="date"
                          name="regisDate"
                          value={registrationDate}
                          onChange={(e) => setRegistrationDate(e.target.value)}
                          disabled={fpwStep > 2}
                          className={`rounded-lg border px-3 py-2 ${checkRegisDate && "bg-prime/20"}`}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs">
                          Jam Pendaftaran
                          <span className="text-prime">{checkRegisTime && " (Jam salah)"}</span>
                        </label>
                        <input
                          type="time"
                          name="regisTime"
                          value={registrationTime}
                          onChange={(e) => setRegistrationTime(e.target.value)}
                          disabled={fpwStep > 2}
                          className={`rounded-lg border px-3 py-2 ${checkRegisTime && "bg-prime/20"}`}
                        />
                      </div>
                    </>
                  )}

                  {fpwStep === 3 && (
                    <>
                      <span className="text-sm">Masukkan password baru</span>
                      <div>
                        <label className="text-xs font-medium text-stroke">
                          Password
                          <span className="text-prime">{checkPassword && " (Password tidak sama)"}</span>
                        </label>
                        <div className={`flex items-center gap-2 w-full rounded-lg px-4 py-3 border focus-within:outline-2 ${checkPassword && "bg-prime/20"}`}>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password baru"
                            autoComplete="current-password"
                            className="w-full outline-none focus:outline-none focus:ring-0"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                          />
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={() => setShowPassword(!showPassword)} size="lg" className="w-4 text-stroke hover:text-stroke/40 cursor-pointer" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stroke">
                          Konfirmasi Password
                          <span className="text-prime">{checkPassword && " (Password tidak sama)"}</span>
                        </label>
                        <div className={`flex items-center gap-2 w-full rounded-lg px-4 py-3 border focus-within:outline-2 ${checkPassword && "bg-prime/20"}`}>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password baru (ulang)"
                            autoComplete="current-password"
                            className="w-full outline-none focus:outline-none focus:ring-0"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                            }}
                          />
                          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} onClick={() => setShowConfirmPassword(!showConfirmPassword)} size="lg" className="w-4 text-stroke hover:text-stroke/40 cursor-pointer" />
                        </div>
                      </div>
                    </>
                  )}
    
                  <div className="flex flex-col gap-4 pt-6">
                    {fpwStep === 1 ? (
                      <PrimaryButton onClick={() => findUsername()} disabled={!username || checkUsername || fpwLoading}>
                        {fpwLoading ? "Loading..." : "Cari"}
                      </PrimaryButton>
                    ) :
                      <PrimaryButton onClick={() => updatePassword()} disabled={fpwStep === 2 || !password || !confirmPassword || checkPassword || fpwLoading}>{fpwLoading ? "Loading..." : "Ganti"}</PrimaryButton>
                    }
                    <BareButton onClick={() => resetForgotPassword()} disabled={fpwLoading}>Batal</BareButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      }
    </main>
  );
}