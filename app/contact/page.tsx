import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ContactClient } from "./ContactClient";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />
      <ContactClient />
      <LandingFooter />
    </div>
  );
}
