"use client";

import usePartySocket from "partysocket/react";

export default function PartyKitConnection({ room }: { room: string }) {
  usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    party: "main",
    room: room,
    onOpen() {
      console.log(`Connected to PartyKit room: ${room}`);
    },
  });

  return null;
}
