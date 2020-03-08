import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';

export default createMuiTheme({
  palette: {
    primary: {
      main: blueGrey[900],
    },
    secondary: grey,
  },
});
