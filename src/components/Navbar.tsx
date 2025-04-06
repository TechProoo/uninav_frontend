"use client";

import React from "react";
import Logo from "../../public/Image/temporal_logo.png";
import Image from "next/image";
import Link from "next/link";
import Button from "./ui/Button";
import { useRouter } from 'next/navigation';


// console.log(Logo);

// const isLoggedIn = false;


const Navbar = () => {
  const router = useRouter();

    const handleRoute = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      router.push('/Contact');
    }


  return (
    <div className=" relative shadow-md fill-stone-400">
      <nav>
        <div className=" flex items-center justify-between">
          <div className="nav_logo flex justify-center items-center gap-2">
            <Image className="w-20" src={Logo} alt="Uninav" />
            <p className="text-2xl">Uninav</p>
          </div>
          <ul>
            <li className="nav_li flex gap-10 items-center">
              <Link href={"/"} className="font-sans nav_link">
                Home
              </Link>
              <Link href={"/dashboard"} className="nav_link">
                About
              </Link>
              <button onClick={handleRoute} className="nav_link">
                Contact
              </button>
            </li>
          </ul>
          <div className="nav_btn flex gap-6">
            <Button text={"Login"} />
            <Button text="SignUp" />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
