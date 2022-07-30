import * as t from "node:test";
import request from "supertest"
import app from "./app";


t.test("should read file with role 'S3FullReader'", async () => {
    let role = "S3FullReader"

    await request(app)
        .get('/object/aws/s3/region/AAAA/Bucket1/Dir1/Dir2/File1.txt')
        .set('Auth', `Role ${role}`)
        .set('User-Id', 'aaa')
        .expect(200);
});

t.test("should write file with role 'S3FullReader'", async () => {
    let role = "S3FullReader"

    await request(app)
        .put('/object/aws/s3/region/AAAA/Bucket1/Dir1/Dir2/File1.txt')
        .set('Auth', `Role ${role}`)
        .set('User-Id', 'aaa')
        .expect(401);
});

t.test("should unauthorized the update profile", async () => {
    let role = "DBSessionUpdateProfile"

    await request(app)
        .put('/db/pacman/db/region/AAAA/profile/bbb')
        .set('Auth', `Role ${role}`)
        .set('User-Id', 'aaa')
        .expect(401);
})

t.test("should update the profile", async () => {
    let role = "DBSessionUpdateProfile"

    await request(app)
        .put('/db/pacman/db/region/AAAA/profile/bbb')
        .set('Auth', `Role ${role}`)
        .set('User-Id', 'bbb')
        .expect(200);
})
