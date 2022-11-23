"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
class PointsController {
    async index(request, response) {
        const { city, uf, items } = request.query;
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        const points = await (0, connection_1.default)('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
        const serializedPoints = points.map(point => {
            return Object.assign(Object.assign({}, point), { image_url: `http://192.168.56.1:3333/uploads/${point.image}` });
        });
        return response.json(serializedPoints);
    }
    async home(request, response) {
        const pintores = await (0, connection_1.default)('points').select('*');
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
    async delete(request, response) {
        const { id } = request.params;
        const point = await (0, connection_1.default)('points').where('id', id).first();
        await (0, connection_1.default)('points').where('id', id).delete();
        return response.status(204).send();
    }
    async validar(request, response) {
        const { id } = request.params;
        const { ativo } = request.body;
        await (0, connection_1.default)('points').update({ ativo }).where('id', id);
        return response.status(204).send();
    }
    async show(request, response) {
        const { id } = request.params;
        const point = await (0, connection_1.default)('points').where('id', id).first();
        if (!point) {
            return response.status(400).json({ message: 'Pintores nao encontrados.' });
        }
        const serializedPoint = Object.assign(Object.assign({}, point), { image_url: `http://192.168.56.1:3333/uploads/${point.image}` });
        const items = await (0, connection_1.default)('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');
        return response.json({ point: serializedPoint, items });
    }
    async create(request, response) {
        var _a;
        const { email, name, resumo, cpf, whatsapp, city, bairro, uf, link_facebook, link_instagram, items, ativo } = request.body;
        const trx = await connection_1.default.transaction();
        const point = {
            image: (_a = request.file) === null || _a === void 0 ? void 0 : _a.filename,
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
            .map((item) => Number(item.trim()))
            .map((item_id) => {
            return {
                item_id,
                point_id,
            };
        });
        await trx('point_items').insert(pointItems);
        await trx.commit();
        return response.json(Object.assign({ id: point_id }, point));
    }
}
exports.default = PointsController;
