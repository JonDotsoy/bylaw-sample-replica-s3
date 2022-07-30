import { grant } from "./rules"
import express from "express";

const Ok = (): express.Handler => (_, res) => res.status(200).json({})
const loadResourceData = async () => ({
    ownerId: 'bbb',
})

const app = express();

const arnMiddleware = (): express.RequestHandler => (req, res, next) => {
    const { partition, service, region, accountId, resource } = req.params;
    res.locals.arn = `arn:${partition}:${service}:${region}:${accountId}:${resource}`;
    return next();
}

app.get('/bucket/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('s3:ListBucket'), Ok());
app.put('/bucket/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('s3:PutBucket'), Ok());
app.delete('/bucket/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('s3:DeleteBucket'), Ok());

app.get('/object/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('s3:GetObject'), Ok());
app.put('/object/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('s3:PutObject'), Ok());
app.delete('/object/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('s3:DeleteObject'), Ok());

app.get('/object-tags/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('s3:GetObjectTags'), Ok());
app.put('/object-tags/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('s3:PutObjectTags'), Ok());
app.delete('/object-tags/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('s3:DeleteObjectTags'), Ok());

app.get('/db/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('db:GetEntry', loadResourceData), Ok());
app.put('/db/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('db:PutEntry', loadResourceData), Ok());
app.delete('/db/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware(), grant('db:DeleteEntry', loadResourceData), Ok());

export default app;
