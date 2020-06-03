import express from "express";
import knex from "./database/connection";

const routes = express.Router();

routes.get("/items", async (request, response) => {
  const items = await knex("items").select("*");
  const serializedItems = items.map((item) => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`,
    };
  });
  return response.json(serializedItems);
});

routes.post("/points", async (request, response) => {
  const trx = await knex.transaction();

  const image = "fake";
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items,
  } = request.body;
  const insertedIds = await trx("points").insert({
    name,
    image,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
  });

  const pointItems = items.map((itemId: number) => {
    return {
      point_id: insertedIds[0],
      item_id: itemId,
    };
  });
  await trx("points_items").insert(pointItems);

  return response.json({ success: true });
});

export default routes;
