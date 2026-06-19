"use client";

import NavBar from "@/components/Navbar";
import PrimaryButton from "@/components/PrimaryButton";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const user = [
    {
      username: "admin",
      password: "admin123",
    },
    {
      username: "user",
      password: "user123",
    },
    {
      username: "member",
      password: "member123",
    }
  ]

  const [showToast, setShowToast] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    validation: ""
  });

  const toast = () => {
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleLogin = () => {
    const newErrors = {
      username: "",
      password: "",
      validation: ""
    };

    if (!username) {
      newErrors.username = "Username harus diisi";
      // return;
    }
    if (!password) {
      newErrors.password = "Password harus diisi";
      // return;
    }

    setErrors(newErrors);
    
    if (newErrors.username || newErrors.password) {
      toast();
      // alert("Username dan password harus diisi");
      console.log("Validation failed:", newErrors);
      return;
    }
    // else if (!errorPassword) return;

    // setErrorUsername("");
    // setErrorPassword("");

    // lanjut ke login nanti
    if(!user.some(u => u.username === username && u.password === password)) {
      setErrors({
        ...newErrors,
        validation: "Username atau password salah!"
      });
      console.log("Login failed:", { username, password });
      toast();
      return;
    } else if (user.some(u => u.username === "admin")) {
      router.push("/admin");
      return;
    }

    router.push("/");
    console.log("Login:", { username, password });
  };

  return (
    <main className="w-full h-[calc(100vh-theme(spacing.12))] px-6">
      <div className="flex flex-col items-center justify-end w-full h-full py-4">
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
            <label className="text-sm font-medium text-stroke">Username</label>
            <input
              placeholder="Username"
              className={`w-full rounded-sm px-4 py-3 text-sm border-1 border-stroke/40 focus:outline-1 outline-stroke ${
                (errors.username || errors.validation) ? "bg-rose-900/20" : "bg-gray-100"
              }`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((prev) => ({ ...prev, username: "", validation: "" }));
              }}
            />
          </div>
          
          {/* ERROR */}
          {/* {errors.username && (
            <p className="mt-0 text-center text-sm text-red-500">{errors.username}</p>
          )} */}

          <div>
            <label className="text-sm font-medium text-stroke">Password</label>
            <input
              placeholder="Password"
              type="password"
              className={`w-full rounded-sm px-4 py-3 text-sm border-1 border-stroke/40 focus:outline-1 outline-stroke ${
                (errors.password || errors.validation) ? "bg-rose-900/20" : "bg-gray-100"
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "", validation: "" }));
              }}
            />
          </div>

          {/* ERROR */}
          {/* {errors.password && (
            <p className="mt-0 text-center text-sm text-red-500">{errors.password}</p>
          )} */}
        </div>

        <div className="w-full">
          <PrimaryButton
            onClick={handleLogin}
            disabled={false}
          >
            Log In
          </PrimaryButton>

          <p className="text-center mt-6 text-sm">
            Belum jadi member?{" "}
            <Link href="/pendaftaran" className="text-prime font-bold underline hover:text-paragraph hover:no-underline">
              Daftar
            </Link>
          </p>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-rose-900 text-white px-6 py-4 rounded-sm shadow-xl text-background text-center z-50">
          {(errors.username || errors.password) ? "Username dan password harus diisi!" : errors.validation}
          {/* {errors.username ? errors.username : errors.password ? errors.password : errors.validation} */}
        </div>
      )}
    </main>
  );
}