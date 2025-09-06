import { useRouter } from "next/navigation";

interface MenuProps {
  title: string;
  href?: string;
  Icon?: React.ComponentType<any>;
  children?: React.ReactNode;
}

const MenuTemplate = ({ title, href, Icon, children }: MenuProps) => {
  const router = useRouter();

  const handleClick = (href?: string) => {
    if (href) {
      router.push(href);
    }
  };
  return (
    <div className="w-full h-full" onClick={() => handleClick(href)}>
      {Icon && <Icon />}
      <p className="text-[#80d4ff] text-2xl font-bold mb-4">{title}</p>
      {children}
    </div>
  );
};

export default MenuTemplate;
