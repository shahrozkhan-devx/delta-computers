import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children, email }) {
  return (
    <div className="min-h-screen bg-[#05080f] text-slate-100 lg:flex">
      <AdminSidebar email={email} />
      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
