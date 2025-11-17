"use client";

import dynamic from "next/dynamic";

const Pricing = dynamic(() => import("./pricing"), {
  ssr: false,
});

export default Pricing;

