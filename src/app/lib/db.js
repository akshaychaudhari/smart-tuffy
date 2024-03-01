const mongoose = require('mongoose');

global.mongoose = {
    conn: null,
    promise: null,
};

export async function dbConnect() {
    if (global.mongoose.conn) {
        console.log('Using existing database connection');
        return global.mongoose.conn;
    } else {
        const conString = process.env.MONGO_URL;

        const promise = mongoose.connect(conString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
        });

        const conn = await promise;
        global.mongoose.conn = conn;
        global.mongoose.promise = promise;

        console.log('Newly connected to MongoDB');
        return conn;
    }
}
