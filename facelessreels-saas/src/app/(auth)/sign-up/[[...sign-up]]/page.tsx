import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <span>🎬</span>
          <span>FacelessReels</span>
        </div>
        <SignUp />
      </div>
    </main>
  );
}
