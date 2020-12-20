import _ from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import GifPlayer from 'react-gif-player';
import List from '@material-ui/core/List';
import Paper from "@material-ui/core/Paper";
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import fetchUrl from '../../module/fetch';

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

export default function LuckyDraw() {
  const [play, setPlay] = React.useState(false);
  const [alreadyDraw, setAlreadyDraw] = React.useState(false);

  const [context, setContext] = useContext();
  let { saveFormResult, formResult, language, prizes } = context;

  const setPrizes = (value) => {
    setContext(prevContext => { return { ...prevContext, prizes: value } });
  }

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
    },
    avatar: {
      backgroundColor: red[500],
    }
  }));
  const classes = useStyles();

  // componentDidMount
  React.useEffect(() => {
    async function getPrize() {
      setPrizes(await fetchUrl({ url: `${global.apiUrl}/prize` }));
    }

    getPrize();

    //#region for test
    // let fakeData = [
    //   {
    //     "seq": "1",
    //     "levelTitleZhtw": "頭獎",
    //     "prizeNameZhtw": "威秀電影票",
    //     "initCount": "1",
    //     "count": "1",
    //     "levelTitleEnus": "Jackpot",
    //     "prizeNameEnus": "Vision Movie Ticket",
    //     "levelTitleZhcn": "头奖",
    //     "prizeNameZhcn": "威秀电影票"
    //   },
    //   {
    //     "seq": "2",
    //     "levelTitleZhtw": "二獎",
    //     "prizeNameZhtw": "法國高腳酒杯",
    //     "initCount": "1",
    //     "count": "1",
    //     "levelTitleEnus": "Second Prize",
    //     "prizeNameEnus": "French goblet",
    //     "levelTitleZhcn": "二奖",
    //     "prizeNameZhcn": "法国高脚酒杯"
    //   },
    //   {
    //     "seq": "3",
    //     "levelTitleZhtw": "三獎",
    //     "prizeNameZhtw": "711馬克杯",
    //     "initCount": "3",
    //     "count": "3",
    //     "levelTitleEnus": "Third Prize",
    //     "prizeNameEnus": "711 Mug",
    //     "levelTitleZhcn": "三奖",
    //     "prizeNameZhcn": "711马克杯"
    //   },
    //   {
    //     "seq": "4",
    //     "levelTitleZhtw": "四獎",
    //     "prizeNameZhtw": "小禮物(模型/達達虎集線器/背貼支架/資料夾)",
    //     "initCount": "4",
    //     "count": "4",
    //     "levelTitleEnus": "Fourth Prize",
    //     "prizeNameEnus": "Small gift (model/Dada tiger hub/back bracket/folder)",
    //     "levelTitleZhcn": "四奖",
    //     "prizeNameZhcn": "小礼物(模型/达达虎集线器/背贴支架/资料夹)"
    //   },
    //   {
    //     "seq": "5",
    //     "levelTitleZhtw": "參加獎",
    //     "prizeNameZhtw": "零食(樂天蛋黃派 / 樂天巧克力派)",
    //     "initCount": "28",
    //     "count": "28",
    //     "levelTitleEnus": "Consolation prize",
    //     "prizeNameEnus": "Snacks (Lotte Custard Pie / Lotte Chocolate Pie)",
    //     "levelTitleZhcn": "参加奖",
    //     "prizeNameZhcn": "零食(乐天蛋黄派 / 乐天巧克力派)"
    //   }
    // ];
    // setPrizes(fakeData);
    //#endregion
  }, []);



  const renderPrizeList = () => {
    return _.map(prizes, (_prize, _i) => {
      return (
        <ListItem key={_i}>
          <ListItemAvatar>
            <Avatar style={_i <= 2 ? { backgroundColor: "orange" } : {}}>
              {/* renderIcon() */_i + 1}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={_prize[prizeMapping[language]['levelTitle']] + "　" + _prize[prizeMapping[language]['prizeName']]}
          />
          <ListItemSecondaryAction>
            {intl.get('prize.count')}: {_prize.count}
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  }

  const weightedRandom = () => {
    let [totalWeight, randomArray] = _.reduce(prizes, (result, _prize, _index) => {
      _prize.count = _.toNumber(_prize.count);
      let [_totalWeight, _randomArray] = result;
      _totalWeight = _totalWeight + _prize.count;
      _randomArray = _.concat([], _randomArray, _.times(_prize.count, () => _index));
      return [_totalWeight, _randomArray];
    }, [0, []]);

    let randomNumber = _.floor(_.random(0, 1, true) * totalWeight);
    let prizeIndex = randomArray[randomNumber];
    let _getPrize = prizes[prizeIndex];
    console.log(totalWeight, randomArray, randomNumber, prizeIndex, _getPrize);

    formResult.getPrize = _getPrize;
    formResult.step2IsComplete = true;

    saveFormResult(formResult);

    async function saveDB() {
      console.log('formResult', formResult);

      let _prizes = await fetchUrl({ url: `${global.apiUrl}/updatePrizeCount.php?seq=${formResult.getPrize.seq}` });
      setContext(prevContext => { return { ...prevContext, prizes: _prizes } });

      await fetchUrl({
        url: `${global.apiUrl}/questionaire`, method: 'POST', data: {
          employeeId: formResult.Q1,
          ifLikeMovies: formResult.Q2,
          movieType: formResult.Q3,
          favoriteMovie: formResult.Q4,
          advice: formResult.Q5 || "",
          prizeSeq: formResult.getPrize.seq
        }
      });
    }

    saveDB();
  }

  const onTogglePlay = () => {
    setPlay(!play);
    if (play) {
      setAlreadyDraw(true);
      weightedRandom();
    }
  }

  return (
    <React.Fragment>
      <Typography variant="h6" className={classes.title}>
        {intl.get('prize.listTitle')}
      </Typography>
      <div className={classes.demo}>
        <List dense={false}>
          {renderPrizeList()}
        </List>
      </div>
      <div id="drawRegion" align="center">
        <Typography variant="h6" className={classes.title} hidden={alreadyDraw}>
          {play ? intl.get('prize.stopBtnText') : intl.get('prize.drawBtnText')}
        </Typography>
        {!alreadyDraw ?
          <GifPlayer autoplay={false}
            onTogglePlay={() => { onTogglePlay() }}
            gif={`${process.env.PUBLIC_URL}/luckyDraw.gif`}
            still={`${process.env.PUBLIC_URL}/still.gif`}
          /> :
          <Paper className={classes.paper}>
            {intl.get('prize.congratulation')} {formResult.getPrize[prizeMapping[language]['levelTitle']]} {formResult.getPrize[prizeMapping[language]['prizeName']]}
          </Paper>
        }
      </div>
    </React.Fragment>
  );
}