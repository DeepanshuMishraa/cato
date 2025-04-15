import { MoreVertical, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { deleteSite, getSites } from "@/actions/monitor.actions";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const DeleteSite = ({ siteId, query }: { siteId: string, query: any }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <MoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-red-600 cursor-pointer flex items-center gap-2"
          onClick={async () => {
            try {
              const response = await deleteSite(siteId);
              if (response.success) {
                toast.success("Site deleted successfully");
                query.refetch();
              } else {
                toast.error(response.message);
              }
            } catch (error) {
              toast.error("Failed to delete site");
            }
          }}
        >
          <Trash className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

export default DeleteSite
