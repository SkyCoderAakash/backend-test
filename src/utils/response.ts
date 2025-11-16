interface ResponseOptions<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  statusCode?: number;
}

export const sendResponse = <T = any>(
  res: any,
  { success, message = "", data = null, errors = null, statusCode = 200 }: ResponseOptions<T>
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    errors,
  });
};
