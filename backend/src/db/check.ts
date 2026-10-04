import db from "./database";

const events = db
  .prepare("SELECT * FROM events")
  .all();

console.log(events);