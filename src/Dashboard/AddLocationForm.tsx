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
        <div
          className="box-border w-full bg-secondary-foreground text-secondary inline-flex h-[35px] items-center justify-center rounded px-3 font-bold leading-none"
          onClick={() => {
            void addZip({ zip: value });
            setValue("");
          }}
        >
          Add Location
        </div>
      </DialogClose>
    </div>
  );
};
