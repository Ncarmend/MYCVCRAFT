import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CareersClient } from "./CareersClient";

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <CareersClient />
      <LandingFooter />
    </div>
  );
}
