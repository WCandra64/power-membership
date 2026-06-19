"use client";

import NavBar from "@/components/Navbar";
import PrimaryButton from "@/components/PrimaryButton";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";

// type FormErrors = {
//   nama: string;
//   password: string;
//   noHp: string;
//   foto: string;
//   setuju: string;
// };

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [noHp, setNoHp] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [setuju, setSetuju] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState({
    nama: "",
    password: "",
    passwordLength: "",
    noHpType: "",
    foto: "",
    setuju: false,
  });
  
  const [showToast, setShowToast] = useState(false);

  const toast = () => {
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        foto: "File harus berupa gambar.",
      }));
      return;
    }

    setPhotoFile(file);
    setErrors((prev) => ({
      ...prev,
      foto: "",
    }));
  };

  const handleSubmit = () => {
    const newErrors = {
      nama: "",
      password: "",
      passwordLength: "",
      noHpType: "",
      foto: "",
      setuju: false,
    };

    if (!nama) newErrors.nama = "Nama harus diisi";
    if (!password) newErrors.password = "Password harus diisi";
    if (password && password.length < 8) newErrors.passwordLength = "Password harus minimal 8 karakter!";
    if (noHp && !/^\d+$/.test(noHp)) newErrors.noHpType = "Nomor telepon harus berupa angka!";
    if (!photoFile) newErrors.foto = "Foto harus diisi";
    if (!setuju) newErrors.setuju = true;

    setErrors(newErrors);

    if (
      newErrors.nama ||
      newErrors.password ||
      newErrors.passwordLength ||
      newErrors.noHpType ||
      newErrors.foto ||
      newErrors.setuju
    ) {
      console.log(newErrors);
      toast();
      return;
    }

    // lanjut ke login nanti
    setOpenSuccess(true);
    console.log("Form submitted:", {
      nama,
      password,
      noHp,
      photoFile,
      setuju,
    });
  };

  const handleSuccess = () => {
    setOpenSuccess(false);
    router.push("/login");
  }

  return (
    <main className="w-full h-[calc(100vh-theme(spacing.12))] px-6">
      <div className="flex flex-col items-center justify-end w-full h-full py-4">
        <div className="flex-1 relative min-h-0 max-h-46 py-4 hidden">
          <img src="/power.png" alt="Power Gym" className="object-cover w-full h-full" />
        </div>

        <div className="w-full">
          <h1 className="text-2xl font-black text-center mt-6 mb-6">
            PENDAFTARAN
          </h1>
        </div>

        {/* INPUT FIELDS */}
        <div className="w-full mb-6 flex flex-col gap-2">
          {/* NAMA */}
          <div>
            <label className="text-xs font-medium text-stroke">Nama *</label>
            <input
              placeholder="Nama anda"
              className={`w-full rounded-sm px-4 py-3 text-sm border-1 border-stroke/40 focus:outline-1 outline-stroke ${
                errors.nama ? "bg-rose-900/20" : "bg-gray-100"
              }`}
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                setErrors((prev) => ({ ...prev, nama: "" }));
              }}
            />
          </div>
          

          {/* PASSWORD */}
          <div>
            <label className="text-xs font-medium text-stroke">Password *</label>
            <input
              placeholder="Password (minimal 8 karakter)"
              type="password"
              className={`w-full rounded-sm px-4 py-3 text-sm border-1 border-stroke/40 focus:outline-1 outline-stroke ${
                (errors.password || errors.passwordLength) ? "bg-rose-900/20" : "bg-gray-100"
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
          </div>
          

          {/* NOMOR TELEPON */}
          <div>
            <label className="text-xs font-medium text-stroke">Nomor Handphone</label>
            <input
              placeholder="Nomor Handphone (62812........)"
              type="tel"
              className={`w-full rounded-sm px-4 py-3 text-sm border-1 border-stroke/40 focus:outline-1 outline-stroke ${
                (errors.noHpType) ? "bg-rose-900/20" : "bg-gray-100"
              }`}
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
            />
          </div>


          {/* FOTO */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

            <label className="text-xs font-medium text-stroke">Foto *</label>
            <div className="flex gap-6 justify-between">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`text-left text-sm underline cursor-pointer hover:text-stroke ${errors.foto ? "text-rose-900" : "text-prime"}`}
              >
                {photoFile ? `${photoFile.name}` : "Masukkan foto anda di sini"}
              </button>

              {errors.foto && (
                <p className="text-sm text-rose-900">{`(${errors.foto})`}</p>
              )}
            </div>
          </div>
          
        </div>


        {/* PERATURAN */}
        <div className="py-4 w-full justify-center">
          <label className="select-none flex items-center">
            <input
              type="checkbox"
              checked={setuju}
              onChange={(e) => {
                console.log(e.target.checked);
                setSetuju(e.target.checked);
                setErrors((prev) => ({ ...prev, setuju: false }));
              }}
              className="h-4 w-4 accent-prime"
            />
            <span className={`text-sm pl-2 ${errors.setuju ? "text-rose-900" : "text-stroke"}`}>
              Saya sudah membaca{" "}
              <button
                type="button"
                onClick={() => setOpenRules(true)}
                className={`text-left text-sm font-medium underline cursor-pointer hover:text-stroke ${errors.setuju ? "text-rose-900" : "text-prime"}`}
              >
                peraturan gym
              </button>
              {" "}*
            </span>
          </label>

          {/* {errors.setuju && (
            <p className="mt-1 text-sm text-rose-900">{errors.setuju}</p>
          )} */}
        </div>

        <div className="w-full">
          <PrimaryButton
            onClick={handleSubmit}
            disabled={false}
          >
            Daftar
          </PrimaryButton>

          <p className="text-center mt-6 text-sm">
            Sudah jadi member?{" "}
            <Link href="/login" className="text-prime font-bold underline hover:text-paragraph hover:no-underline">
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* PERATURAN OVERLAY */}
      {openRules && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-stroke/60" onClick={() => setOpenRules(false)} />

          <div className="absolute p-6 w-full max-w-md">
            <div className="flex flex-col bg-background rounded-lg p-6  items-left gap-4">
              <h3 className="text-lg font-black font-mulish text-center">Peraturan Gym</h3>
              <hr className="border-stroke" />
              <ul className="text-sm text-paragraph pb-4">
                <li className="list-disc ml-4">Kartu anggota harus dibawa setiap kali berkunjung.</li>
                <li className="list-disc ml-4">Dilarang merokok di dalam area gym.</li>
                <li className="list-disc ml-4">Harap menggunakan pakaian olahraga yang sesuai.</li>
                <li className="list-disc ml-4">Peralatan harus digunakan dengan benar dan dikembalikan ke tempat semula.</li>
                <li className="list-disc ml-4">Dilarang membawa makanan atau minuman ke dalam area gym.</li>
                <li className="list-disc ml-4">Harap menjaga kebersihan dan membuang sampah pada tempatnya.</li>
                <li className="list-disc ml-4">Dilarang melakukan tindakan yang dapat membahayakan diri sendiri atau orang lain.</li>
                <li className="list-disc ml-4">Harap menghormati staf dan anggota lainnya.</li>
              </ul>
              <PrimaryButton
                onClick={() => {
                  setSetuju(true);
                  setOpenRules(false);
                }}
                disabled={false}
              >
                Setuju
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {openSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-stroke/60" />

          <div className="absolute p-6 w-full max-w-md">
            <div className="flex flex-col bg-background rounded-lg p-6  items-left gap-4">
              <h3 className="text-lg font-black font-mulish text-center">Verifikasi Pendaftaran</h3>
              <hr className="border-stroke" />
              <p className="text-sm text-paragraph pb-4">
                Silakan hubungi pengurus untuk melakukan pembayaran (150rb) dan mengkonfirmasi pendaftaran Anda.
                <br />
                <br />
                <a href="https://wa.me/6282220348804" target="_blank" className="text-prime italic underline hover:text-paragraph hover:no-underline">
                  +62 822-2034-8804 (Pak Muh.)
                </a>
              </p>
              <PrimaryButton
                onClick={handleSuccess}
                disabled={false}
              >
                Tutup
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-rose-900 text-white px-6 py-4 rounded-sm shadow-xl text-background text-center z-50">
          {(errors.nama || errors.password || errors.foto) ? "Anda harus mengisi semua kolom wajib (yang bertanda *)!" : errors.setuju && "Anda harus menyetujui peraturan gym untuk mendaftar!"}
          {password && password.length < 8 &&
            <>
              <br />
              {errors.passwordLength}
            </>
          }
          {noHp &&
            <>
              <br />
              {errors.noHpType}
            </>
          }
          {/* {"Anda harus menyetujui peraturan gym untuk mendaftar."} */}
          {/* {errors.username ? errors.username : errors.password ? errors.password : errors.validation} */}
        </div>
      )}
    </main>
  );
}