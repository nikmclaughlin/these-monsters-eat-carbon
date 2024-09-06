import clsx from "clsx";

export const DashTab = (props: {
  title: string;
  selected: boolean;
  onClick: () => void;
}) => {
  const { title, selected, onClick } = props;
  return (
    <div
      className={clsx(
        "font-display tracking-wider border-foreground",
        selected ? " border-b-2" : "hover:border-b",
      )}
      onClick={onClick}
    >
      {title}
    </div>
  );
};
