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

type Props = {
  onChange: (value: string) => void;
};

export const SelectType = ({ onChange }: Props) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-[100%]">
        <SelectValue placeholder="category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Category</SelectLabel>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="video">Video</SelectItem>
          <SelectItem value="image">Image</SelectItem>
          <SelectItem value="article">Article</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
