/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { auth } from "@/auth";

 export const fetchData = async () => {
  const session: any = await auth()
  console.log("session.data?.user?.accessToken", session.data?.user?.accessToken);
  
    const getData = await fetch("http://server:3900/api/v1/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.data?.user?.accessToken}`,
      },
    });
    const newusers = await getData.json();
    return newusers
  };