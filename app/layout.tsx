import type { Metadata } from "next";
import "./globals.css";
import Provider from "./providers";

export const metadata: Metadata = {
  title: "Vitae AI",
  description:
    "Experience cutting-edge healthcare with our AI-powered health assistant. Our platform uses advanced AI vision to detect health issues from images, enabling real-time health insights. Effortlessly scan prescriptions and medical reports for organized, accessible healthcare management. Discover personalized support designed to simplify and enhance your wellness journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-[#202123] text-[#E9E9E9]`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
