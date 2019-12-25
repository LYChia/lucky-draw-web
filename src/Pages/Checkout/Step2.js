import _ from 'lodash';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import GifPlayer from 'react-gif-player';
import {
  LooksOne as LooksOneIcon, LooksTwo as LooksTwoIcon, Looks3 as Looks3Icon,
  Looks4 as Looks4Icon, Looks5 as Looks5Icon, Looks6 as Looks6Icon,
} from '@material-ui/icons/';
import prizeConfig from '../../config/prizeConfig.json';

export default function LuckyDraw(props) {
  let { saveResult, formResult } = props;
  let { getPrize, prizes } = formResult;

  const [play, setPlay] = React.useState(false);
  const [alreadyDraw, setAlreadyDraw] = React.useState(false);
  //const [prizes, setPrizes] = React.useState(_.cloneDeep(prizeConfig.prizeList));
  //const [getPrize, setGetPrize] = React.useState({ prizeName: "" });

  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    paper: {
      padding: theme.spacing(3, 2),
      backgroundColor: "LavenderBlush"
    }
  }));
  const classes = useStyles();

  const renderPrizeList = () => {
    return _.map(prizes, (_prize, _i) => {
      const renderIcon = () => {
        switch (_i) {
          case 0:
            return <LooksOneIcon />;
          case 1:
            return <LooksTwoIcon />;
          case 2:
            return <Looks3Icon />;
          case 3:
            return <Looks4Icon />;
          case 4:
            return <Looks5Icon />;
          case 5:
            return <Looks6Icon />;
          default:
            return "";
        }
      }
      return (
        <ListItem key={_i}>
          <ListItemAvatar>
            <Avatar style={_i <= 2 ? { backgroundColor: "orange" } : {}}>{renderIcon()}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={_prize.levelTitle + "　" + _prize.prizeName}
          />
          <ListItemSecondaryAction>
            數量: {_prize.count}
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  }

  const weightedRandom = () => {
    let [totalWeight, randomArray] = _.reduce(prizes, (result, _prize, _index) => {
      let [_totalWeight, _randomArray] = result;
      _totalWeight = _totalWeight + _prize.count;
      _randomArray = _.concat([], _randomArray, _.times(_prize.count, () => _index));
      return [_totalWeight, _randomArray];
    }, [0, []]);

    let randomNumber = _.floor(_.random(0, 1, true) * totalWeight);
    let prizeIndex = randomArray[randomNumber];
    let _getPrize = prizes[prizeIndex];
    console.log(totalWeight, randomArray, randomNumber, prizeIndex, _getPrize);

    prizes[prizeIndex].count = prizes[prizeIndex].count - 1;

    formResult.prizes = prizes;
    formResult.getPrize = _getPrize;
    saveResult(formResult);
  }

  const onTogglePlay = () => {
    //console.log('on toggle play', alreadyDraw);
    setPlay(!play);
    if (play) {
      setAlreadyDraw(true);
      weightedRandom();
    }
  }

  return (
    <React.Fragment>
      <Typography variant="h6" className={classes.title}>
        {prizeConfig.listTitle}
      </Typography>
      <div className={classes.demo}>
        <List dense={false}>
          {renderPrizeList()}
        </List>
      </div>
      <div id="drawRegion" align="center">
        <Typography variant="h6" className={classes.title} hidden={alreadyDraw}>
          {prizeConfig.drawBtnText}
        </Typography>
        {!alreadyDraw ?
          <GifPlayer autoplay={false}
            onTogglePlay={() => { onTogglePlay() }}
            gif={`${process.env.PUBLIC_URL}/luckyDraw.gif`}
            still={`${process.env.PUBLIC_URL}/still.gif`}
          /> :
          <Paper className={classes.paper}>
            恭喜您抽中 {getPrize.levelTitle} {getPrize.prizeName}
          </Paper>
        }
      </div>
    </React.Fragment>
  );
}