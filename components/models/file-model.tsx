"use client";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import FileUpload from "../fileUpload";
import { useModel } from "@/hooks/use-model-store";
import qs from "query-string";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Attachment is required" }),
});

export function MessageFileModel() {
  const router=useRouter()
  const { isOpen, data, onClose, type } = useModel();
  const isModelOpen = isOpen && type === "messageFile";
  const { apiUrl, query } = data;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isLoading = form.formState.isSubmitting;
  const onSumbit = async (values: z.infer<typeof formSchema>) => {
    const url = qs.stringifyUrl({
      url: apiUrl || "",
      query: query,
    });

    await axios.post(url, { ...values, content: values.imageUrl,fileUrl:values.imageUrl });
    form.reset();
    router.refresh();
    onClose()
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden  p-0 absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Add An Attachment
          </DialogTitle>
          <DialogDescription className="text-zinc-700 text-center">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSumbit)} className="space-y-8 ">
            <div className="space-y-8 px-6">
              <div className="flex justify-center items-center flex-col gap-4 ">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="ServerImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} type="submit" variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
