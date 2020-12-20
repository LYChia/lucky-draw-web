import _ from "lodash";
import React from "react";
import intl from 'react-intl-universal';
import Box from '@material-ui/core/Box';
import Link from "@material-ui/core/Link";
import Step from "@material-ui/core/Step";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';
import Stepper from "@material-ui/core/Stepper";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from '@material-ui/core/MenuItem';
import StepLabel from "@material-ui/core/StepLabel";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from '@material-ui/core/FormControl';
import TranslateIcon from '@material-ui/icons/Translate';

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import loadLocales from '../../locales';
import Dialog from "../../module/Dialog";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href={global.webUrl}>
        {intl.get('form.copyRight')}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative",
    maxHeight: "64px",
    height: "100%"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: "65%",
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  img: {
    maxHeight: "64px",
    width: "auto",
    height: "100%"
  },
  selectLang: {
    marginLeft: 'auto'
  }
}));

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Step1 />;
    case 1:
      return <Step2 />;
    case 2:
      return <Step3 />;
    default:
      throw new Error("Unknown step");
  }
}

export default function Checkout() {

  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);

  const [context, setContext] = useContext();
  let { formResult } = context;

  const [steps, setSteps] = React.useState([
    { step: 1, label: intl.get('form.step1Title') },
    { step: 2, label: intl.get('form.step2Title') },
    { step: 3, label: intl.get('form.step3Title') }
  ]);

  let dialogRef = React.useRef();
  const [dialogSetting, setDialog] = React.useState({ title: "", content: "" });

  // componentDidUpdate
  React.useEffect(() => {
    loadLocales(context.language);

    setSteps([
      { step: 1, label: intl.get('form.step1Title') },
      { step: 2, label: intl.get('form.step2Title') },
      { step: 3, label: intl.get('form.step3Title') }
    ]);

    document.title = intl.get('documentTitle');
  }, [context.language]);

  const saveFormResult = (resultKey, result) => {
    formResult[resultKey] = result;
    setContext(prevContext => ({ ...prevContext, formResult }));
  };

  // componentDidMount
  React.useEffect(() => {
    setContext(prevContext => { return { ...prevContext, saveFormResult } });
  }, []);

  // const resetPages = () => {
  //   setContext(prevContext => ({ ...prevContext, formResult: {} }));
  // };

  const canGoNext = () => {
    let completeFlag = formResult[`step${activeStep + 1}IsComplete`];

    let message = [];
    console.log('completeFlag', completeFlag, 'message', message, 'formResult', formResult);
    if (formResult.duplicatedEmp) {
      message = _.concat([], formResult[`step${activeStep + 1}Message`]);
      setDialog({ title: intl.get('alert.unfinished'), content: _.join(message, "\n") });
      dialogRef.handleToggle("open");
      return false;
    }
    if (!completeFlag || !_.isBoolean(completeFlag)) {
      message = _.concat([], formResult[`step${activeStep + 1}Message`], intl.get('alert.plzComple'));
      setDialog({ title: intl.get('alert.unfinished'), content: _.join(message, "\n") });
      dialogRef.handleToggle("open");
      return false;
    } else {
      return true;
    }
  };

  const handleNext = () => {
    console.log('handleNext', 'formResult', formResult);

    let goNextFlag;
    switch (activeStep) {
      case 0:
      case 1:
        goNextFlag = canGoNext();
        if (goNextFlag) {
          setActiveStep(activeStep + 1);
        }
        break;
      case 2:
        setActiveStep(0);
        // resetPages();
        location.reload();
        break;
      default:
        break;
    }
  };

  const handleLangChange = (event) => {
    setContext(prevContext => { return { ...prevContext, language: event.target.value } });
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Dialog {...dialogSetting} ref={_ref => dialogRef = _ref} />
      <AppBar position="sticky" color="default" className={classes.appBar}>
        <Toolbar>
          <Box component="span" m={3}>
            <img src={`${process.env.PUBLIC_URL}/GoldenTiger.jpg`} className={classes.img} />
          </Box>
          <Typography variant="h6" color="inherit" noWrap align="center">
            {intl.get('form.title')}
          </Typography>
          <div className={classes.selectLang}>
            <Box component="span" m={2}><TranslateIcon /></Box>
            <FormControl>
              <Select value={context.language} onChange={handleLangChange}>
                <MenuItem value={'zhTW'}>繁體中文</MenuItem>
                <MenuItem value={'zhCN'}>简体中文</MenuItem>
                <MenuItem value={'enUS'}>English</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            {intl.get('form.formTitle')}
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(_step => (
              <Step key={_step.step} >
                <StepLabel>{_step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            <React.Fragment>
              {getStepContent(activeStep)}
              <div className={classes.buttons}>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext()}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? "Complete" : "Next"}
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