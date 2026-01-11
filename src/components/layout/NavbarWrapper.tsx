"use client";

import Navbar from "./Navbar";
import { useState } from "react";

export default function NavbarWrapper() {
  const [cartCount] = useState(0);

  const handleTenantChange = (tenantId: string) => {
    // Handle tenant change if needed
    console.log("Tenant changed:", tenantId);
  };

  return <Navbar cartCount={cartCount} onTenantChange={handleTenantChange} />;
}
