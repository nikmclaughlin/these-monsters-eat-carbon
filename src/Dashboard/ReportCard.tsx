import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DataModel } from "../../convex/_generated/dataModel";

const monsterTranslator: Record<string, string> = {
  Good: "Out of stock",
  Moderate: "Limited supply",
  "Unhealthy for Sensitive Groups": "In stock",
  Unhealthy: "Plentiful",
  "Very Unhealthy": "Feast Mode",
  Hazardous: "Poppin' off",
};

export const ReportCard = (props: {
  reportingArea: DataModel["reportingAreas"]["document"];
  closable?: boolean;
}) => {
  const { reportingArea, closable = true } = props;

  const removeZip = useMutation(api.users.removeTrackedZip);
  const getReports = useQuery(api.reports.getReportsByReportingAreaName, {
    name: reportingArea.name,
  });
  const reports = getReports;
  const today = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

  return (
    <div className="w-full h-32 flex flex-col bg-muted px-4 py-2 rounded-xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col font-display tracking-widest">
          <div className="text-xl">{reportingArea.name}</div>
          <div className="text-sm">{reportingArea.zipCode}</div>
        </div>
        {closable && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="bg-secondary-foreground text-secondary text-sm p-2 rounded">
                X
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className="flex flex-col gap-2 p-4">
                <h2>Remove this location?</h2>
                <button
                  className="bg-destructive hover:opacity-85 text-white w-full text-sm font-bold p-2 rounded"
                  onClick={() => void removeZip({ zip: reportingArea.zipCode })}
                >
                  Remove
                </button>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        )}
      </div>
      <div className="h-20 p-2 flex flex-col gap-1 flex-wrap text-sm items-start font-mono">
        {reports
          ?.filter((report) => report.validDate === today)
          .slice(0, 4)
          .map((report, idx) => {
            return (
              <div className="" key={idx}>
                {report.parameterName}: {report.aqiValue} -{" "}
                {monsterTranslator[report.aqiCategory]}
              </div>
            );
          })}
      </div>
    </div>
  );
};
