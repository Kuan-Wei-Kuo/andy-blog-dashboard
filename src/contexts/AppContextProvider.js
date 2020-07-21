import React from "react";
import axios from "axios";
import { Provider } from "./AppContext";
import { withRouter } from "react-router-dom";

const authAxios = axios.create();
authAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const tokenType = localStorage.getItem('token_type');
    if (token)
      config.headers.Authorization = tokenType + ' ' + token;
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
      rootPath: 'http://localhost:8080/personal.blog/dashboard/api',
      token: localStorage.getItem('token') || '',
      articles: []
    }
  }

  handleError() {
    this.props.history.push('/login');
  }

  getArticles = () => {
    return authAxios.get(this.state.rootPath + '/articles').then(response => {
      if (response.data.code == 200)
        this.setState({ articles: response.data.data });
      return response;
    }).catch(this.handleError);
  }

  getArticleById = id => {
    return authAxios.get(this.state.rootPath + '/articles/' + id).then(response => {
      return response;
    }).catch(this.handleError);
  }

  addArticle = data => {
    return authAxios.post(this.state.rootPath + '/articles', data).then(response => {
      if (response.data.code == 200)
        this.props.history.push('/articles');
      return response;
    }).catch(this.handleError);
  }

  editArticle = (id, data) => {
    return authAxios.put(this.state.rootPath + '/articles/' + id, data).then(response => {
      if (response.data.code == 200)
        this.props.history.push('/articles');
      return response;
    }).catch(this.handleError);
  }

  deleteArticle = id => {
    return authAxios.delete(this.state.rootPath + '/articles/' + id).then(response => {
      return response;
    }).catch(this.handleError);
  }

  login = credentials => {
    return authAxios.post('http://localhost:8080/andy.blog/login', credentials)
      .then(response => {
        var tokens = response.data;
        if (tokens) {
          localStorage.setItem('token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);
          localStorage.setItem('token_type', tokens.tokenType);
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
          getArticles: this.getArticles,
          getArticleById: this.getArticleById,
          addArticle: this.addArticle,
          editArticle: this.editArticle,
          deleteArticle: this.deleteArticle
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}

export default withRouter(AppContextProvider);