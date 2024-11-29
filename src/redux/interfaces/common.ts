export interface IErrorResponse {
  status: number;
  data: {
    success: boolean;
    message: string;
    errorSources: { path: string; message: string }[];
  };
}
