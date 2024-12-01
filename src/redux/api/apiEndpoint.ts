const features = {
  auth: '/auth',
  user: '/user',
};

const api_endpoint = {
  auth: {
    login: `${features.auth}/login`,
    forgot_password: `${features.auth}/forgot-password`,
    change_password: `${features.auth}/reset-password`,
  },
  user: {
    update_profile: `${features.user}/update-profile`,
  },
};

export default api_endpoint;
