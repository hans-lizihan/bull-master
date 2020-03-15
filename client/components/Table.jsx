import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

function EnhancedTableHead({
  columns,
  onSelectAllClick,
  numSelected,
  rowCount,
}) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {columns.map(column => (
          <TableCell
            key={`table-header-${column.field}`}
            align={column.numeric ? 'right' : 'left'}
          >
            {column.title}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const columnsType = PropTypes.arrayOf(
  PropTypes.shape({
    render: PropTypes.func,
    field: PropTypes.string,
    title: PropTypes.string,
  }),
);
EnhancedTableHead.propTypes = {
  columns: columnsType.isRequired,
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = ({ numSelected, title, actions }) => {
  const classes = useToolbarStyles();
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          {title}
        </Typography>
      )}

      {numSelected > 0 && actions}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.node).isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable({
  rowsPerPageOptions,
  data,
  columns,
  totalCount,
  rowsPerPage,
  page,
  onChangePage,
  onChangeRowsPerPage,
  actions,
  title,
  size,
}) {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);

  // TODO: move selected countrol outside
  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = data.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          title={title}
          actions={actions}
          numSelected={selected.length}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={size}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              columns={columns}
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={data.length}
            />
            <TableBody>
              {data.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    {columns.map(({ render, field, ...rest }) => (
                      <TableCell key={field} {...rest}>
                        {render ? render(row[field || ''], row) : row[field]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

EnhancedTable.propTypes = {
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
  columns: columnsType.isRequired,
  totalCount: PropTypes.number,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
};

EnhancedTable.defaultProps = {
  title: '',
  rowsPerPageOptions: [5, 20, 50],
  actions: [],
  size: 'small',
  totalCount: 0,
};
