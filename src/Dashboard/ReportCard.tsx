import { DialogDescription, DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DataModel } from "../../convex/_generated/dataModel";

export const ReportCard = (props: {
  reportingArea: DataModel["reportingAreas"]["document"];
}) => {
  const { reportingArea } = props;

  const removeZip = useMutation(api.users.removeTrackedZip);
  const getReports = useQuery(api.reports.getReportsByReportingAreaName, {
    name: reportingArea.name,
  });
  const reports = getReports;

  return (
    <div className="w-full h-32 flex flex-col bg-slate-500 px-4 py-2 rounded-xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="text-xl">{reportingArea.name}</div>
          <div className="text-sm">{reportingArea.zipCode}</div>
        </div>
        <Dialog>
          <DialogTrigger>
            <div className="bg-slate-700 text-white text-sm p-2 rounded">X</div>
          </DialogTrigger>
          <DialogContent className="absolute bg-slate-100 p-4 text-slate-800 rounded-lg right-16">
            <DialogHeader>
              <DialogTitle>Remove this location?</DialogTitle>
              <DialogDescription></DialogDescription>
              <DialogClose>
                <div
                  className="bg-red-700 text-white text-sm p-2 rounded"
                  onClick={() => void removeZip({ zip: reportingArea.zipCode })}
                >
                  Remove
                </div>
              </DialogClose>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="h-20 p-4 flex flex-col flex-wrap text-sm items-start">
        {reports?.map((report, idx) => {
          return (
            <div className="" key={idx}>
              {report.parameterName}: {report.aqiValue} - {report.aqiCategory}
            </div>
          );
        })}
      </div>
    </div>
  );
};
