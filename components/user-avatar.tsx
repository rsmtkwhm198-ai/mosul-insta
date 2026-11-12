import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string | null;
  name: string;
  size?: number;
  className?: string;
};

export function UserAvatar({ src, name, size = 36, className }: Props) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-semibold text-primary ring-1 ring-border",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(12, size * 0.4) }}
    >
      {src ? (
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span>
      )}
    </span>
  );
}
