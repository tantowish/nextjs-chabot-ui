import { prismaClient } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BackButton from "@/components/back-button";
import { columns, subscriptionDetailColumn } from "./columns";
import { DataTable } from "@/components/table/data-table";
import { AddSubscription } from "./_components/add-subscription";

type Props = {
    params: {
      id: string;
  };
}

export default async function page({ params }: Props) {
    try{
        const userId = parseInt(params.id, 10);
    
        if (isNaN(userId)) {
            notFound();
        }
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            include: {
              Subscription: {
                orderBy: {
                    end_date: 'desc'
                },
                include: {
                  package: true
                }
              }
            }
          })


          if(!user){
            notFound()
          }

          const mappedData: subscriptionDetailColumn[] = user?.Subscription.map(item => ({
            id: item.id,
            package: item.package.name,
            price: item.price,
            start_date: item.start_date,
            end_date: item.end_date
          }));
        return (
            <div className="text-zinc-200 p-4 pt-12 md:p-12">
                <div>
                    <div className="mb-6">
                        <BackButton href={"/admin/subscription"} />
                    </div>
                    <div className="mb-4">
                        <h1 className="text-2xl mb-2">Subscription detail <strong className="font-bold">{user?.name}</strong></h1>
                        <p>Name : {user?.name}</p>
                        <p>Email : {user?.email}</p>
                        <p>Institution : {user?.institution ?? "-"}</p>
                    </div>
                    <div className="w-full mb-2 flex flex-wrap justify-end mx-auto max-w-[300px] sm:max-w-md md:max-w-none md:mx-0">
                        <AddSubscription userId={userId}/>
                    </div>
                    <DataTable columns={columns} data={mappedData} filter={null} />
                </div>
            </div>
        )
    } catch (e){
        return notFound()
    }
}
