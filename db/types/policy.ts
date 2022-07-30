import { Token } from "../../types/token";

export interface Policy {
    id: string,
    Statement: {
        Effect: 'Allow';
        Action: string[];
        Resource: string[];
        Condition?: (token: Token) => Promise<boolean>,
    }[];
}
