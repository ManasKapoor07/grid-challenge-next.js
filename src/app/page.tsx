"use client";

import React, { Suspense } from "react";
import Grid from "./grid/Grid"; 

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Grid />
    </Suspense>
  );
}