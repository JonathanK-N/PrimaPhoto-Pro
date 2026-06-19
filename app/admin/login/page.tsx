import { Camera } from "lucide-react";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion Admin | Prima Photo",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="mb-10 flex items-center gap-2 font-display text-2xl tracking-[0.2em] uppercase">
        <Camera className="h-6 w-6 text-accent" strokeWidth={1.5} />
        Prima<span className="text-accent">Photo</span>
      </div>
      <p className="mb-8 text-xs tracking-[0.4em] uppercase text-muted">
        Espace Administration
      </p>
      <LoginForm />
    </div>
  );
}
