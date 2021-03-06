"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mongo = void 0;
const mongodb_1 = require("mongodb");
class Mongo {
    constructor(connectionString) {
        this.mongoClient = new mongodb_1.MongoClient(connectionString, { useUnifiedTopology: true });
    }
    findAll(database, collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.mongoClient.connect();
            const db = client.db(database);
            let documents;
            let error;
            try {
                documents = yield db.collection(collection).find(query).toArray();
            }
            catch (e) {
                error = e;
            }
            finally {
                client.close();
            }
            return { documents, error };
        });
    }
    findOne(database, collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.mongoClient.connect();
            const db = client.db(database);
            let document;
            let error;
            try {
                document = yield db.collection(collection).findOne(query);
            }
            catch (e) {
                error = e;
            }
            finally {
                client.close();
            }
            return { document, error };
        });
    }
    insertOne(database, collection, document) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.mongoClient.connect();
            const db = client.db(database);
            let result = {};
            let error;
            try {
                result = yield (yield db.collection(collection).insertOne(document)).result;
            }
            catch (e) {
                error = e;
            }
            finally {
                client.close();
            }
            return { result, error };
        });
    }
    insertMany(database, collection, documents) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.mongoClient.connect();
            const db = client.db(database);
            let result = {};
            let error;
            try {
                result = yield (yield db.collection(collection).insertMany(documents)).result;
            }
            catch (e) {
                error = e;
            }
            finally {
                client.close();
            }
            return { result, error };
        });
    }
    updateOne(database, collection, filter, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.mongoClient.connect();
            const db = client.db(database);
            let document;
            let error;
            try {
                document = yield db.collection(collection).updateOne(filter, query);
            }
            catch (e) {
                error = e;
            }
            finally {
                client.close();
            }
            return { document, error };
        });
    }
    deleteOne(database, collection, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.mongoClient.connect();
            const db = client.db(database);
            let document;
            let error;
            try {
                document = yield db.collection(collection).deleteOne(query);
            }
            catch (e) {
                error = e;
            }
            finally {
                client.close();
            }
            return { document, error };
        });
    }
}
exports.Mongo = Mongo;
