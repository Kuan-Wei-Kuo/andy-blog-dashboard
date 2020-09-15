import React from "react";
import axios from "axios";
import { Provider } from "./AppContext";
import { withRouter } from "react-router-dom";

const authAxios = axios.create();
authAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token)
      config.headers.Authorization = 'Bearer ' + token;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
)
authAxios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
        case 403:
          localStorage.clear();
          break;
      }
    }
    return Promise.reject(error.response.data);
  }
)

class AppContextProvider extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rootPath: 'http://localhost:8080/andy.blog',
      token: localStorage.getItem('token') || '',
      articles: []
    }
  }

  handleError = () => {
    this.props.history.push('/login');
  }

  getPosts = () => {
    return authAxios.get(this.state.rootPath + '/private/api/posts');
  }

  getPostById = id => {
    return authAxios.get(this.state.rootPath + '/private/api/posts/' + id);
  }

  addPost = data => {
    return authAxios.post(this.state.rootPath + '/private/api/posts', data);
  }

  updatePost = (id, data) => {
    return authAxios.put(this.state.rootPath + '/private/api/posts/' + id, data);
  }

  deletePost = id => {
    return authAxios.delete(this.state.rootPath + '/private/api/posts/' + id);
  }

  login = credentials => {
    return authAxios.post(this.state.rootPath + '/login', credentials)
      .then(response => {
        var tokens = response.data;
        if (tokens) {
          localStorage.setItem('token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);
          this.setState({ token: tokens.accessToken });
        }
        return response;
      }).catch(this.handleError);
  }

  render() {
    return (
      <Provider
        value={{
          login: this.login,
          getPosts: this.getPosts,
          getPostById: this.getPostById,
          addPost: this.addPost,
          updatePost: this.updatePost,
          deletePost: this.deletePost
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}

export default withRouter(AppContextProvider);