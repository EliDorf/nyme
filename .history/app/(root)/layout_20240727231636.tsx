const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen">
      <NewSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <Dashboard />
        {children}
      </div>
    </main>
  );
}