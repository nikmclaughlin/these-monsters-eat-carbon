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
}) => {
  const { reportingArea } = props;

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
    <div className="w-full h-32 flex flex-col bg-slate-500 px-4 py-2 rounded-xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col font-display tracking-widest">
          <div className="text-xl">{reportingArea.name}</div>
          <div className="text-sm">{reportingArea.zipCode}</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="bg-slate-700 hover:bg-slate-600 text-white text-sm p-2 rounded">
              X
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="flex flex-col gap-2 p-4">
              <h2>Remove this location?</h2>
              <button
                className="bg-red-700 hover:bg-red-600 text-white w-full text-sm font-bold p-2 rounded"
                onClick={() => void removeZip({ zip: reportingArea.zipCode })}
              >
                Remove
              </button>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
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
