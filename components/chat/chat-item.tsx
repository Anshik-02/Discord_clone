"use client";

import { Edit, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import UserAvatar from "../user-avatar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useModel } from "@/hooks/use-model-store";
import { useParams, useRouter } from "next/navigation";

interface ChatItemProps {
  id: string;
  content: string;
  member: any;
  timestamp: string;
  imageUrl: string | null;
  deleted: boolean;
  currentMember: any;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
  memberImage: string;
  memberName: string;
  memberRole: string;
}

const roleIconMap = {
  Member: null,
  Moderator: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  Admin: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  message: z.string().min(1),
});

export const ChatItem = ({
  id,
  imageUrl,
  isUpdated,
  timestamp,
  member,
  content,
  currentMember,
  socketQuery,
  socketUrl,
  deleted,
  memberImage,
  memberName,
  memberRole,
}: ChatItemProps) => {
  const isAdmin = memberRole === "Admin";
  const isModerator = memberRole === "Moderator";
  const canDeleteMessage = !deleted && (isAdmin || isModerator);
  const canEditMessage = !deleted && !imageUrl && (isAdmin || isModerator);
  const isImage = !!imageUrl;
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModel();
  const router = useRouter();
  const params = useParams();

  const onMemberClick = () => {
    if (member._id === currentMember) return;
    router.push(`/servers/${params?.serverId}/conversations/${member._id}`);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: content,
    },
  });

  useEffect(() => {
    form.reset({
      message: content,
    });
  }, [content]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const handelKeyDown = (e: any) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handelKeyDown);

    return () => window.addEventListener("keydown", handelKeyDown);
  }, []);

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={memberImage} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div onClick={onMemberClick} className="flex items-center">
              <p className="cursor-pointer font-semibold text-sm hover:underline ">{memberName}</p>
              <ActionTooltip label={memberRole}>
               
                <p>{roleIconMap[memberRole]}</p>
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
          </div>
          {isImage && (
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square mt-3 rounded-md overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image src={imageUrl} alt={content} fill className="object-cover" />
            </a>
          )}
          {!imageUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted && "italic text-xs text-zinc-500 dark:text-zinc-400 mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
              )}
            </p>
          )}
          {!imageUrl && isEditing && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex !items-center w-full gap-x-2 pt-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited Message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size={"sm"} variant={"primary"}>
                  Save
                </Button>
              </form>
              <span className="text-[10px] text-zinc-400">Press Esc to cancel, enter to save</span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:!flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="h-4 w-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="h-4 w-4 cursor-pointer ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
