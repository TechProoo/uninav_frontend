"use client";

import Image from "next/image";
import Bag from "../../public/Image/landing-removebg-preview.png";
import Button from "./ui/Button";

export default function Hero() {
  return (
    <div className="hero_container relative">
      <div className="grid grid-cols-12 items-center h-screen md:w-10/12 mx-auto">
        <div className="md:col-span-6">
          <div className="hero_left">
            <div className="flex text-2xl items-center hero_left_top gap-2">
              <small>Start Learning Today</small>
            </div>
            <div className="mt-5 hero_left_md relative">
              <h1 className="text-5xl  fst">
                The Ultimate Study Platform for University Students
              </h1>
            </div>
            <div className="hero_left_md_two">
              <p className="mt-5">
                {" "}
                Discover & Share Academic Resources – Organized by
                Faculty, Department, and Course.
              </p>
            </div>
            <div className="hero_left_bottom flex gap-5 mt-10">
              <Button text={"Get Started"} />
              <Button text={"Learn More"} />
            </div>
          </div>
        </div>
        <div className="md:col-span-6">
          <div className="hero_img">
            <Image className="hero_img_main" src={Bag} alt="Bag" />
          </div>
        </div>
      </div>
    </div>
  );
}
