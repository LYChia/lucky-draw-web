import _ from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
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

const prizeMapping = {
  zhTW: {
    levelTitle: 'levelTitleZhtw',
    prizeName: 'prizeNameZhtw',
  },
  zhCN: {
    levelTitle: 'levelTitleZhcn',
    prizeName: 'prizeNameZhcn'
  },
  enUS: {
    levelTitle: 'levelTitleEnus',
    prizeName: 'prizeNameEnus'
  }
};

export default function Review() {
  const [context, setContext] = useContext();
  let { saveFormResult, formResult, language } = context;
  let { getPrize } = formResult;
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.region}>
        <Typography variant="h5" gutterBottom>
          {intl.get('review.thank')}
        </Typography>
        <Typography variant="subtitle1">
          {intl.get('review.value')}
        </Typography>
      </div>

      {!_.isEmpty(getPrize) &&
        <div className={classes.region}>
          <Typography variant="h6" gutterBottom>
            {intl.get('review.drawResult')}
          </Typography>
          <Paper className={classes.paper} >
            {intl.get('review.congrat')} {getPrize[prizeMapping[language]['levelTitle']]} {getPrize[prizeMapping[language]['prizeName']]}
          </Paper>
        </div>
      }

      <div className={classes.region}>
        <Typography variant="h6" gutterBottom>
          {intl.get('review.questResult')}
        </Typography>
        <Step1 saveFormResult={saveFormResult} formResult={formResult} mode="answer" />
      </div>
    </React.Fragment>
  );
}