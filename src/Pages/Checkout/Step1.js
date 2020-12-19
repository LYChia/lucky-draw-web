import _ from "lodash";
import React from "react";
import intl from 'react-intl-universal';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
//import Checkbox from '@material-ui/core/Checkbox';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { questionaireZhtw, questionaireZhcn, questionaireEnus } from "../../config";

const questionaireMapping = {
  zhTW: questionaireZhtw,
  zhCN: questionaireZhcn,
  enUS: questionaireEnus,
};

function Question(question) {
  const [otherValue, setOtherValue] = React.useState("");

  const useStyles = makeStyles(theme => ({
    grid: {
      margin: theme.spacing(2, 0)
    },
    helpText: {
      color: "red"
    }
  }));

  const classes = useStyles();

  const renderOption = () => {
    switch (question.type) {
      case "textField":
        return (
          <TextField
            required
            id="standard-full-width"
            style={{ margin: 8 }}
            placeholder={question.placeholder}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={question.answer[question.index]}
            onChange={e => {
              question.updateAnswer(question.index, e.target.value);
            }}
          />
        );
      case "radioGroup":
        let { options, enableOther } = question;
        return (
          <RadioGroup
            aria-label={_.head(options)}
            name="customized-radios"
            value={question.answer[question.index]}
            onChange={e => {
              question.updateAnswer(question.index, e.target.value);
            }}
          >
            {_.map(options, (_option, _i) => (
              <FormControlLabel
                value={_option}
                control={<Radio />}
                label={_option}
                key={_i}
              />
            ))}
            {enableOther && (
              <span>
                <FormControlLabel value={otherValue} control={<Radio />} />
                <TextField
                  value={otherValue}
                  placeholder={
                    question.otherPlaceholder
                      ? question.otherPlcaeholder
                      : intl.get("form.other")
                  }
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  onChange={e => {
                    setOtherValue(e.target.value);
                  }}
                />
              </span>
            )}
          </RadioGroup>
        );
      case "textareaAutosize":
        return (
          <TextField
            id="standard-full-width"
            style={{ margin: 8, minWidth: "400px" }}
            fullWidth={true}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            multiline
            value={question.answer[question.index]}
            onChange={e => {
              question.updateAnswer(question.index, e.target.value);
            }}
          />
        );
      case "answer":
        console.log("answer", question.answer[question.index]);
        return (
          <FormLabel component="legend" style={{ fontWeight: "bold" }}>
            {question.answer[question.index]}
          </FormLabel>
        );
      default:
        return "";
    }
  };

  return (
    <Grid container spacing={3} className={classes.grid}>
      <FormControl component="fieldset">
        <Grid
          item
          container
          xs={12}
          md={12}
          className={classes.title}
          direction="row"
        >
          <FormLabel component="legend">
            {question.index + ". " + question.title}
          </FormLabel>
          &emsp;
          {question.required && (
            <FormHelperText
              className={classes.helpText}
              hidden={question.type === "answer"}
            >
              * {intl.get('form.required')}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={12}>
          {renderOption()}
        </Grid>
      </FormControl>
    </Grid>
  );
}

export default function Questionaire(props) {
  let { mode } = props;

  const [context, setContext] = useContext();
  let { formResult, saveFormResult } = context;

  const [questionaire, setQuestionaire] = React.useState(questionaireMapping[global.defaultLang]);

  // componentDidUpdate
  React.useEffect(() => {
    setQuestionaire(questionaireMapping[context.language]);
  }, [context.language]);

  const isComplete = () => {
    let completeFlag = true;
    let message = [intl.get('form.unfinish')];

    _.forEach(questionaire, (_question, _key) => {
      if (_question.required) {
        if (_.isEmpty(formResult[_key])) {
          completeFlag = false;
          message.push(_key);
        }
      }
    });

    return { completeFlag, message };
  };

  const updateAnswer = (key, _answer) => {
    formResult[key] = _answer;

    let { completeFlag, message } = isComplete();
    formResult.step1IsComplete = completeFlag;
    formResult.step1Message = message;

    saveFormResult(formResult);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom hidden={mode === "answer"}>
        {intl.get('form.step1Title')}
      </Typography>

      {_.map(questionaire, (_setting, _key) => (
        <Question
          {..._setting}
          index={_key}
          key={_key}
          type={mode === "answer" ? "answer" : _setting.type}
          answer={formResult}
          updateAnswer={updateAnswer}
        />
      ))}
    </React.Fragment>
  );
}