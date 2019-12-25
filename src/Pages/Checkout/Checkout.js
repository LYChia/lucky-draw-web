import _ from 'lodash';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import prizeConfig from '../../config/prizeConfig.json';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={global.serverConfig.clubUrl}>
        {global.formConfig.copyRight}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

function getStepContent(step, saveResult, formResult) {
  switch (step) {
    case 0:
      return <Step1 saveResult={saveResult} formResult={formResult} />;
    case 1:
      return <Step2 saveResult={saveResult} formResult={formResult} />;
    case 2:
      return <Step3 saveResult={saveResult} formResult={formResult} />;
    default:
      throw new Error('Unknown step');
  }
}

export default function Checkout() {
  let { formConfig } = global;
  let steps = _.reduce(formConfig, (result, _value, _key) => {
    if (_.startsWith(_key, "step")) {
      result.push(_value);
    }
    return result;
  }, []);

  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const [formResult, setFormResult] = React.useState({ prizes: _.cloneDeep(prizeConfig.prizeList) });

  const handleNext = () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    } else {
      setActiveStep(0);
      resetPages();
    }
  };

  // const handleBack = () => {
  //   setActiveStep(activeStep - 1);
  // };

  // const handleStep = (label) => {
  //   let targetStep = _.findIndex(steps, _step => _step === label);
  //   setActiveStep(targetStep);
  // }

  const saveResult = (resultKey, result) => {
    formResult[resultKey] = result;
    setFormResult(formResult);
  }

  const resetPages = () =>{
    let initialFormResult = _.assign({}, {prizes: formResult.prizes});
    setFormResult(initialFormResult);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            {formConfig.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            {formConfig.formTitle}
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label}/*  onClick={() => handleStep(label)} */>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>

            <React.Fragment>
              {getStepContent(activeStep, saveResult, formResult)}
              <div className={classes.buttons}>
                {/* activeStep !== 0 && (
                  <Button onClick={handleBack} className={classes.button}>
                    Back
                    </Button>
                ) */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
                </Button>
              </div>
            </React.Fragment>

          </React.Fragment>
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
}