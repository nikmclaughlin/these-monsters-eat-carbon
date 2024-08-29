import { GetStartedDialog } from "@/GetStarted/GetStartedDialog";
import { ReactNode } from "react";

export function Layout({
  menu,
  children,
}: {
  menu?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex min-h-20 border-b bg-background/80 backdrop-blur">
        <nav className="container w-full justify-between flex flex-row items-center gap-6">
          <div className="flex items-center gap-6 md:gap-10">
            <a href="/">
              <h1 className="text-base font-semibold">T M E C &gt;</h1>
            </a>
            <div className="flex items-center gap-4 text-sm">
              <GetStartedDialog>
                <button className="text-muted-foreground transition-colors hover:text-foreground">
                  Lore
                </button>
              </GetStartedDialog>
            </div>
          </div>
          {menu}
        </nav>
      </header>
      <main className="flex grow flex-col overflow-hidden">{children}</main>
      <footer className="border-t hidden sm:block">
        <div className="container py-4 text-sm leading-loose">
          Built with ❤️ and boops by{" "}
          <FooterLink href="https://nikmclaughlin.com/">Nik</FooterLink> for the
          LWJ{" "}
          <FooterLink href="https://lwj.dev/wdc-hackathon">
            Web Dev Challenge
          </FooterLink>{" "}
          with data from{" "}
          <FooterLink href="https://docs.airnowapi.org/">EPA AirNow</FooterLink>
          .
        </div>
      </footer>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="underline underline-offset-4 hover:no-underline"
      target="_blank"
    >
      {children}
    </a>
  );
}
