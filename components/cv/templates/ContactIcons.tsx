import { Mail, Phone, MapPin, Globe, Briefcase, Code2, Link } from "lucide-react";

interface IconProps {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

const s = (extra?: React.CSSProperties): React.CSSProperties => ({
  flexShrink: 0, display: "inline-block", ...extra,
});

export function MailIcon({ size = 11, style, className }: IconProps) {
  return <Mail size={size} style={s(style)} className={className} />;
}
export function PhoneIcon({ size = 11, style, className }: IconProps) {
  return <Phone size={size} style={s(style)} className={className} />;
}
export function LocationIcon({ size = 11, style, className }: IconProps) {
  return <MapPin size={size} style={s(style)} className={className} />;
}
export function WebIcon({ size = 11, style, className }: IconProps) {
  return <Globe size={size} style={s(style)} className={className} />;
}
export function LinkedinIcon({ size = 11, style, className }: IconProps) {
  return <Briefcase size={size} style={s(style)} className={className} />;
}
export function GithubIcon({ size = 11, style, className }: IconProps) {
  return <Code2 size={size} style={s(style)} className={className} />;
}
export function PortfolioIcon({ size = 11, style, className }: IconProps) {
  return <Link size={size} style={s(style)} className={className} />;
}
