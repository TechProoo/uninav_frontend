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

export const SelectDemo = ({ onChange }: Props) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="article">Article</SelectItem>
          <SelectItem value="scheme_of_work">Scheme of work</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="guideline">Guideline</SelectItem>
          <SelectItem value="tutorial">Tutorial</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
