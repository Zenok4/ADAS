import { useRouter } from "next/navigation";

const MenuButton = () => {
  const router = useRouter();
  return (
    <button
      className="rounded-lg border border-[#80d4ff] bg-[#113a5c] p-1 shadow-md hover:scale-105 transition"
      onClick={() => router.push("/")}
    >
      <div className="grid grid-cols-2 gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#80d4ff]" />
        ))}
      </div>
    </button>
  );
};

export default MenuButton;
