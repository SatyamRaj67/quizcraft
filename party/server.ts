import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    console.log("New connection established:", connection.id);
    connection.send("Welcome to the party!");
  }
}
