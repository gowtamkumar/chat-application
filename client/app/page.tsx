import Footer from "@/components/Footer";
import HomePage from "@/components/Home";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center  justify-items-center min-h-screen  font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] py-10 row-start-2  items-center sm:items-start">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
