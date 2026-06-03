/**
 * Tiny icon wrappers for CV template contact rows.
 * Size defaults to 11 to stay legible at print scale.
 */
import { Mail, Phone, MapPin, Globe, Briefcase, Code2, Link } from "lucide-react";
import type { LucideProps } from "lucide-react";

type P = { size?: number; style?: React.CSSProperties; className?: string };

const icon =
  (Icon: React.FC<LucideProps>) =>
  ({ size = 11, style, className }: P) =>
    <Icon size={size} style={{ flexShrink: 0, display: "inline-block", ...style }} className={className} />;

export const MailIcon      = icon(Mail);
export const PhoneIcon     = icon(Phone);
export const LocationIcon  = icon(MapPin);
export const WebIcon       = icon(Globe);
export const LinkedinIcon  = icon(Briefcase);
export const GithubIcon    = icon(Code2);
export const PortfolioIcon = icon(Link);
