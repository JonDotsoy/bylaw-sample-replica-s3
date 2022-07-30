import { Policy } from "../db/types/policy";

export interface Token {
    userId: string;
    resource: string;
    policies: Policy[];
    getResourceData?: () => Promise<any>;
}
