import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FeaturedDapp {
    projectName: string;
    author: string;
    dappBenefits: Array<string>;
    image: string;
    dappSummary: string;
}
export interface Section2 {
    title: string;
    subtitle: Array<string>;
}
export interface ValentineContent {
    featuredDapps: Array<FeaturedDapp>;
    featuredStories: Array<FeaturedStory>;
    section2: Section2;
    featuredGameStory: Story;
}
export interface FeaturedStory {
    title: string;
    quote: Story;
    intro: string;
}
export interface Story {
    author: string;
    loveNote: string;
    image: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPublishedContent(): Promise<ValentineContent>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePublishedContent(newContent: ValentineContent): Promise<void>;
}
