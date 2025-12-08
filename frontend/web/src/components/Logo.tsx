import { PawPrint } from "lucide-react";

export default function Logo() {
  return (
    <span className="flex flex-row gap-4">
      <PawPrint size={24} className="text-blue-400" />
      <h3 className="font-semibold ">Pet App</h3>
    </span>
  );
}
