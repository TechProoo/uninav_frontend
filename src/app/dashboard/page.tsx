import React from "react";

import Book from "../../../public/Image/bookOne.png";
import Image from "next/image";
import Card from "@/components/ui/card/card";
import Slider from "@/components/ui/Slider";

const page = () => {
  const items = [
    <Card
      key={1}
      title="Card 1"
      description="This is the first card."
      imageUrl="https://source.unsplash.com/random/1"
    />,
    <Card
      key={2}
      title="Card 2"
      description="This is the second card."
      imageUrl="https://source.unsplash.com/random/2"
    />,
    <Card
      key={3}
      title="Card 3"
      description="This is the third card."
      imageUrl="https://source.unsplash.com/random/3"
    />,
  ];
  return (
    <div className="">
      <div className="shadow-lg dashboard_gr rounded-xl p-3 md:p-5 text-white flex flex-col md:flex-row justify-between items-center shadow-xl ">
        <div className="flex flex-col items-center space-y-4 md:items-start">
          <Image
            src={Book}
            alt="Books and Glasses"
            className="md:w-[250px] w-[200px]"
          />
        </div>

        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-2xl md:text-3xl font-semibold fst">
            Hi, TechPro
          </h1>
          <p className="text-sm md:text-base mt-2">
            UniNav is your trusted gateway to academic resources, connecting
            students with study materials, past questions, and peer support.
          </p>
          <button className="mt-4 bg-white text-slate-600 fst px-6 py-2 rounded-full shadow hover:bg-blue-100 transition">
            Recommeded Course files
          </button>
        </div>

        <div className="hidden md:block">
          <Image src={Book} alt="Books on Shelf" width={250} height={250} />
        </div>
      </div>
      <div>
        <h1>Recommeded</h1>
        <Slider items={items} itemsPerSlide={2} autoPlayInterval={4000} />
      </div>
    </div>
  );
};
export default page;
