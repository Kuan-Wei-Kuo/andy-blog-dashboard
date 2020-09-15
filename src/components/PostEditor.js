import React from 'react';
import { withContext } from '../contexts/AppContext';

import {
    Chip, 
    IconButton, 
    Button, 
    Input, 
    Typography, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Slide, 
    CircularProgress, 
    withStyles
} from '@material-ui/core';

import {
    Bookmark as BookmarkIcon, 
    Edit as EditIcon, 
    Visibility as VisibilityIcon, 
    Public as PublicIcon, 
    ViewColumn as ViewColumnIcon, 
    Save as SaveIcon, 
} from '@material-ui/icons';

import ChipInput from 'material-ui-chip-input';

import CodeBlock from './CodeBlock';

import Markdown from 'react-markdown';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/theme/monokai.css';
import 'codemirror/lib/codemirror.css';
import 'github-markdown-css'
require('codemirror/mode/markdown/markdown');

const styles = theme => ({
    postEditor: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
        padding: theme.spacing(2),
        overflow: 'auto',
        height: '0'
    },
    postView: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
        padding: theme.spacing(2),
        overflow: 'auto',
        height: '0'
    },
    title: {
        fontSize: '2.5em',
        fontWeight: '500',
        color: '#424242'
    },
    chips: {
        marginTop: theme.spacing(1),
        '& > *': {
            marginRight: theme.spacing(1)
        }
    },
    mr2: {
        marginRight: theme.spacing(2)
    },
    pageTitle: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    postWrapper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100vw - 240px)',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        [theme.breakpoints.up('xs')]: {
          width: '100%'
        },
    },
    actionBar: {
        display: 'flex',
        background: 'white',
        borderBottom: '1px solid #e5e5e5',
        padding: theme.spacing(1)
    },
    actionBarLeft: {
        flex: '1 1'
    },
    content: {
        flex: '1 1',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        padding: theme.spacing(2)
    },
    codeMirror: {
        marginTop: theme.spacing(2),
        flex: '1 1'
    },
    editViewer: {
        display: 'flex',
        overflow: 'auto',
        minHeight: 'calc(100vh - 128px)'
    },
    editDivider: {
        width: '6px',
        backgroundColor: 'lightgrey'
    },
    fabProgress: {
        color: 'green',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class PostEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            chips: [],
            code: '',
            isView: false,
            mode: 'BOTH',
            errorMsg: null,
            saveLoading: false,
            saveAndPublishLoading: false
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        if(id) {
            this.props.getPostById(id).then(response => {
                let source = response.data;
                this.setState({
                    source: source,
                    title: source.title,
                    chips: source.categories,
                    code: source.content
                });
            });
        }
    }

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    }

    handleAddChip = (chip) => {
        let chips = this.state.chips;
        chips.push(chip);
        this.setState({ chips: chips });
    }
    
    handleDeleteChip = (chip, index) => {
        let chips = this.state.chips;
        chips.splice(index, 1);
        this.setState({ chips: chips });
    }

    handleUpdateCode = (code) => {
        this.setState({ code: code });
    }

    handleViewClick = (event) => {
        let mode = event.currentTarget.getAttribute('view-type');
        this.setState({ mode: mode });
    }

    handleSave = () => {
        this.setState({ saveLoading: true });
        let id = this.props.match.params.id;
        let { title, chips, code } = this.state;
        let data = { title: title, content: code, categories: chips, publish: false };
        if(id)
            this.handleUpdatePost(id, data);
        else
            this.handleAddPost(data);
    }
    
    handleSaveAndPublish = () => {
        this.setState({ saveAndPublishLoading: true });
        let id = this.props.match.params.id;
        let { title, chips, code } = this.state;
        let data = { title: title, content: code, categories: chips, publish: true };
        if(id)
            this.handleUpdatePost(id, data);
        else
            this.handleAddPost(data);
    }

    handleUpdatePost = (id, data) => {
        this.props.updatePost(id, data).then(() => {
            this.props.history.go(-1);
        }).catch(error => {
            alert(error.message);
        }).finally(() => {
            this.setState({ saveLoading: false });
        });
    }

    handleAddPost = (data) => {
        this.props.addPost(data).then(() => {
            this.props.history.go(-1);
        }).catch(error => {
            alert(error.message);
        }).finally(() => {
            this.setState({ saveLoading: false });
        });
    }

    handleDialogClose = () => {
        this.setState({ errorMsg: null })
    }

    renderChips = () => {
        let chips = this.state.chips;
        let chipElems = [];
        for (let i in chips) {
            chipElems.push(<Chip key={chips[i]} label={chips[i]} icon={<BookmarkIcon />} size="small" />);
        }
        return chipElems;
    }

    renderPostView = () => {
        let { classes } = this.props;
        let { title, code, mode } = this.state;
        if(mode === 'VIEW' || mode === 'BOTH') {
            return (
                <div className={classes.content}>
                    <div className={classes.pageTitle}>
                        <Typography variant="h4" component="h1" className={classes.title}>
                            {title}
                        </Typography>
                        <div className={classes.chips}>
                            {this.renderChips()}
                        </div>
                    </div>
                    <Markdown escapeHtml={false} className="markdown-body" source={code} renderers={{ code: CodeBlock }} />
                </div>
            );
        }
    }

    renderPostDivider = () => {
        let { classes } = this.props;
        let { mode } = this.state;
        if(mode === 'BOTH') {
            return (
                <div className={classes.editDivider}></div>
            );
        }
    }

    renderPostEdit = () => {
        let { classes } = this.props;
        let { title, chips, code, mode } = this.state;
        let options = {
            mode: 'markdown',
            lineNumbers: true,
            theme: 'monokai',
            scrollbarStyle: null,
            lineWrapping: true
        };
        if(mode === 'EDIT' || mode === 'BOTH') {
            return (
                <div className={classes.content}>
                    <Input placeholder="Page title" disableUnderline={true} inputProps={{ 'aria-label': 'description' }} className={classes.title} value={title} onChange={this.handleTitleChange} />
                    <ChipInput placeholder="Page category" value={chips} onDelete={(chip, index) => this.handleDeleteChip(chip, index) } onAdd={(chip) => this.handleAddChip(chip)} InputProps={{ 'aria-label': 'description' }} disableUnderline={true} />
                    <CodeMirror 
                        value={code}
                        options={options} 
                        onBeforeChange={(editor, data, value) => {
                            this.setState({ code: value });
                        }}
                        onChange={(editor, data, value) => { 
                            this.setState({ code: value });
                        }}
                        className={classes.codeMirror}
                        style={{ height: '100%' }} 
                    />
                </div>
            );
        }
    }

    render() {
        const { classes } = this.props;
        const { errorMsg, saveLoading, saveAndPublishLoading } = this.state;
        const dialogOpen = Boolean(errorMsg);
        return (
            <React.Fragment>
                <div className={classes.postWrapper}>
                    <div className={classes.actionBar}>
                        <div className={classes.actionBarLeft}>
                            <IconButton onClick={this.handleViewClick} view-type="VIEW">
                                <VisibilityIcon />
                            </IconButton>
                            <IconButton onClick={this.handleViewClick} view-type="BOTH">
                                <ViewColumnIcon />
                            </IconButton>
                            <IconButton onClick={this.handleViewClick} view-type="EDIT">
                                <EditIcon />
                            </IconButton>
                        </div>
                        <div className={classes.actionBarRight}>
                            <IconButton onClick={this.handleSave}>
                                <SaveIcon />
                                { saveLoading && <CircularProgress size={48} className={classes.fabProgress} />}
                            </IconButton>
                            <IconButton onClick={this.handleSaveAndPublish}>
                                <PublicIcon />
                                { saveAndPublishLoading && <CircularProgress size={48} className={classes.fabProgress} />}
                            </IconButton>
                        </div>
                    </div>
                    <div className={classes.editViewer}>
                        { this.renderPostEdit() }
                        { this.renderPostDivider() }
                        { this.renderPostView() }
                    </div>
                </div>
                <Dialog
                    fullWidth={true}
                    maxWidth={'xs'}
                    open={dialogOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleDialogClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">Oops!</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {errorMsg}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogClose} color="primary">
                            AGREE
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }

}

export default withStyles(styles)(withContext(PostEditor));