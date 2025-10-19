/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { auth } from "@/auth";

export const getMessages = async ({
  currentUserId,
  useParams,
}: {
  currentUserId: string;
  useParams: string;
}) => {
  const session: any = await auth();
  const getData = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/messagess?senderId=${currentUserId}&receiverId=${useParams}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
    }
  );
  const message = await getData.json();
  return message;
};
