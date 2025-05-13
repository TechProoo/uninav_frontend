"use client";

import { AccordionDemo } from "@/components/uni_map/accordion";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#003666]">Course Map</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <AccordionDemo />
      </div>
    </div>
  );
};

export default page;
