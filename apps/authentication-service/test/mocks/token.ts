export const mockGenerateToken = jest.fn().mockImplementation((payload, secret, expiresIn) => {
    return `mock-token-${payload.userId || "unknown"}`;
});

export const mockValidateToken = jest.fn().mockImplementation((token, secret) => {
    if (token.startsWith("mock-token")) {
        return {
            valid: true,
            decoded: { userId: "1", iat: Date.now() / 1000, exp: Date.now() / 1000 + 3600 },
        };
    }
    return { valid: false, error: "Invalid token" };
});
