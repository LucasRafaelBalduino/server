"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
async function seed(knex) {
    await knex('items').insert([
        { title: 'Efeito (Cimento Queimado, mármore e etc)', image: 'cimento.jpg' },
        { title: 'Epóxi', image: 'epoxi.jpg' },
        { title: 'Impermeabilização de superfícies', image: 'impermeabilizante.jpg' },
        { title: 'Básica (parede interna e externa)', image: 'basico.jpg' },
        { title: 'Pisos (Estacionamento, quadra e etc)', image: 'pisos.jpg' },
        { title: 'Papel de parede', image: 'papel_parede.jpg' },
        { title: 'Instalação de Sanca e rodapé', image: 'sanca.jpg' },
        { title: 'Industrial', image: 'industrial.jpg' },
        { title: 'Pintura de Azulejo e Piscina', image: 'azulejo.jpg' },
        { title: 'Pintura com Compressor', image: 'pistola.jpg' },
    ]);
}
exports.seed = seed;
