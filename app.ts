import { func } from "./rules"
import express from "express";

const Ok = (): express.Handler => (_, res) => res.status(200).json({})
const loadData = (): express.Handler => (_, res, next) => {
    res.locals.resourceData = {
        ownerId: 'bbb',
    };
    return next();
}

const app = express();

const arnMiddleware: express.RequestHandler = (req, res, next) => {
    const { partition, service, region, accountId, resource } = req.params;
    res.locals.arn = `arn:${partition}:${service}:${region}:${accountId}:${resource}`;
    return next();
}

app.get('/bucket/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('s3:ListBucket'), Ok());
app.put('/bucket/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('s3:PutBucket'), Ok());
app.delete('/bucket/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('s3:DeleteBucket'), Ok());

app.get('/object/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('s3:GetObject'), Ok());
app.put('/object/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('s3:PutObject'), Ok());
app.delete('/object/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('s3:DeleteObject'), Ok());

app.get('/object-tags/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('s3:GetObjectTags'), Ok());
app.put('/object-tags/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('s3:PutObjectTags'), Ok());
app.delete('/object-tags/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('s3:DeleteObjectTags'), Ok());

app.get('/db/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('db:GetEntry'), loadData(), func('db:GetEntry:After'), Ok());
app.put('/db/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('db:PutEntry'), loadData(), func('db:PutEntry:After'), Ok());
app.delete('/db/:partition/:service/:region/:accountId/:resource(*)', arnMiddleware, func('db:DeleteEntry'), loadData(), func('db:DeleteEntry:After'), Ok());

export default app;
