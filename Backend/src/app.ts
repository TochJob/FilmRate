import fastify from "fastify";

export function buildApp(){
    const app = fastify({logger:true});

    app.get('/helth', async (request, reply) => {
        return {status: 'ok'};
    })

    return app;
}