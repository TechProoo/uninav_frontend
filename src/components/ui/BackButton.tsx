import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

interface BackButtonProps {
  className?: string;
  label?: string;
  onClick?: () => void;
}

const BackButton = ({ className = "", label = "Back", onClick }: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={`flex items-center gap-2 hover:bg-[#0c385f] px-2 py-1 border border-[#0c385f] rounded-lg hover:text-[#ffffff] transition-colors ${className}`}
    >
      <ChevronLeft className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
};

export default BackButton; 