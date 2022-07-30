export interface Policy {
    id: string,
    Statement: {
        Effect: 'Allow';
        Action: string[];
        Resource: string[];
        Condition?: (token: any) => Promise<boolean>,
    }[];
}
