/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { auth } from "@/auth";

export const getUsers = async () => {
  const session: any = await auth();
  const getData = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/users`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
    }
  );
  const newusers = await getData.json();
  return newusers;
};

export const getUser = async (id: string | number) => {
  const session: any = await auth();
  const getData = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/users/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
    }
  );
  const newusers = await getData.json();
  return newusers;
};

export const userUpdate = async (userData: any) => {
  const session: any = await auth();
  const id = session.user.user.id;
  const getData = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/users/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user?.accessToken}`,
      },
    }
  );
  const newusers = await getData.json();
  return newusers;
};
