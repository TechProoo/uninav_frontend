import React from "react";
import Image from "next/image";
import { ArrowBigRight, Edit, Trash } from "lucide-react";
import { Content } from "@/lib/types/response.type";

type DataContent = {
  data: Content;
};

const Card = ({ data }: DataContent) => {
  if (!data) return null;

  return (
    <div className="max-w-sm  rounded-[24px] p-4 relative">
      <div className="relative overflow-hidden rounded-[24px]">
        <Image
          src={data.headingImageAddress || "/fallback.jpg"}
          alt="Blog Image"
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-[24px] rounded-br-[0px]"
        />
        <div className="absolute flex items-center top-0 right-5">
          <div
            className="bg-[#f0f8ff] p-1 rounded-bl-lg rounded-br-lg cursor-pointer active:animate-shake"
            onClick={(e) => e.currentTarget.classList.add("animate-shake")}
            onAnimationEnd={(e) =>
              e.currentTarget.classList.remove("animate-shake")
            }
          >
            <Edit size={15} color="#003666" />
          </div>
          <div
            className="bg-[#f0f8ff] p-2 rounded-bl-lg rounded-br-lg cursor-pointer active:animate-shake"
            onClick={(e) => e.currentTarget.classList.add("animate-shake")}
            onAnimationEnd={(e) =>
              e.currentTarget.classList.remove("animate-shake")
            }
          >
            <Trash size={15} className="text-red-500" />
          </div>
        </div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-[#f0f8ff] rounded-tl-full flex items-center justify-center translate-x-1/2 translate-y-1/2 group transition-colors duration-300">
          <span className="text-white text-xl mt-2 group-hover:translate-x-2 transition-transform duration-300">
            <ArrowBigRight size={30} className="text-[#0c385f]" />
          </span>
        </div>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">{data.title}</h2>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{data.description}</p>
      <div className="flex gap-2 mt-4">
        <span className="text-xs font-medium bg-orange-200 text-orange-800 px-3 py-1 rounded-full">
          {new Date(data.createdAt).toLocaleDateString()}
        </span>
        <span className="text-xs font-medium bg-green-200 text-green-800 px-3 py-1 rounded-full">
          {data.creator?.username || "Anonymous"}
        </span>
      </div>
    </div>
  );
};

export default Card;
