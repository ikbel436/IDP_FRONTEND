export class Image {
    public_id: string;
    url: string;
}

export class User {
    name: string;
    email: string;
    phoneNumber: number;
    password: string;
    createdAt: Date;
    avatar?: string;
    image: string;
    Role: string;
    Fonction: string;
    resetLink: {
        data: string;
    };
    status: string;
    description: string;
}
