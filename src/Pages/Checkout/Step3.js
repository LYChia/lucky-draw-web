import _ from 'lodash';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import Step1 from './Step1';

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: '700',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  region: {
    margin: theme.spacing(5),
  },
  paper: {
    padding: theme.spacing(3, 2),
    backgroundColor: "LavenderBlush"
  }
}));

export default function Review(props) {
  let { formResult, saveResult } = props;
  let { getPrize } = formResult;
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.region}>
        <Typography variant="h5" gutterBottom>
          感謝您的參與
        </Typography>
        <Typography variant="subtitle1">
          我們重視每個人的意見
        </Typography>
      </div>

      {!_.isEmpty(getPrize) &&
        <div className={classes.region}>
          <Typography variant="h6" gutterBottom>
            抽獎結果
          </Typography>
          <Paper className={classes.paper} >
            恭喜您抽中 {getPrize.levelTitle} {getPrize.prizeName}
          </Paper>
        </div>
      }
      
      <div className={classes.region}>
        <Typography variant="h6" gutterBottom>
          問卷結果
        </Typography>
        <Step1 saveResult={saveResult} formResult={formResult} mode="answer" />
      </div>
    </React.Fragment>
  );
}