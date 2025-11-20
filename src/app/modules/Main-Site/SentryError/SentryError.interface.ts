export interface IErrorLog {
  source: "backend" | "frontend";
  message: string;
  stack?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  user?: {
    id?: string;
    email?: string;
  };
  extra?: any;
}
