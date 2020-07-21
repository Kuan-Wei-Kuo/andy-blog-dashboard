import React from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

import {
	Chip,
	Fab,
	Link,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	ListItemSecondaryAction,
	MenuItem,
	Select,
	Typography,
	Switch,
	Popper,
	Grow,
	Paper,
	ClickAwayListener,
	MenuList,
	Divider,
	IconButton,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Slide,
	withStyles,
	Container,
	Box
} from '@material-ui/core';

import {
	Bookmark as BookmarkIcon,
	Add as AddIcon,
	MoreVert as MoreVertIcon,
	Delete as DeleteIcon,
	Public as PublicIcon
} from '@material-ui/icons';

import {
	FormattedDate
} from 'react-intl';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = theme => ({
	root: {
		marginTop: theme.spacing(6),
		paddingBottom: theme.spacing(6)
	},
	actionBar: {
		marginTop: theme.spacing(4)
	},
	chip: {
		marginRight: theme.spacing(1),
		cursor: 'pointer'
	},
	fab: {
		position: 'fixed',
		bottom: '5%',
		right: '2%'
	},
	listItemContent: {
		display: 'flex',
		alignItems: 'center',
		'& span': {
			flex: '1 1'
		}
	}
});

class Posts extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			filterChecked: 'ALL',
			deleteOpen: false,
			menuAnchorEl: null,
			menuPost: null
		}
	}

	componentDidMount() {
		axios.get('http://localhost:8080/weblog/priv/api/posts').then(response => {
			let posts = response.data;
			posts.sort(
				function (a, b) {
					let bt = new Date(b.createTime).getTime();
					let at = new Date(a.createTime).getTime();
					return bt - at;
				}
			);
			this.setState({ posts: posts });
		});
	}

	handleListItemClick = (event, id) => {
		this.props.history.push('/post-editor/' + id);
	}

	handleAddClick = () => {
		this.props.history.push('/post-editor');
	}

	handlerFilterOpen = (e) => {
		this.setState({ filterAnchorEl: e.currentTarget })
	}

	handlerFilterClose = () => {
		this.setState({ filterAnchorEl: null })
	}

	handleFilterToggle = (e) => {
		this.setState({ filterChecked: e.target.value })
	}

	handleMenuKeyDown = (event) => {
		if (event.key === 'Tab') {
			event.preventDefault();
			this.setState({ menuAnchorEl: null });
		}
	}

	handleMenuOpen = (event, post) => {
		event.preventDefault();
		this.setState({
			menuAnchorEl: event.currentTarget,
			menuPost: post
		});
	}

	handleMenuClose = (event) => {
		this.setState({
			menuAnchorEl: null,
			menuPost: null
		});
	}

	handleDeleteOpen = () => {
		this.setState({
			deleteOpen: true,
			menuAnchorEl: null
		});
	}

	handleDeleteClose = () => {
		this.setState({ deleteOpen: false });
	}

	handleDeleteEnter = () => {
		let { posts, menuPost } = this.state;
		if (menuPost) {
			axios.delete('http://localhost:8080/weblog/dash/api/posts/' + menuPost.id).then(response => {
				for (let i in posts) {
					let post = posts[i];
					if (post.id === menuPost.id) {
						posts.splice(i, 1);
						this.setState({ menuPost: null, deleteOpen: false });
						return;
					}
				}
			});
		}
	}

	render() {
		const { classes } = this.props;
		const { posts, filterChecked, deleteOpen, menuAnchorEl, menuPost } = this.state;
		const menuOpen = Boolean(menuAnchorEl);
		return (
			<div className={classes.root}>
				<Container maxWidth="lg">
					<Typography variant="h4" align="center">
						文章列表
                    </Typography>
					<Typography variant="subtitle1" align="center">
						掌控您的部落格文章資訊
                    </Typography>
					<Box className={classes.actionBar}>
						<Select
							labelId="filter-select-label"
							id="filter-select"
							value={filterChecked}
							onChange={this.handleFilterToggle}
							disableUnderline
						>
							<MenuItem value={'ALL'}>不限發布</MenuItem>
							<MenuItem value={'PUBLISH'}>已發布</MenuItem>
							<MenuItem value={'NOT-PUBLISH'}>尚未發布</MenuItem>
						</Select>
					</Box>
					<List component="nav" >
						{posts.map((row, index) => {
							if (filterChecked === 'PUBLISH' && row.publish === false)
								return;
							else if (filterChecked === 'NOT-PUBLISH' && row.publish === true)
								return;
							return (
								<React.Fragment key={'list-fragment-' + index}>
									<ListItem key={row.id} onClick={(event) => { this.handleListItemClick(event, row.id) }} button>
										<ListItemIcon>
											{row.publish ? <PublicIcon color="primary" /> : <PublicIcon color="disabled" />}
										</ListItemIcon>
										<ListItemText
											primary={
												<React.Fragment>
													<div className={classes.listItemContent}>
														<Typography
															component="span"
															color="textPrimary"
														>
															{row.title}
														</Typography>
														<span>
															{row.categories.map(category => {
																return <Chip color="primary" key={row.id + '-' + category} label={category} className={classes.chip} icon={<BookmarkIcon />} size="small" />;
															})}
														</span>
														<Typography
															component="span"
															color="textPrimary"
														>
															<FormattedDate
																value={row.createTime}
																year="numeric"
																month="long"
																day="numeric"
															/>
														</Typography>
													</div>
												</React.Fragment>
											}
										/>
										<ListItemSecondaryAction>
											<IconButton
												aria-controls={menuOpen ? 'menu-list-grow' : undefined}
												aria-haspopup="true"
												onClick={(event) => {
													this.handleMenuOpen(event, row);
												}}
											>
												<MoreVertIcon id="menu-btn" />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
									{index !== posts.length - 1 && (
										<Divider key={'list-divider-' + index} light />
									)}
								</React.Fragment>
							);
						})}
					</List>
					<Popper
						open={menuOpen}
						anchorEl={menuAnchorEl}
						role={undefined}
						transition
						disablePortal
					>
						{({ TransitionProps, placement }) => (
							<Grow
								{...TransitionProps}
								style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
							>
								<Paper>
									<ClickAwayListener onClickAway={this.handleMenuClose}>
										<MenuList autoFocusItem={menuOpen} id="menu-list-grow" onKeyDown={this.handleMenuKeyDown} className={classes.mg}>
											<MenuItem onClick={this.handleDeleteOpen}>
												<ListItemIcon>
													<DeleteIcon />
												</ListItemIcon>
												<Typography variant="inherit" noWrap>
													Delete
                                            </Typography>
											</MenuItem>
											<MenuItem onClick={this.handleMenuClose}>
												<ListItemIcon>
													<PublicIcon />
												</ListItemIcon>
												<Typography variant="inherit" noWrap>
													Publish ?
                                            </Typography>
												<Switch
													size="small"
													edge="end"
												/>
											</MenuItem>
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
					<Dialog
						open={deleteOpen}
						TransitionComponent={Transition}
						keepMounted
						onClose={this.handleDeleteClose}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle id="alert-dialog-slide-title">{'請問要刪除 "' + (menuPost ? menuPost.title : '') + '" 嗎 ?'}</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-slide-description">
								我們將無法復原刪除的文章，您確定要刪除嗎 ?
                        </DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleDeleteClose} color="primary">
								取消
                            </Button>
							<Button onClick={this.handleDeleteEnter} color="secondary">
								確定
                            </Button>
						</DialogActions>
					</Dialog>
				</Container>
				<Fab color="secondary" aria-label="add" className={classes.fab} onClick={this.handleAddClick}>
					<AddIcon />
				</Fab>
			</div>
		)
	}

}

export default withRouter(withStyles(useStyles)(Posts));