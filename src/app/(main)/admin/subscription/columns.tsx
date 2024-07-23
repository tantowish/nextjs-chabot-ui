'use client'

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react";
import moment from 'moment';
import Link from "next/link";
import { FaEye } from "react-icons/fa6";

export type subscriptionColumn = {
    id: number,
    name: string,
    email: string,
    package_name: string | null,
    end_date: Date | null
}

export const columns: ColumnDef<subscriptionColumn>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              className="bg-transparent hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        }
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              className="bg-transparent hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        }
      },
      {
        accessorKey: "package_name",
        header: ({ column }) => {
          return (
            <Button
              className="bg-transparent hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Package Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({row}) => {
          if(row.getValue('package_name') === null){
            return "-"
          }
          return row.getValue('package_name')
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
          const user = row.original
          return (
            <Link href={`/admin/subscription/${user.id}`}>
              <Button className="bg-slate-800 shadow-lg"><FaEye/></Button>
            </Link>
          )
        }
      }
]