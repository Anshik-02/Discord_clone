"use client";

import { useChatQuery } from "@/hooks/use-chat-query";
import ChatWelcome from "./chat-welcome";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useEffect, useRef } from "react";
import { ChatItem } from "./chat-item";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";

const DATE_FORMAT = "d MMM yyy, HH:mm";

interface ChatMessagesProps {
  name: string;
  member: any;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramValue: string;
  paramKey: "channelId" | "conversationId";
  type: "channel" | "conversation";
  memberImage: string;
  memberName: string;
  memberRole: string;
}

export default function ChatMessages({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  type,
  paramValue,
  memberImage,
  memberName,
  memberRole,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:message:update`;
  useChatSocket({ addKey, queryKey, updateKey });
  const bottomRef = useRef<ElementRef<"div">>(null);

  //@ts-ignore
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =  
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  //@ts-ignore
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  if (status === "pending") {
    return (
      <div className="flex flex-col  flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 my-4 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 my-4 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col  py-1 overflow-y-auto">
      {!hasNextPage && <div className="!flex-1 flex" />}
      <div className="my-10">
        {!hasNextPage && <ChatWelcome name={name} type={type} />}
        {hasNextPage && (
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <Loader2 className="h-6 w-6 text-zinc-500 animate-spin  " />
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className=" relative top-4  text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs  my-6 dark:hover:text-zinc-300 transition"
              >
                {" "}
                Load previous messages
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto" >
          <div className="flex flex-col-reverse mt-auto">
            {data?.pages.map((group, i) => (
              <Fragment key={i}>
                {group.items.map((message: any) => {
                  return (
                    <ChatItem
                      key={message._id}
                      currentMember={member}
                      id={message._id}
                      content={message.message}
                      deleted={message.deleted}
                      imageUrl={message.imageUrl}
                      timestamp={format(
                        new Date(message.createdAt),
                        DATE_FORMAT
                      )}
                      isUpdated={message.updatedAt !== message.createdAt}
                      socketUrl={socketUrl}
                      socketQuery={socketQuery}
                      member={message.userId}
                      memberImage={message.userId.imageUrl}
                      memberName={message.userId.username}
                      memberRole={message.memberRole}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
