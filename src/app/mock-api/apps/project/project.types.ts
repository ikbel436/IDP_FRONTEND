export interface InventoryProject
{
    // _id: string;
    // name: string;
    // description?: string;
    // reference?: string | null;
    // provider?: string | null;
    // lien?: string | null;
    // backendDockerImage?: string
    // frontendDockerImage?:string
    // databaseType?:string
    name: string;
    description: string | null;
    createdAt: string;
    lastUpdated: string;
    cloneUrl: string;
    Status: string | null;
    ArgoCD: string | null;
    DockerImage: string | null;
    DBType: string | null;
    language: string | null;
    SonarQube: string | null;
}
