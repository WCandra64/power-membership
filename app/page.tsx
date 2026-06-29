import PrimaryButton from "@/components/PrimaryButton";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronDown, faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { getOperationalData } from "@/lib/operationalData";

export const dynamic = "force-dynamic";

export default async function Home() {

  const opData = await getOperationalData();
  console.log(opData);

  return (
    <main className="h-[calc(100dvh-theme(spacing.12))] overflow-y-scroll snap-y snap-mandatory scroll-smooth custom-scrollbar">

      {/* HERO */}
      <section className="snap-start h-[calc(100dvh-theme(spacing.12))] flex flex-col items-center justify-end bg-background pb-4">
        
        <div className="flex items-center justify-center px-6 py-2 w-full">
          {/* LOGO */}
          <img
            src="/power_main.svg"
            alt="Hero Image"
            width={180}
            height={180}
            className="object-contain"
          />
        </div>

        {/* IMAGE */}
        <div className="text-center py-2 w-full">
          {/* MAP */}
          <div className="flex items-center gap-2 justify-center py-2">
            <FontAwesomeIcon icon={faLocationDot} size="lg" className="text-prime w-4 h-4" />

            <Link href="https://maps.app.goo.gl/2oGnhsZCFypzGddC6" className="text-prime text-sm font-mulish underline font-bold italic cursor-pointer hover:text-stroke">
              Maguwoharjo, Sleman
            </Link>
          </div>

          <div className="h-[46vh] w-full relative" >
            {/* HERO IMG */}
            <img
              src="/hero.png"
              alt="Gym murah dan lengkap di yogyakarta"
              className="
                w-full h-full object-cover
                [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]
                [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]
              "
            />

            {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" /> */}

            {/* PRICE */}
            <Link href="https://wa.me/6282220348804" className="absolute right-2 bottom-2 flex h-fit items-end gap-1 px-4 py-2 -mt-20 bg-prime text-background rounded-sm border-2 border-stroke shadow-sm/40 font-chivo italic hover:bg-stroke">
              <div className="font-bold text-xs">
                {`Rp `}
              </div>
              <div className="flex gap-1 items-start">
                <div className="font-bold tracking-wider text-2xl">
                  150K
                </div>
                <div className="text-xs">
                {` /bln`}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* PRICE */}
        {/* <div className="w-full flex justify-end mr-4">
          <Link href="/pendaftaran" className="flex h-fit items-end gap-1 px-4 py-2 -mt-20 bg-prime text-background rounded-sm border-2 border-stroke shadow-sm/40 font-chivo italic hover:bg-stroke">
            <div className="font-bold text-xs">
              {`Rp `}
            </div>
            <div className="flex gap-1 items-start">
              <div className="font-bold tracking-wider text-2xl">
                150K
              </div>
              <div className="text-xs">
              {` /bln`}
              </div>
            </div>
          </Link>
        </div> */}


        {/* STATUS */}
        <div className="flex flex-col gap-2 justify-center px-6 mt-6 w-full text-center">
          <div className="w-full flex justify-center items-center">
            {
            // loading? (
            //   <div className="w-fit flex items-center gap-4 bg-paragraph/10 text-paragraph/40 border border-paragraph/40 px-6 py-1 rounded-full text-md font-bold tracking-wider" />
            // ) :
            opData.operasional ? (
              <div className="w-full flex justify-center items-center gap-6 ">
                <div className="flex items-center gap-4 bg-green-100 text-green-500 border border-green-500 px-6 py-1 rounded-full text-md font-bold tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  BUKA
                </div>

                <p className="text-xs mt-2 italic">
                  <span className="font-bold">{opData.pengunjung}</span> orang sedang latihan
                </p>
              </div>
            ) : (
              <div className="w-fit flex items-center gap-4 bg-paragraph/10 text-paragraph/40 border border-paragraph/40 px-6 py-1 rounded-full text-md font-bold tracking-wider">
                <div className="w-2 h-2 rounded-full bg-paragraph/40" />
                TUTUP
              </div>
            )}
            {/* <div className="bg-green-100 text-green-600 border border-green-600 px-4 px-4 py-2 rounded-full inline-block text-sm font-semibold">
              ● BUKA
            </div>

            <p className="text-xs mt-2 italic">
              40 orang sedang latihan
            </p> */}

          </div>

          <p className="text-xs tracking-wide text-prime">
            {opData.pengumumanAktif || ""}
          </p>
        </div>

        <FontAwesomeIcon icon={faChevronDown} size="sm" className="text-paragraph mt-6" />
      </section>
              

      {/* FASILITAS */}
      <section className="snap-start w-full h-[calc(100dvh-theme(spacing.12))] flex flex-col gap-6 items-center justify-end bg-background pb-8">
        <div className="w-full flex flex-col gap-2 px-6">
          <h2 className="text-2xl font-black text-center">Fasilitas</h2>
          <p className="text-xs text-center">
            Ruang yang luas, alat yang lengkap, dan suasana yang nyaman — semuanya untuk mendukung latihan kerasmu.
          </p>
        </div>

        <div className="flex w-full gap-2 px-6 overflow-x-auto scrollbar-hidden scroll-smooth">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-none relative w-full h-[56vh] bg-slate-400 rounded-xs border-2 border-stroke select-none">
              <img src="/hero.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute flex flex-col gap-1 bottom-0 bg-stroke/80 w-full px-4 py-2">
                <h4 className="font-extrabold text-prime">Lorem Ipsum</h4>
                <p className="text-xs text-background font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
            
          ))}
        </div>
      </section>
      

      {/* PRICING */}
      <section className="snap-start w-full h-[calc(100dvh-theme(spacing.12))] flex flex-col gap-6 items-center justify-end bg-background pb-8 px-6">
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-2xl font-black text-center">Biaya</h2>
          <p className="text-xs text-center">
            Biaya yang terjangkau dengan manfaat yang maksimal — pilih paket yang sesuai dengan kebutuhanmu.
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">

          {/* BULANAN */}
          <div className="flex flex-col gap-4 border-2 border-stroke w-full px-6 py-4 rounded-sm">
            <div className="flex gap-6 items-center">
              <div className="flex items-end italic">
                <h4 className="text-sm font-black">Rp</h4>
                <h1 className="text-5xl font-black text-prime [text-shadow:-1px_-1px_0_black,1px_-1px_0_black,-1px_1px_0_black,1px_1px_0_black,0_2px_4px_rgba(0,0,0,0.8)]">150K</h1>
              </div>

              <div className="flex flex-col">
                <h2 className="font-black pb-1 italic">Member Bulanan</h2>
                <p className="text-xs">Akses penuh selama sebulan</p>
                <ul className="text-xs list-disc pl-4">
                  <li className="">Akses ke seluruh alat</li>
                  <li className="">Cocok untuk latihan rutin</li>
                  <li className="">Lebih hemat</li>
                </ul>
              </div>
            </div>

            <Link href="https://wa.me/6282220348804"><PrimaryButton>Daftar Sekarang</PrimaryButton></Link>
          </div>

          <div className="w-full flex gap-2">

            {/* 25K */}
            <div className="flex flex-col border-2 border-stroke w-full px-6 py-4 rounded-sm">
              <div className="flex justify-end items-end italic">
                <h4 className="text-sm font-black">Rp</h4>
                <h1 className="text-3xl font-black text-prime [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">25K</h1>
              </div>

              <h2 className="font-black pt-4 pb-1 italic">Harian</h2>
              <p className="text-xs">Akses penuh seharian</p>
              <ul className="text-xs list-disc pl-4">
                <li className="">Akses gym 1 hari</li>
                <li className="">Bebas akses ke seluruh alat</li>
              </ul>
            </div>

            {/* 15K */}
            <div className="flex flex-col border-2 border-stroke w-full px-6 py-4 rounded-sm">
              <div className="flex justify-end items-end italic">
                <h4 className="text-sm font-black">Rp</h4>
                <h1 className="text-3xl font-black text-prime [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">15K</h1>
              </div>

              <h2 className="font-black pt-4 pb-1 italic">Harian</h2>
              <p className="text-xs">Akses harian tanpa treadmill</p>
              <ul className="text-xs list-disc pl-4">
                <li className="">Akses gym 1 hari</li>
                <li className="">Tanpa akses treadmill</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
      

      {/* LOCATION */}
      <section className="snap-start h-[calc(100dvh-theme(spacing.12))] flex flex-col items-center justify-end gap-6 bg-background pb-8 px-6">
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-2xl font-black text-center">Lokasi</h2>
          <p className="text-xs text-center">
            Datang dan latihan langsung — tempat yang nyaman dan mudah di akses dengan bonus pemandangan sunset.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full rounded-sm border-2 border-stroke bg-foreground px-4 py-2">
          <div className="overflow-hidden border border-stroke">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.2148465206706!2d110.43842030948721!3d-7.767026877005038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5b00368cae57%3A0xb4ec7e75d483b569!2sPower%20Gym%20and%20Fitness!5e0!3m2!1sid!2sid!4v1781856708485!5m2!1sid!2sid"
              width="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[36vh]"
            />
          </div>
          <h6 className="font-black text-xs text-center">Power Gym and Fitness</h6>

          <div className="flex flex-col gap-2 text-sm text-stroke">
            <div className="flex gap-2 w-full justify-start items-center">
              <FontAwesomeIcon icon={faLocationDot} className="text-prime" />
              <span>Sembego, Maguwoharjo, Depok, Sleman</span>
            </div>
            <div className="flex gap-2 w-full justify-start items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-prime" />
              <span>Buka setiap hari (<span className="text-prime italic">kecuali hari libur nasional</span>)</span>
            </div>
            <div className="flex gap-2 w-full justify-start items-center">
              <FontAwesomeIcon icon={faClock} className="text-prime" />
              <span>Pukul 07.00 - 12.00 dan 15.00 - 21.00</span>
            </div>
            <Link href="https://wa.me/6282220348804" className="flex gap-2 justify-start items-center">
              <FontAwesomeIcon icon={faWhatsapp} className="text-prime" />
              <span className="underline">+62 822-2034-8804 (Pak Muh)</span>
            </Link>
          </div>
          
        </div>
      </section>
    </main>
  );
}