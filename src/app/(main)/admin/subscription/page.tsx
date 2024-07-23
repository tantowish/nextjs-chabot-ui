import { DataTable } from "@/components/table/data-table";
import { columns, subscriptionColumn } from "./columns";
import { prismaClient } from "@/lib/prisma";

export default async function Subscription() {
  try{
    const subscriptions = await prismaClient.user.findMany({
      where: {
        role: "user",
      },
      include: {
        Subscription: {
          orderBy: {
            end_date: 'desc', // Order Subscription itself by end_date in descending order to get the latest
          },
          take: 1,
          include: {
            package: true,
          },
        },
      },
    });
    
    console.log(subscriptions)
    
    const mappedData: subscriptionColumn[] = subscriptions.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      package_name: user.Subscription?.[0]?.package.name || null,
      end_date: user.Subscription?.[0]?.end_date || null,
    }));

    return (
        <div className="mx-auto p-4 pt-12 sm:p-12 text-zinc-200">
            <h1 className="text-xl md:text-2xl font-bold mb-5 max-w-[300px] mx-auto sm:max-w-md md:mx-0 md:max-w-sm ">Data User Subscription</h1>
            <DataTable columns={columns} data={mappedData} filter={"email"}/>
        </div>
    );
  } catch(e){
    return <div className="p-16 text-zinc-200">Tidak ada data</div>
  }
}