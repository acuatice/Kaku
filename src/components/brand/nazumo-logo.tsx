import Image from "next/image";

export function NazumoLogo({ className = "" }: { className?: string }) {
  return <Image src="/brand/nazumo-logo.png" alt="nazumo" width={1000} height={180} priority className={`h-auto w-[7.25rem] object-contain mix-blend-multiply sm:w-[8rem] ${className}`} />;
}
