
export interface IUser {
    id: number;
    username: string;
    tag: number;
    avatar_url: string;
    activity?: {
        type: string;
        name: string;
        duration: string;
    };
};

export interface IDirectChannel {
    id: string;
    target: IUser;
    messages: IMessage[];
    unreadCount?: number; 
    last_activity_at?: string;
}

export interface IMessageGroup {
    user: IUser,
    messages: IMessage[],
}

export interface IMessage {
    id: number;
    user: IUser;
    content: string;
    time: string;
    is_received?: boolean;
    type: number;
    file: {
        name: string;
        size: number;
        url: string;
    }
}

export interface IChannel {
    id: number;
    name: string;
    messages: IMessage[];
}

export interface ICategorie {
    id: number;
    name: string;
    channels: IChannel[];
}

export interface IRole {
    id: number;
    name: string;
    color: string;
    isSeparated: boolean;
}

export interface IMember {
    userId: number;
    roles: number[];
}

export interface IGuild {
    id: number;
    name: string;
    initials: string;
    icon: string;
    welcomeChannelId: number;
    categories: ICategorie[];
    roles:  { [key: string]: IRole; };
    members: IMember[];
}