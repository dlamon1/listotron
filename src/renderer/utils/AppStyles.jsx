import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  notchedOutline: {
    borderWidth: '1px',
    borderColor: '#eee !important',
  },
  root: {
    width: '100%',
  },
  heading: {},
  over: {
    display: 'block',
    width: 200,
    // white-space: 'nowrap',
    overflow: 'hidden',
    textoverflow: 'ellipsis',
  },
});
