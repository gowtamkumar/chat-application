/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";

// import { getServerSession } from "next-auth";
// import { authOptions } from "../authOption";

export async function saveFile(data: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_DOCKER}/files`, {
    method: "POST",
    cache: "no-cache",
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function uploadFile(data: any) {
  const session: any = await auth();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/files/upload`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: data, // Assuming 'data' is a FormData object for file uploads
    }
  );

  return res.json();
}

export async function fileDeleteWithPhoto(data: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/files/delete-file-with-photo`,
    {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify(data),
    }
  );

  return res.json();
}

export async function deleteMultipleFilesWithPhoto(filenames: string[]) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/files/delete-files-with-photo`,
    {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify({ filenames }),
    }
  );

  return res.json();
}

export async function getFiles(data: any) {
  const { page = "1", limit = "30", search } = data || {};

  let queryString = "";

  if (search) {
    queryString += `search=${search}&`;
  }

  if (page && limit) {
    queryString += `page=${page}&limit=${limit}&`;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/files?${queryString}`,
    {
      cache: "no-cache",
    }
  );

  return res.json();
}

export async function updateFile(data: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/files/${data.id}`,
    {
      method: "PATCH",
      cache: "no-cache",
      body: JSON.stringify(data),
    }
  );

  return res.json();
}

export async function getFile(data: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/files/${data.id}`
  );

  return res.json();
}

export async function deleteFile(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DOCKER}/files/${id}`,
    {
      method: "DELETE",
      cache: "no-cache",
    }
  );

  return res.json();
}
