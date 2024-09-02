import { DialogClose } from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

export const AddLocationForm = () => {
  const addZip = useMutation(api.users.addTrackedZip);
  const [value, setValue] = useState("");
  return (
    <div className="w-[260px] flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-sm font-medium" htmlFor="zipcode">
          Location Zipcode
        </label>
      </div>
      <input
        type="text"
        name="zipcode"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <DialogClose>
        <button
          className="box-border w-full bg-slate-700 text-slate-200 hover:bg-slate-600 inline-flex h-[35px] items-center justify-center rounded px-3 font-medium leading-none"
          type="submit"
          onClick={() => void addZip({ zip: value })}
        >
          Add Location
        </button>
      </DialogClose>
    </div>
  );
};
