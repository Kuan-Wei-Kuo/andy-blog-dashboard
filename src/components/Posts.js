import React from 'react';
import { withRouter } from 'react-router-dom';
import { withContext } from '../contexts/AppContext';

import {
	Chip,
	Fab,
	MenuItem,
	Select,
	Typography,
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
	Box, Card
} from '@material-ui/core';

import {
	Add as AddIcon,
	Delete as DeleteIcon,
	Public as PublicIcon,
	BarChart
} from '@material-ui/icons';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = theme => ({
	root: {
		marginTop: theme.spacing(6),
		paddingBottom: theme.spacing(6)
	},
	actionBar: {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4)
	},
	select: {
		padding: theme.spacing(2)
	},
	chip: {
		marginRight: theme.spacing(1),
		'&:hover': {
			cursor: 'pointer'
		}
	},
	fab: {
		position: 'fixed',
		bottom: '5%',
		right: '2%'
	},
	postCard: {
		marginBottom: theme.spacing(1),
		padding: theme.spacing(2),
		'&:hover': {
			cursor: 'pointer',
			boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
		}
	},
	postCardHeader: {
		display: 'flex',
		alignItems: 'center',
		paddingBottom: theme.spacing(1)
	},
	postCardContent: {
		display: 'flex',
		alignItems: 'center'
	},
	postCardTitle: {
		flex: 'auto',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	},
	postCardActions: {
		display: 'flex',
		flex: '0 0 auto',
		alignItems: 'center'
	}
});

class Posts extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			filterChecked: 'ALL',
			deleteOpen: false,
			editedItem: null
		}
	}

	componentDidMount() {
		this.props.getPosts().then(response => {
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

	handlePostCardClick = (event, id) => {
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

	handleDelete = (item) => {
		this.setState({
			deleteOpen: true,
			editedItem: item
		});
	}

	handleDeleteClose = () => {
		this.setState({ deleteOpen: false, editedItem: null });
	}

	handleDeleteEnter = () => {
		let { posts, editedItem } = this.state;
		if (editedItem) {
			this.props.deletePost(editedItem.id).then(response => {
				for (let i in posts) {
					let post = posts[i];
					if (post.id === editedItem.id) {
						posts.splice(i, 1);
						this.setState({ editedItem: null, deleteOpen: false });
						return;
					}
				}
			}).catch(error => {
				alert(error.message);
			});
		}
	}

	render() {
		const { classes } = this.props;
		const { posts, filterChecked, deleteOpen, editedItem } = this.state;
		
		const filterPosts = [];
		for(const post of posts) {
			if(filterChecked === 'PUBLISH' && post.publish)
				filterPosts.push(post);
			else if(filterChecked === 'NOT-PUBLISH' && !post.publish)
				filterPosts.push(post);
			else if(filterChecked === 'ALL')
				filterPosts.push(post);
		}

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
							<MenuItem value={'ALL'}>全部</MenuItem>
							<MenuItem value={'PUBLISH'}>已發布</MenuItem>
							<MenuItem value={'NOT-PUBLISH'}>尚未發布</MenuItem>
						</Select>
					</Box>
					<div>
						{filterPosts.map((row, index) => {
							return (
								<Card key={'post-card-' + index} className={classes.postCard} variant="outlined">
									<div className={classes.postCardHeader}>
										<Typography className={classes.postCardTitle} variant="h5" onClick={this.handlePostCardClick}>{row.title}</Typography>
										<div className={classes.postCardActions}>
											<IconButton size="small">
												<PublicIcon />
											</IconButton>
											<IconButton size="small" onClick={(e) => { this.handleDelete(row)}}>
												<DeleteIcon />
											</IconButton>
										</div>
									</div>
									<div className={classes.postCardContent} onClick={this.handlePostCardClick}>
										<Typography className={classes.postCardTitle} variant="subtitle2">
											{row.publish ? '已發布' : '尚未發布'}。
											{row.categories.map(category => {
												return (
													<Chip
														key={row.id + '-' + category}
														className={classes.chip}
														label={category}
														variant="outlined" />
												);
											})}
										</Typography>
										<div className={classes.postCardActions}>
											123
											<BarChart fontSize="small" />
										</div>
									</div>
								</Card>
							)
						})}
					</div>
					<Dialog
						open={deleteOpen}
						TransitionComponent={Transition}
						keepMounted
						onClose={this.handleDeleteClose}
						aria-labelledby="alert-dialog-slide-title"
						aria-describedby="alert-dialog-slide-description"
					>
						<DialogTitle id="alert-dialog-slide-title">{'請問要刪除 "' + (editedItem ? editedItem.title : '') + '" 嗎 ?'}</DialogTitle>
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

export default withRouter(withStyles(useStyles)(withContext(Posts)));