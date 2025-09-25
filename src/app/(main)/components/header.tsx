import Logo from "@/components/logo";
import MenuButton from "@/components/menu-btn";

interface HeaderProps {
  header: string;
}

const Header = ({header}: HeaderProps) => {
  return (
    <div className="sticky top-0 z-10 border-b border-[#80d4ff]/30 bg-[#0a2a43]/90 backdrop-blur">
      <div className="mx-auto max-w-lg px-3 sm:px-4 h-12 flex items-center justify-between">
        {/* Logo + tiêu đề */}
        <div className="flex items-center gap-2">
          <Logo width={6}/>
          <span className="text-lg font-semibold text-white">
            {header}
          </span>
        </div>

        {/* Nút icon 4 chấm */}
        <MenuButton />
      </div>
    </div>
  );
};

export default Header;
