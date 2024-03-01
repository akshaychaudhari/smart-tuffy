// ../src/api/post/route.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import ScheduleModel from "../../models/Schedule";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("hit get post", new Date().getSeconds());
  try {
    await dbConnect();
    const post = await ScheduleModel.create({ name: "post double render" });
    return new NextResponse("Posted");
  } catch (error) {
    console.log("error from route", error);
    return new NextResponse("Error");
  }
}
