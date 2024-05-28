import Image from "next/image";
import { twMerge } from "tailwind-merge";
export function CloseButtonRed({
  close,
  size,
  className,
}: {
  close: () => void;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "bg-custom-red w-fit rounded-md p-1 absolute top-2 right-2 cursor-pointer hover:brightness-90 duration-150 shadow-sm",
        className
      )}
      onClick={close}
    >
      <Image
        alt="Remove"
        src="/icons/icon_close_bright.svg"
        width={size ?? 10}
        height={size ?? 10}
      />
    </div>
  );
}
