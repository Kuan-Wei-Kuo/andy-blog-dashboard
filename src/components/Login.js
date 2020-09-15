import React from 'react';
import { Redirect } from 'react-router-dom';

import { TextField, Typography, Button, Card, CardContent, CardHeader } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { withContext } from '../contexts/AppContext';

const styles = theme => ({
    wapper: {
        'width': '100%',
        'height': '100vh',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'flex-direction': 'column'
    },
    margin: {
        marginBottom: theme.spacing(2)
    }
});

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isRequire: true
        }
    }

    handleLoginBtnClick = event => {
        event.preventDefault();
        let data = { username: this.state.username, password: this.state.password };
        this.props.login(data).then(() => {
            this.props.history.push('/');
        })
    }

    handleUsernameChange = event => {
        let username = { username: event.target.value };
        if (event.target.value !== '' && this.state.password !== '')
            this.setState({ ...username, isRequire: false });
        else
            this.setState({ ...username, isRequire: true });
    }

    handlePasswordChange = event => {
        let password = { password: event.target.value };
        if (event.target.value !== '' && this.state.username !== '')
            this.setState({ ...password, isRequire: false });
        else
            this.setState({ ...password, isRequire: true });
    }

    render() {
        const { classes } = this.props;
        if (localStorage.getItem('token')) {
            return <Redirect to="/" />;
        }
        return (
            <div className={classes.wapper}>
                <Card>
                    <CardContent >
                        <Typography variant="h3" align="center" gutterBottom>Andy Blog</Typography>
                        <form onSubmit={this.handleLoginBtnClick}>
                            <TextField
                                id="username"
                                label="Username"
                                className={classes.margin}
                                autoComplete="username"
                                variant="outlined"
                                color="primary"
                                onChange={this.handleUsernameChange}
                                required
                                fullWidth
                            />
                            <TextField
                                id="password"
                                label="Password"
                                className={classes.margin}
                                type="password"
                                autoComplete="current-password"
                                variant="outlined"
                                color="primary"
                                onChange={this.handlePasswordChange}
                                required
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.margin}
                                fullWidth
                            >
                                SIGN IN
                    </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(withContext(Login));