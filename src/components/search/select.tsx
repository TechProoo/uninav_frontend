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
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Category</SelectLabel>
          <SelectItem value="article">Article</SelectItem>
          <SelectItem value="scheme_of_work">Scheme of work</SelectItem>
          <SelectItem value="guideline">Guideline</SelectItem>
          <SelectItem value="tutorial">Tutorial</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
