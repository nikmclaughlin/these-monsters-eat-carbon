import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DataModel } from "../../convex/_generated/dataModel";
import { AddLocationForm } from "./AddLocationForm";
import { ReportCard } from "./ReportCard";

type UserDashboardProps = {
  user: DataModel["users"]["document"];
};

const monsterMoji = [
  "👽",
  "👾",
  "🧟",
  "🤡",
  "🐲",
  "🧛",
  "🧚",
  "🧞",
  "👻",
  "🐸",
  "👿",
  "👺",
  "👹",
  "🤖",
  "🧜‍♀️",
  "🦑",
  "🦖",
  "🧌",
  "🦄",
];

export const UserDashboard = (props: UserDashboardProps) => {
  const { user } = props;
  const getUserReportingAreas = useQuery(
    api.reportingAreas.getUserReportingAreas,
    user && user.trackedZips ? { zips: user.trackedZips } : "skip",
  );
  const trackedAreas = getUserReportingAreas;
  const monster = Math.round(Math.random() * monsterMoji.length);

  return (
    <div className="w-full flex flex-col items-center gap-4 p-4">
      <div className="font-display text-4xl tracking-wide">
        {user ? `Welcome ${user.name?.split(" ")[0]}!` : "Hi there!"}
        <span> {monsterMoji[monster]}</span>
      </div>
      <div className="w-full max-w-4xl p-4 flex flex-col">
        <div className="flex justify-between">
          <div className="font-display tracking-wider">Your Locations</div>
          <Dialog>
            <DialogTrigger>
              <div className="bg-slate-700 text-white text-sm p-2 rounded font-display tracking-wide">
                + Add Location
              </div>
            </DialogTrigger>
            <DialogContent className="w-min">
              <DialogHeader>
                <DialogTitle className="font-display tracking-wide">
                  Track a new location
                </DialogTitle>
                <DialogDescription>
                  Enter a zipcode to receive updates for that location
                </DialogDescription>
              </DialogHeader>
              <AddLocationForm />
            </DialogContent>
          </Dialog>
        </div>
        <div className="w-full flex flex-col items-center ">
          <div className="w-full max-w-3xl flex flex-col items-center gap-4 p-4">
            {trackedAreas?.map((area, idx) =>
              area ? <ReportCard reportingArea={area} key={idx} /> : null,
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
