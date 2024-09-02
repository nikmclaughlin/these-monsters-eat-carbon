import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddLocationForm } from "./AddLocationForm";

export const UserDashboard = ({ userName }: { userName: string }) => {
  console.dir(userName);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>{`Welcome ${userName.split(" ")[0]}!`}</div>
      <div className="w-full border border-black rounded-lg p-4">
        <div className="flex justify-between">
          <div>Your Locations</div>
          <Dialog>
            <DialogTrigger>
              <button className="bg-slate-700 text-white text-sm p-2 rounded">
                + Add Location
              </button>
            </DialogTrigger>
            <DialogContent className="w-min">
              <DialogHeader>
                <DialogTitle>Track a new location</DialogTitle>
                <AddLocationForm />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-sm">...cards</div>
      </div>
    </div>
  );
};
