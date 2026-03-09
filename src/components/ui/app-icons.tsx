import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M3 11.5L12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10.5V20h13V10.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v-5h4v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProductsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M3.5 8.5L12 4l8.5 4.5L12 13 3.5 8.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 8.5V16L12 20l8.5-4V8.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13v7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PaymentIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 15h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShippingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M3 7h11v9H3V7Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 10h3l4 3v3h-7v-6Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="17.5" r="1.5" />
      <circle cx="18" cy="17.5" r="1.5" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <circle cx="12" cy="7.5" r="3.2" />
      <path d="M5 19.2c1.6-3.1 4.1-4.7 7-4.7s5.4 1.6 7 4.7" strokeLinecap="round" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path
        d="M20 12a8 8 0 1 1-14 5.2L4 20l3-1.8A8 8 0 0 1 20 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 9.4c0 2 3.2 5.2 5.2 5.2l1-1.1c.2-.3.6-.4.9-.2l1.6.8c.3.2.5.6.3.9l-.4 1.3c-.1.4-.5.7-.9.7C12.9 16.9 7 11.1 7 6.9c0-.4.3-.8.7-.9L9 5.6c.3-.1.7 0 .9.3l.8 1.6c.2.3.1.7-.2.9l-1.1 1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShopeeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M7 8h10l-1 11H8L7 8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8V6.7a3 3 0 0 1 6 0V8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M14.3 11.2c-.4-.3-1-.5-1.5-.5-.9 0-1.6.4-1.6 1.1 0 1.8 3.2.8 3.2 2.8 0 1-.8 1.6-2 1.6-.9 0-1.6-.3-2.1-.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ForumIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M5 6h10a3 3 0 0 1 3 3v5H9l-4 3v-3h0a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 18h5l3 2.2V18h0a3 3 0 0 0 3-3v-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BankIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M3 9l9-5 9 5H3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v8M9 10v8M15 10v8M19 10v8" strokeLinecap="round" />
      <path d="M3 19h18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18a2 2 0 0 1 2 2v2H4v-1.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 10h16v8a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5V10Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 14h5v3h-5a1.5 1.5 0 0 1 0-3Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
