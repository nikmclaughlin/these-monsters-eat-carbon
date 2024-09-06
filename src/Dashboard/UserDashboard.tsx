import { DashTab } from "@/components/DashTab";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { DataModel } from "../../convex/_generated/dataModel";
import { AddLocationForm } from "./AddLocationForm";
import { ReportCard } from "./ReportCard";

type UserDashboardProps = {
  user: DataModel["users"]["document"];
};

export const UserDashboard = (props: UserDashboardProps) => {
  const { user } = props;

  const trackedAreas = useQuery(
    api.reportingAreas.getUserReportingAreas,
    user && user.trackedZips ? { zips: user.trackedZips } : "skip",
  );

  const featuredReports = useQuery(api.reports.getFeaturedReports, {
    count: 3,
  });
  const featuredNames = featuredReports?.map((report) => report.reportingArea);
  const featuredAreas = useQuery(
    api.reportingAreas.getFeaturedReportingAreas,
    featuredNames ? { areas: featuredNames } : "skip",
  );

  const [currentTab, setCurrentTab] = useState("user");

  return (
    <div className="w-full flex flex-col items-center gap-4 p-4">
      <div className="font-display text-4xl tracking-wider">
        {user ? `Welcome ${user.name?.split(" ")[0]}!` : "Hi there!"}
      </div>
      <div className="w-full max-w-4xl p-4 flex flex-col">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <DashTab
              title="Your Locations"
              selected={currentTab === "user"}
              onClick={() => setCurrentTab("user")}
            />
            <DashTab
              title="Featured"
              selected={currentTab === "featured"}
              onClick={() => setCurrentTab("featured")}
            />
          </div>
          <Dialog>
            <DialogTrigger>
              <div className="bg-secondary-foreground text-secondary text-sm p-2 rounded font-display tracking-wider">
                + Add Location
              </div>
            </DialogTrigger>
            <DialogContent className="w-min">
              <DialogHeader>
                <DialogTitle className="font-display tracking-wider">
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
        {currentTab === "user" && (
          <div className="w-full flex flex-col items-center ">
            <div className="w-full max-w-3xl flex flex-col items-center gap-4 p-4">
              {trackedAreas?.map((area, idx) =>
                area ? <ReportCard reportingArea={area} key={idx} /> : null,
              )}
            </div>
          </div>
        )}
        {currentTab === "featured" && (
          <div className="w-full flex flex-col items-center ">
            <div className="w-full max-w-3xl flex flex-col items-center gap-4 p-4">
              {featuredAreas?.map((area, idx) =>
                area ? (
                  <ReportCard reportingArea={area} closable={false} key={idx} />
                ) : null,
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
