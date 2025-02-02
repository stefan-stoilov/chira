import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Logo() {
  return (
    <Button asChild variant={"ghost"} className="flex w-fit justify-start p-0">
      <Link href={"/dashboard"} className="flex gap-x-1.5">
        <svg
          width={40}
          height={40}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="ccustom"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25.556 11.685A10 10 0 0 0 20 10V0A20 20 0 1 1 0 20h10a10 10 0 1 0 15.556-8.315"
            fill="#007DFC"
          />
          <path
            className="ccustom"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 0A10 10 0 0 1 0 10v10A20 20 0 0 0 20 0z"
            fill="#007DFC"
          />
        </svg>
        <p className="text-2xl font-bold text-[#007DFC]">Chira</p>
      </Link>
    </Button>
  );
}
