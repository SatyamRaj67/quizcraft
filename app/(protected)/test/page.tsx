"use client";

import { useSidebar } from "@/components/ui/sidebar";
import React, { useEffect } from "react";

const TestingPage = () => {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  return <div>TestingPage</div>;
};

export default TestingPage;
