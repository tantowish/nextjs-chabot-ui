
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/date-picker";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePackage } from "@/hooks/use-package";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Props = {
    userId: number,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export default function SubscriptionForm({ userId, setIsOpen }: Props) {
    const { data: pkg } = usePackage();
    const { createSubscription } = useSubscription()
    const [selectedPackage, setSelectedPackage] = useState("");
    const [date, setDate] = useState<DateRange | undefined>()
    const [dateError, setDateError] = useState(false);
    const router = useRouter()
  
    const handlePackageChange = (value: string) => {
      setSelectedPackage(value);
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const formData = new FormData(e.target as HTMLFormElement);
            const packageName = formData.get('packageName');
            const price = formData.get('price');
            const parsedPrice = price ? parseInt(price.toString(), 10) : undefined;
    
            if (selectedPackage === "Custom"){
                if ((!date || !date.from || !date.to) && selectedPackage === "Custom") {
                    setDateError(true);
                    return;
                }
                setDateError(false);
                const paket = pkg?.find(pkg => pkg.name === packageName);
                const data = {
                    user_id: userId,
                    package_id: paket?.id!,
                    price: parsedPrice!,
                    start_date: date?.from!,
                    end_date: date?.to!
                }
    
                await createSubscription(data)

                router.refresh()
                toast({
                    title: "Success",
                    description: "Sukses membuat subscription baru",
                })
                setIsOpen(false)
            } else {
                const paket = pkg?.find(pkg => pkg.name === packageName);
                const start = new Date()
                const end = new Date()
                end.setMonth(end.getMonth() + paket?.month!)
                const data = {
                    user_id: userId,
                    package_id: paket?.id!,
                    price: paket?.price!,
                    start_date: start,
                    end_date: end
                }
    
                await createSubscription(data)

                router.refresh()
                toast({
                    title: "Success",
                    description: "Sukses membuat subscription baru",
                })
                setIsOpen(false)
            }
        } catch(e){
            toast({
                title: "Failed",
                description: "Gagal membuat subscription baru",
            })
        }
        
    };
  return (
    <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="packageId" className="text-right">
                    Paket
                </Label>
                <Select required name="packageName" onValueChange={handlePackageChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select paket" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Pilih Paket</SelectLabel>
                    {pkg?.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                        {item.name}
                        </SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
                </Select>
            </div>
            {selectedPackage === "Custom" && (
                <>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                        Price
                        </Label>
                        <Input
                            type="number"
                            id="price"
                            name="price"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customValue" className="text-right">
                            Start
                        </Label>
                        <DatePickerWithRange date={date} setDate={setDate} error={dateError} />
                    </div>
                </>
            )}
            </div>
        <div className="flex flex-wrap justify-end w-full">
            <Button type="submit">Tambah</Button>
        </div>
    </form>
  )
}
