import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StoryGift — A Father's Words, A Child's World",
  description: "Gift your child a personalized story crafted just for them. Encourage reading through the magic of stories made with love.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
