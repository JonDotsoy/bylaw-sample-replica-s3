export interface Policy {
    Statement: {
        Effect: 'Allow',
        Action: string[],
        Resource: string[],
    }[]
}

export const s3ReadFullBuckets: Policy = {
    Statement: [
        {
            Effect: 'Allow',
            Action: [
                "s3:GetObject",
                "s3:ListBucket",
            ],
            Resource: ["arn:aws:s3:::\\w+/\\w+"],
        }
    ]
}
