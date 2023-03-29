let apiURL;
let gqlURL;

if (process.env.NODE_ENV === 'development') {
  apiURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
} else {
  apiURL = '/api'
}

if (process.env.NODE_ENV === 'development') {
  gqlURL = 'http://localhost:3000/graphql';
} else {
  gqlURL = '/graphql'
}

export default apiURL;
