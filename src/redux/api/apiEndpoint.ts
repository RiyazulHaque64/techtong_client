const features = {
  auth: '/auth',
};

const api_endpoint = {
  auth: {
    login: `${features.auth}/login`,
    forgot_password: `${features.auth}/forgot-password`,
  },
};

export default api_endpoint;
