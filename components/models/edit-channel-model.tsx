"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useModel } from "@/hooks/use-model-store";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
export const ChannelTypes = ["Voice", "Text", "Video"] as const;
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Channel name is required" })
    .refine((name) => name !== "general", {
      message: "Channel can't be named 'general'",
    }),
  type: z.enum(ChannelTypes),
});

type FormData = {
  name: string;
  type: "Voice" | "Text" | "Video";
};

export function EditChannelModel() {
  const { isOpen, onClose, type,data } = useModel();
  const isModalOpen = isOpen && type === "editChannel";
  const params=useParams()

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "Text",
    },
  });


  const router = useRouter();
  const isLoading = form.formState.isSubmitting;
const {channelId,channelName,channelType}=data
  const onSubmit = async (values: z.infer<typeof formSchema>) => {


const url=qs.stringifyUrl({
  url:`/api/channels/${channelId}`,
  query:{
    serverId:params.serverId
  }
})
  await axios.patch(url, values);
  onClose()
  router.refresh();
  };
useEffect(()=>{
if(channelId){
  form.setValue("name",channelName)
  form.setValue("type",channelType)
}
})
  const handleClose = () => {
    form.reset();
    router.refresh();
    onClose();
  };

  if (!isMounted) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-0 fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 z-[100]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Edit Channel
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold dark:text-secondary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="focus-visible:ring-0 border-0 text-black focus-visible:ring-offset-0 !bg-zinc-300/50"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold dark:text-secondary/70 ">
                      Channel Type
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className=" w-full !bg-zinc-300/50 text-black border-0 focus:ring-0 focus:ring-offset-0 outline-none">
                          <SelectValue
                            placeholder="Select a channel type"
                            className="text-black"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[110]">
                        {ChannelTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} type="submit" variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
