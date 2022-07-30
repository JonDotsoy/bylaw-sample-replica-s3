import express from "express";
import { createRules, evaluate } from "bylaw/async";
import { Policy } from "./db/types/policy";
import { roles } from "./db/roles";
import { groups } from "./db/groups";
import { users } from "./db/users";
import { Role } from "./db/types/role";
import { Group } from "./db/types/group";
import { User } from "./db/types/user";
import { Token } from "./types/token";

const memorize = <R, A extends Array<any>>(cb: (...args: A) => R, ...args: A) => {
    let memory: R;
    return () => {
        if (memory) return memory;
        memory = cb(...args);
        return memory;
    }
}

const toExp = (str: string) => new RegExp(`^${str.replace(/(\W)/g, (_, e) => e === "*" ? `.*` : `\\${e}`)}$`)

const buildEvaluationArnRule = (action: string) =>
    async (token: Token) => {
        for (const policy of token.policies) {
            for (const statement of policy.Statement) {
                if (
                    statement.Action.some(act => toExp(act).test(action))
                    && statement.Resource.some(resource => toExp(resource).test(token.resource))
                ) {
                    if (!statement.Condition) return true;
                    if (await statement.Condition(token)) return true;
                }
            }
        }
        return false;
    }

export const rules = createRules({
    "db:GetEntry":
        buildEvaluationArnRule("db:GetEntry"),
    "db:PutEntry":
        buildEvaluationArnRule("db:PutEntry"),
    "db:DeleteEntry":
        buildEvaluationArnRule("db:DeleteEntry"),

    "s3:GetObject":
        buildEvaluationArnRule("s3:GetObject"),
    "s3:PutObject":
        buildEvaluationArnRule("s3:PutObject"),
    "s3:DeleteObject":
        buildEvaluationArnRule("s3:DeleteObject"),
    "s3:GetObjectTags":
        buildEvaluationArnRule("s3:GetObjectTags"),
    "s3:PutObjectTags":
        buildEvaluationArnRule("s3:PutObjectTags"),
    "s3:DeleteObjectTags":
        buildEvaluationArnRule("s3:DeleteObjectTags"),
    "s3:ListBucket":
        buildEvaluationArnRule("s3:ListBucket"),
    "s3:PutBucket":
        buildEvaluationArnRule("s3:PutBucket"),
    "s3:DeleteBucket":
        buildEvaluationArnRule("s3:DeleteBucket"),
});


export const grant = (action: string, getResourceData?: (req: express.Request, res: express.Response) => any): express.RequestHandler => {
    return async (req, res, next) => {
        const resource = res.locals.arn;
        const policies: Policy[] = [];
        const auth = req.headers["auth"]?.toString();
        const userId = req.headers["user-id"]?.toString();

        if (!userId) return res.status(401).json({ error: "Unauthorized: Require User-Id Header." });
        if (!auth) return res.status(401).json({ error: "Unauthorized: Require Auth Header." });

        if (auth.startsWith("Role ")) {
            const roleId = auth.substring(5);
            const role: Role | undefined = roles[roleId];
            if (role) {
                policies.push(...role.policies)
            }
        }

        if (auth.startsWith("Group ")) {
            const groupId = auth.substring(6);
            const group: Group | undefined = groups[groupId];
            if (group) {
                policies.push(...group.policies);
                for (const role of group.roles) {
                    policies.push(...role.policies)
                }
            }
        }

        if (auth.startsWith("User ")) {
            const userId = auth.substring(5);
            const user: User | undefined = users[userId];
            if (user) {
                policies.push(...user.policies);
                for (const group of user.groups) {
                    if (group) {
                        policies.push(...group.policies);
                        for (const role of group.roles) {
                            policies.push(...role.policies)
                        }
                    }
                }
                for (const role of user.roles) {
                    policies.push(...role.policies)
                }
            }
        }

        const token: Token = {
            userId,
            resource,
            policies,
            getResourceData: getResourceData ? memorize(() => getResourceData(req, res)) : undefined,
        };

        if (!await evaluate(rules, action, token)) return res.status(401).json({ error: "Unauthorized" })

        return next();
    }
}