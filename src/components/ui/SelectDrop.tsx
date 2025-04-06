"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllFaculty } from "@/components/api/department.api";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loading";

export const SelectDemo = () => {
  const {
    data: faculties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["faculties"],
    queryFn: getAllFaculty,
  });

  //   if (isLoading)
  //     return (
  //       <div className="top-0 right-0 bottom-0 left-0 z-50 fixed flex justify-center items-center bg-[#003666]/80 backdrop-blur-sm w-screen h-screen">
  //         <Loader />
  //       </div>
  //     );
  if (error) return <p>Failed to load faculties</p>;

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a faculty" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Faculties</SelectLabel>
          {faculties?.map((n: any) => (
            <SelectItem key={n.id} value={n.id.toString()}>
              {n.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
