// app/page.tsx
import DataTable from "./components/DataTable";
import Navbar from "./components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <Navbar />
      <DataTable />
    </main>
  );
}
