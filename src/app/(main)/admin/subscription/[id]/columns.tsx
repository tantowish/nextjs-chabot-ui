'use client'

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { deleteSubs } from "@/data/subscription";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react";
import moment from 'moment';
import { redirect, useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";

export type subscriptionDetailColumn = {
    id: number,
    package: string,
    price: number,
    start_date: Date | null
    end_date: Date | null
}

export const columns: ColumnDef<subscriptionDetailColumn>[] = [
      {
        accessorKey: "package",
        header: ({ column }) => {
          return (
            <Button
              className="bg-transparent hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Package
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        }
      },
      {
        accessorKey: "price",
        header: ({ column }) => {
          return (
            <Button
              className="bg-transparent hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Price
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        }
      },
      {
        accessorKey: "start_date",
        header: ({ column }) => {
          return (
            <Button
              className="bg-transparent hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Start Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({row}) => {
          if(row.getValue('start_date') === null){
            return "-"
          }
          const date = moment(row.getValue('start_date'));
          const formattedDate = date.format('dddd, DD MM YYYY');
          return formattedDate
        }
      },
      {
        accessorKey: "end_date",
        header: ({ column }) => {
          return (
            <Button
              className="bg-transparent hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              End Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({row}) => {
          if(row.getValue('end_date') === null){
            return "-"
          }
          const date = moment(row.getValue('end_date'));
          const formattedDate = date.format('dddd, DD MM YYYY');
          return formattedDate
        }
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({row}) => {
          const id = row.original.id

          return <DeleteButton id={id} />;
        }
      },
]

const DeleteButton = ({ id }: { id: number }) => {
  const router = useRouter();

  const onClick = async () => {
      try {
          await deleteSubs(id);
          router.refresh();
          toast({
              title: "Success",
              description: "Sukses menghapus subscription",
          });
      } catch (e) {
          router.refresh();
          toast({
              title: "Failed",
              description: "Gagal menghapus subscription",
          });
      }
  };

  return (
      <Button onClick={onClick} className="bg-red-900 hover:bg-red-950 p-2">
          <MdDelete className="text-xl" />
      </Button>
  );
};