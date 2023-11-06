export interface SimilarAccount {
    isVerified?: boolean;
    isPrivate?: boolean;
    fullName?: string;
    instagramUrl: string;
    username: string;
    profilePicUrl: string;
    userId: string;
    followers?: number;
}