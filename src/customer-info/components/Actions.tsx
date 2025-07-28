// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import AddCardIcon from "@mui/icons-material/AddCard";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ElementType, ReactElement } from "react";

import { useDisplay } from "../../context/useContext";
import { cn } from "../../prompts/scripts";
import { Display } from "../../types";

/** Displays action buttons for customer-related actions (transaction, edit, delete). */
interface ActionsProps {
  icon: ElementType;
  display: Display;
}
function Actions(): ReactElement {
  const { setDisplay } = useDisplay();

  const UserButton = ({ icon, display }: ActionsProps) => {
    const IconComponent = icon;
    return (
      <IconComponent
        className="cursor-pointer hover:brightness-50"
        onClick={() => setDisplay(display)}
        sx={{ color: "white", fontSize: "18px" }}
      />
    );
  };

  return (
    <div
      className={cn("flex h-2/3 flex-row items-center justify-center gap-2 rounded-2xl px-2",
        "bg-blue-950/50 shadow-md ring-1 shadow-black hover:bg-blue-950/75 hover:ring-black/90")}
    >
      <UserButton icon={AddCardIcon} display="transaction" />
      <UserButton icon={EditIcon} display="edit" />
      <UserButton icon={DeleteIcon} display="delete" />
    </div >
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default Actions;
