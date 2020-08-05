import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  TextField,
  withStyles,
  Typography,
  Divider,
  Paper,
  Button,
  Card,
  CardHeader,
  CardContent,
  Grid,
  CardActions,
  Container,
  Avatar,
  Badge,
  ButtonBase
} from '@material-ui/core';

import {
  PhotoCamera as PhotoCameraIcon
} from '@material-ui/icons';

import {
  FormattedMessage
} from 'react-intl';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(6),
    paddingBottom: theme.spacing(6)
  },
  profileCard: {
    marginTop: theme.spacing(4)
  },
  avatarLager: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    border: '1px solid gray'
  },
  avatarButton: {
    width: '100%',
    textAlign: 'unset',
    padding: theme.spacing(1),
    borderRadius: '25px'
  },
  input: {
    display: 'none'
  }
});

class Profile extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center">
            個人資訊
                    </Typography>
          <Typography variant="subtitle1" align="center">
            您在部落格使用的基本資訊 (例如姓名和相片)
                    </Typography>
          <Card className={classes.profileCard} variant="outlined">
            <CardHeader title="個人資料" subheader="這些資訊將會公開於部落格當中。" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    type="file"
                  />
                  <label htmlFor="contained-button-file">
                    <ButtonBase className={classes.avatarButton} focusRipple component="span">
                      <Grid container spacing={3}>
                        <Grid item>
                          <Badge
                            overlap="circle"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            badgeContent={<PhotoCameraIcon color="secondary" />}
                          >
                            <Avatar className={classes.avatarLager} src="https://avatars3.githubusercontent.com/u/7732396?s=400&u=11266b2bd0aef8df8d7cfe9b30bb68293316dbe0&v=4" />
                          </Badge>
                        </Grid>
                        <Grid item xs>
                          <Typography variant="subtitle1">
                            你可以透過相片來個人化部落格
                                                    </Typography>
                        </Grid>
                      </Grid>
                    </ButtonBase>
                  </label>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="GitHub"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Intro"
                    rows="10"
                    variant="outlined"
                    multiline
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="secondary">更新個人資料</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Profile));