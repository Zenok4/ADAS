import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo = ({ width = 10, height = 10 }: LogoProps) => {
  return (
    <div className={`relative h-${width} w-${height || width}`}>
      <Image src={"/logo.png"} alt="Logo" fill className="object-contain p-1" />
    </div>
  );
};

export default Logo;
