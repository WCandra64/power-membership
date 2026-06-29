"use client";

import PrimaryButton from "@/components/PrimaryButton";
import BareButton from "@/components/BareButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import { storeTime } from "@/lib/time";
import { uploadImage } from "@/lib/imageOperations";

export default function AddMemberPage() {

  const now = storeTime();
  const toDate = storeTime().toISOString().split("T")[0];
  
  const [loading, setLoading] = useState(false);

  const [credential, setCredential] = useState({
    username: "",
    password: "",
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [openSuccess, setOpenSuccess] = useState(false);

  const [errors, setErrors] = useState({
    name: false,
    phoneType: false,
    phoneLength: false,
    photo: false,
  });
  
  const [showToast, setShowToast] = useState(false);

  const toast = () => {
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const [membershipDate, setMembershipDate] = useState(false);
  const [startMembership, setStartMembership] = useState("");
  const [endMembership, setEndMembership] = useState("");

  function setMembership(date: Date = now) {
    const result = new Date(date);

    setStartMembership(result.toISOString().split("T")[0]);

    const daysOfMonth = new Date(
      result.getFullYear(),
      result.getMonth() + 1,
      0
    ).getDate();

    result.setDate(result.getDate() + daysOfMonth - 1);

    setEndMembership(result.toISOString().split("T")[0]);
  }
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        photo: true,
      }));
      return;
    }

    setPhotoFile(file);
    setErrors((prev) => ({
      ...prev,
      photo: true,
    }));

    // allow selecting same file later
    e.currentTarget.value = "";
  };

  function validateForm() {
    const newErrors = {
      name: false,
      phoneType: false,
      phoneLength: false,
      photo: false,
    };

    if (!name) newErrors.name = true;
    if (phone && !/^\d+$/.test(phone)) newErrors.phoneType = true;
    if (phone.length > 15) newErrors.phoneLength = true;
    if (!photoFile) newErrors.photo = true;

    setErrors(newErrors);

    if (
      newErrors.name ||
      newErrors.phoneType ||
      newErrors.phoneLength ||
      newErrors.photo
    ) {
      console.log(newErrors);
      toast();
      return;
    }

    // lanjut ke login nanti
    setMembershipDate(true);
    console.log("Form submitted:", {
      name,
      phone,
      photoFile,
      startMembership,
      endMembership
    });
  };

  async function registerMember() {
    try {
      setLoading(true);

      // UPLOAD IMAGE
      const imageData = await uploadImage(name, photoFile);

      console.log(imageData);

      const photoUrl = imageData.secure_url;
      const photoId = imageData.public_id;

      // CREATE MEMBER
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          photoUrl,
          photoId,
          startMembership,
          endMembership,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setCredential({
        username: data.username,
        password: data.password,
      });

      setMembershipDate(false);
      setOpenSuccess(true);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess() {
    setName("");
    setPhone("");
    setPhotoFile(null);

    setCredential({
      username: "",
      password: "",
    });

    setOpenSuccess(false);
  }
  
  useEffect(() => {
    setMembership();
  }, []);

  return (
    <main className="w-full h-[calc(100dvh-theme(spacing.12))] px-6 bg-foreground">
      <div className="flex flex-col items-center justify-end w-full h-full py-4">
        <div className="flex-1 relative min-h-0 max-h-46 py-4">
          <img src="/power.png" alt="Power Gym" className="object-cover w-full h-full" />
        </div>

        <div className="w-full">
          <h1 className="text-2xl font-black text-center mt-6 mb-6">
            MEMBER BARU
          </h1>
        </div>

        {/* INPUT FIELDS */}
        <div className="w-full mb-6 flex flex-col gap-2">
          {/* NAMA */}
          <div>
            <label className="text-xs font-medium text-stroke">
              Name <span className="text-prime">*</span>
              <span className="text-prime">{errors.name && " (Nama member harus diisi!)"}</span>
            </label>
            <input
              placeholder="Nama Member"
              className={`
                w-full rounded-sm px-4 py-4 text-sm
                border-1 border-stroke/40 focus:outline-2 outline-stroke
                ${name ? "outline-2 bg-background" : "bg-paragraph/5"}
                ${errors.name && "bg-prime/20"}
              `}
              value={name}
              onChange={(e) => {
                const value = e.target.value
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase());
                  
                setName(value);
                setErrors((prev) => ({ ...prev, name: false }));
              }}
            />
          </div>
          

          {/* NOMOR TELEPON */}
          <div>
            <label className="text-xs font-medium text-stroke">
              Nomor Handphone
              <span className="text-prime">{errors.phoneType ? " (No. HP harus berupa angka!)" : errors.phoneLength && " (No. HP tidak bisa melebihi 15 karakter)"}</span>
            </label>
            <input
              placeholder="Nomor Handphone (62812........)"
              type="tel"
              className={`
                w-full rounded-sm px-4 py-4 text-sm
                border-1 border-stroke/40 focus:outline-2 outline-stroke
                ${phone ? "outline-2 bg-background" : "bg-paragraph/5"}
                ${(errors.phoneType || errors.phoneLength) && "bg-prime/20"}
              `}
              value={phone || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (!isNaN(Number(val)) && val.length <= 15) {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phoneLength: false, phoneType: false }));
                }
              }}
            />
          </div>


          {/* FOTO */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handlePhotoChange}
              className="hidden"
            />

            <label className="text-xs font-medium text-stroke">
              Foto <span className="text-prime">*</span>
              <span className="text-prime">{errors.photo && " (Foto member harus diisi!)"}</span>
            </label>

            {/* INPUT IMAGE */}
            <div onClick={() => fileInputRef.current?.click()} className="flex flex-col gap-1 cursor-pointer">
              {photoFile?
                <div className="relative w-46 h-46 border-2 border-stroke ">
                  <img
                    src={URL.createObjectURL(photoFile)}
                    alt={photoFile.name}
                    className="w-full h-full object-cover"
                  />

                  {/* DELETE IMAGE */}
                  <button 
                    type="button"
                    onClick={(e) => {e.preventDefault(); e.stopPropagation(); setPhotoFile(null); }}
                    className="absolute top-0 -right-10 text-prime hover:text-stroke cursor-pointer"
                  >
                    <FontAwesomeIcon size="xl" icon={faRemove}/>
                  </button>
                </div>
              : <span className={`text-left text-md font-mulish underline hover:text-stroke text-prime font-bold`}>Masukkan foto member di sini.</span>
              }
            </div>

          </div>
          
        </div>

        <div className="w-full flex flex-col gap-4">
          <PrimaryButton
            onClick={validateForm}
            disabled={loading}
          >
            {loading? "Loading..." : "Tambah Member"}
          </PrimaryButton>

          <Link href="/admin">
            <BareButton>
              <FontAwesomeIcon icon={faRemove} />
              Batal
            </BareButton>
          </Link>
        </div>
      </div>

      {/* SET MEMBERSHIP */}
      <div className={`fixed inset-0 flex items-center justify-center z-50 w-full h-full ${!membershipDate && "hidden"}`}>

        <div onClick={() => setMembershipDate(false)} className="absolute inset-0 bg-stroke/80" />

        <div className="absolute w-full max-w-md p-6">
          <div className="flex flex-col gap-4 bg-background p-6 rounded-sm">
            <h3 className="text-lg font-black font-mulish text-center">Tambah Member Baru</h3>

            <hr className="border-stroke" />

            <span className="text-sm">Masa aktif membership:</span>
            <div className="flex flex-col">
              <label className="text-xs">Tanggal Mulai</label>
              <input
                type="date"
                name="startMembershipship"
                value={startMembership || ""}
                onChange={(e) => setMembership(!isNaN(new Date(e.target.value).getTime()) ? new Date(e.target.value) : now)}
                className="rounded-lg border px-3 py-4"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs">Tanggal Akhir</label>
              <input
                type="date"
                name="endMembership"
                value={endMembership || ""}
                onChange={(e) => {
                  setEndMembership(e.target.value);
                }}
                className="rounded-lg border px-3 py-4"
              />
            </div>
            
            <div className="flex gap-2 pt-6">
              <BareButton
                onClick={() => {
                  setMembershipDate(false);
                  setMembership();
                }}
              >
                Batal
              </BareButton>
              <PrimaryButton
                onClick={() => {
                  setMembershipDate(false);
                  // window.location.reload();
                  registerMember();
                }}
              >
                Daftarkan Member
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS OVERLAY */}
      {openSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-stroke/60" />

          <div className="absolute p-6 w-full max-w-md">
            <div className="flex flex-col bg-background rounded-lg p-6  items-left gap-4">
              <h3 className="text-lg font-black font-mulish text-center">Member Berhasil Didaftarkan!</h3>

              <hr className="border-stroke" />

              <div className="flex flex-col gap-2 pb-4">
                <div className="flex flex-col">
                  <p className="text-xs text-paragraph">Username:</p>
                  <span className="font-semibold text-sm tracking-wide">{credential.username}</span>
                </div>

                <div className="flex flex-col">
                  <p className="text-xs text-paragraph">Password:</p>
                  <span className="font-semibold text-sm tracking-wide">{credential.password}</span>
                </div>
                
                <div className="flex flex-col">
                  <p className="text-xs text-paragraph">Masa Aktif:</p>
                  <span className="text-sm font-semibold">{new Date(startMembership).toLocaleDateString('id-ID', {dateStyle: 'long'})} - {new Date(endMembership).toLocaleDateString('id-ID', {dateStyle: 'long'})}</span>
                </div>

              </div>

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

      {/* {showToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-rose-900 text-white px-6 py-4 rounded-sm shadow-xl text-background text-center z-50">
          {(errors.name || errors.foto) && "Anda harus mengisi semua kolom wajib (yang bertanda *)!"}
          {phone &&
            <>
              <br />
              {errors.phoneType}
            </>
          }
        </div>
      )} */}
    </main>
  );
}