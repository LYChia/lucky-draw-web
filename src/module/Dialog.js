import _ from 'lodash';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default class CustomizedDialogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleToggle = (action) => {
    switch (action) {
      case "open":
        this.setState({ open: true });
        break;
      case "close":
        this.setState({ open: false });
        break;
      case "toggle":
        this.setState({ open: !this.state.open });
        break;
      default:
        break;
    }
  }
  render() {
    let { title, content } = this.props;
    return (
      <div>
        <Dialog onClose={() => this.handleToggle("close")} 
          aria-labelledby="customized-dialog-title" open={this.state.open}>
          <DialogTitle id="customized-dialog-title" onClose={() => this.handleToggle("close")}>
            {title || "title"}&emsp;&emsp;
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              {content || "content" }
            </Typography>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

