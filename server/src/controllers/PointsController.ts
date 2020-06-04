import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async create(request: Request, response: Response) {
    const trx = await knex.transaction();

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

    const point = {
      name,
      image: "https://images.unsplash.com/photo-1548462859-6aa33b1691ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    const insertedIds = await trx("points").insert(point);

    const pointItems = items.map((itemId: number) => {
      return {
        point_id: insertedIds[0],
        item_id: itemId,
      };
    });
    await trx("points_items").insert(pointItems);
    await trx.commit();

    return response.json({
      id: insertedIds[0],
      ...point,
    });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await knex("points").where("id", id).first();
    if (!point) {
      return response.status(400).json({ message: "Point not found." });
    }
    const items = await knex("items")
      .join("points_items", "items.id", "=", "points_items.item_id")
      .where("points_items.point_id", id)
      .select("items.title");
    return response.json({ point, items });
  }

  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;
    const parsedItemsIds = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("points_items", "points.id", "=", "points_items.point_id")
      .whereIn("points_items.item_id", parsedItemsIds)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");
    return response.json(points);
  }
}

export default PointsController;
