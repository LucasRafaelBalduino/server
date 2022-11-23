import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://192.168.56.1:3333/uploads/${point.image}`,
      };
    });
    
    return response.json(serializedPoints);
  }

  async home(request: Request, response: Response) {
    const pintores = await knex('points').select('*'); 
  
    const serializedPintores = pintores.map(pintor => { 
      return {
        id: pintor.id,
        name: pintor.name,
        image: pintor.image,
        city: pintor.city,
        image_url: `http://192.168.56.1:3333/uploads/${pintor.image}`,

        ativo: pintor.ativo
      };
    });
  
    return response.json(serializedPintores);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    await knex('points').where('id', id).delete();

    return response.status(204).send();
  }

  async validar(request: Request, response: Response){
    const { id } = request.params;

    const { ativo } = request.body


    await knex('points').update({ativo}).where('id', id);

    return response.status(204).send();
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Pintores nao encontrados.' });
    }

    const serializedPoint = { 
      ...point,
      image_url: `http://192.168.56.1:3333/uploads/${point.image}`,
    };

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point: serializedPoint, items });
  }

  async create(request: Request, response: Response) {
    const {
      email,
      name,
      resumo,
      cpf,
      whatsapp,
      city,
      bairro,
      uf,
      link_facebook,
      link_instagram,
      items,
      ativo
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file?.filename,
      email,
      name,
      resumo,
      cpf,
      whatsapp,
      city,
      bairro,
      uf,
      link_facebook,
      link_instagram,
      ativo
    };
  
    const insertedIds = await trx('points').insert(point);
  
    const point_id = insertedIds[0];
  
    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      })
  
    await trx('point_items').insert(pointItems);

    await trx.commit();
  
    return response.json({ 
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;