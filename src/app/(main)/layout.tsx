const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a2a43] text-white">
      {children}
    </div>
  );
};

export default MainLayout;
