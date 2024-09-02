import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ReactNode } from "react";

export function GetStartedDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[calc(100vh-8rem)] grid-rows-[1fr_auto]">
        <DialogHeader>
          <DialogTitle className="">These Monsters Eat Carbon &gt;</DialogTitle>
          <DialogDescription>
            A little background on what's going on here
          </DialogDescription>
        </DialogHeader>
        <GetStartedContent />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GetStartedContent() {
  return (
    <div className="overflow-y-auto text-muted-foreground flex flex-col gap-2">
      <p>
        Welcome, monsters, to a planet called Earth! We humans have been running
        the show around here for a while and, as you're aware, we've lately
        taken to producing a whole lot of greenhouse gas emissions!
      </p>
      <p>
        Now, that's great news for you because these "emissions" are chock full
        of all your favorite molecular treats. We're talking methane; we're
        talking carbon dioxide; we're talking enough ozone to choke a horse!
        Haha, not that that's happened here on this planet!
      </p>
      <p>
        Of course, just having all those tasty chemical treats out there doesn't
        mean they're easy to find! So we've built this little app to help you
        hungry monsters find the best dining spots in your area!
      </p>
      <p>Here's how it works:</p>
      <ul className="list-disc">
        <li>
          - Use your GitHub account to get signed in (you guys have those,
          right?)
        </li>
        <li>- Add some zip codes to start tracking</li>
        <li>
          - Check in every day for updated readouts of the dining options in
          your area!
        </li>
      </ul>
      <p>Feel free to ask a human if you have any questions! Bon appetít!</p>
    </div>
  );
}
