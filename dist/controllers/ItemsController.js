"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
class ItemsController {
    async index(request, response) {
        const items = await (0, connection_1.default)('items').select('*');
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.1.12:3333/uploads/${item.image}`,
            };
        });
        return response.json(serializedItems);
    }
}
exports.default = ItemsController;
