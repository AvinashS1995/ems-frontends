export interface Sidenav {
    id: string;
    title: string,
    icon: string,
    route: string,
    sequence: number,
    children: Sidenav[]
}
