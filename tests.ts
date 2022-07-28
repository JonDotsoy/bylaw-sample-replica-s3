import * as t from "node:test";
import * as assert from "node:assert";
import * as request from "supertest"
import app from "./app";

t.test("Should access resource by role", async t => {

    await t.test("should access by role", async () => {
        let role = "S3FullReader"

        await request(app)
            .get('/api/arn:aws:s3:::Bucket1/Dir1/Dir2/File1.txt')
            .set('Auth', `Role ${role}`)
            .expect(200);
    });

});
