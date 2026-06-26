"use client";

// import { UserCircle2, Menu } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from '@/app/actions/logout';
import { useTransition } from 'react';

export default function Navbar() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  const hiddenNavbarPaths = ["/login", "/pendaftaran", "/member"];

  const hideIcon = hiddenNavbarPaths.some((path) =>
    pathname.startsWith(path)
  );

  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.push("/login");
    });
  };

  return (
    <div className="flex items-center justify-between px-6 border-b-2 bg-background w-full max-w-3xl h-12 fixed z-10">
      <div className={`flex items-center h-full ${hideIcon && "mx-auto"}`}>
        <Link href="/" className="h-full flex items-center py-2">
          <img
            src="/power_nav.png"
            alt="Power Gym"
            className="object-contain h-full w-auto"
          />
        </Link>
      </div>

      {!hideIcon && (
        <div className='flex gap-4'>
          {isAdmin && 
            <button onClick={handleLogout} disabled={pending}>
              <FontAwesomeIcon icon={faRightFromBracket} size="lg" className="text-prime w-6 h-6 hover:text-paragraph cursor-pointer" />
            </button>
          }
          <Link href={isAdmin ? "/admin" : "/login"} className="text-sm font-medium text-prime">
            <FontAwesomeIcon icon={isAdmin ? faBars : faCircleUser} size="xl" className="text-prime w-6 h-6 hover:text-paragraph" />
          </Link>
        </div>
      )}
    </div>
  );
}