"use client";

// import { UserCircle2, Menu } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faBars, faRightFromBracket, faCertificate, faStreetView, faLandmark, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from '@/app/actions/logout';
import { useState, useTransition } from 'react';
import BareButton from './BareButton';
import NavbarAdmin from './NavbarAdmin';
import PrimaryButton from './PrimaryButton';

export default function Navbar() {
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdmin = pathname.startsWith("/admin");
  const isMember = pathname.startsWith("/member");

  const hiddenNavbarPaths = ["/login"];

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

  const memberMenu = [
    {
      name:"Profil",
      href:`/member`,
      icon:faCircleUser
    },
    {
      name:"Riwayat Membership",
      href:`/member/membership`,
      icon:faCertificate
    },
    {
      name:"Riwayat Latihan",
      href:`/member/visit`,
      icon:faStreetView
    }
  ];

  return (
    <div className="flex items-center justify-between px-6 border-b-2 bg-background w-full max-w-3xl h-12 fixed z-10">

      {/* LOGO */}
      <div className={`flex items-center h-full ${hideIcon && "mx-auto"}`}>
        <Link href="/" onClick={() => setDrawerOpen(false)} className="h-full flex items-center py-2">
          <img
            src="/power_nav.png"
            alt="Power Gym"
            className="object-contain h-full w-auto"
          />
        </Link>
      </div>

      { !hideIcon && (
        <div className='flex gap-4'>
          {isAdmin && 
            // PANEL ADMIN
            <Link href="/admin" onClick={() => setDrawerOpen(false)} className="text-sm font-medium text-prime">
              <FontAwesomeIcon icon={faLandmark} size="xl" className="text-prime w-6 h-6 hover:text-paragraph cursor-pointer" />
            </Link>
          }

          {isAdmin || isMember ? (
            <button onClick={() => setDrawerOpen(!drawerOpen)} className="text-sm font-medium text-prime">
              <FontAwesomeIcon icon={faBars} size="xl" className={`${drawerOpen ? "text-stroke" : "text-prime"} w-6 h-6 hover:text-paragraph cursor-pointer`} />
            </button>
          ) : (
            <Link href="/login" className="text-sm font-medium text-prime">
              <FontAwesomeIcon icon={faCircleUser} size="xl" className="text-prime w-6 h-6 hover:text-paragraph cursor-pointer" />
            </Link>
          )}
        </div>
      )}

      {/* NAVIGATION DRAWER */}
      { drawerOpen &&
        <div className="fixed inset-0 top-12 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setDrawerOpen(false)} />

          <div className="absolute top-0 inset-x-0 mx-auto h-fit w-full max-w-3xl bg-background p-6">
            <div className="flex flex-col justify-between gap-8">
              <div className='flex flex-col gap-6'>
                {isAdmin ? <NavbarAdmin /> : (
                  memberMenu.map( item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex gap-4 items-center justify-end text-prime hover:text-stroke"
                    >
                      <div className="font-bold tracking-wide">{item.name}</div>
                      <FontAwesomeIcon icon={item.icon} size='xl' className='w-6' />
                    </Link>
                  ))
                )}
              </div>

              <div className="flex flex-col gap-6 w-full">
                { isAdmin && (
                  <Link href="/admin/jadwal" onClick={() => setDrawerOpen(false)} className="py-2 text-prime font-bold text-sm">
                    <PrimaryButton>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      Jadwal Tutup
                    </PrimaryButton>
                  </Link>
                )}

                <hr />

                { isAdmin ? (
                  <BareButton>
                    <FontAwesomeIcon icon={faRightFromBracket} size='xl' className='w-6' />
                    Log Out
                  </BareButton>
                ) : (
                  <div onClick={() => {handleLogout; setDrawerOpen(false)}} className='flex gap-4 items-center justify-end text-prime hover:text-stroke cursor-pointer'>
                    <div className="font-bold tracking-wide">Log Out</div>
                    <FontAwesomeIcon icon={faRightFromBracket} size='xl' className='w-6' />
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}