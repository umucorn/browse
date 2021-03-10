import prettyBytes from 'pretty-bytes';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Paper,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import {
  FileCopy as FileCopyIcon,
  Folder as FolderIcon,
} from '@material-ui/icons/';
import {
  stableSort,
  getComparator,
} from '../utils';
import EnhancedTableHead from './EnhancedTableHead';

const headCells = [
  {
    id: 'name', numeric: false, disablePadding: true, label: 'Name',
  },
  {
    id: 'size', numeric: true, disablePadding: false, label: 'Size',
  },
  {
    id: 'lastModified', numeric: true, disablePadding: false, label: 'Last Modified',
  },
  {
    id: 'isDirectory', numeric: true, disablePadding: false, label: 'Type',
  },
];

const useStyles = makeStyles((theme) => ({
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
  row: {
    cursor: 'pointer',
    userSelect: 'none',
    '&:focus': {
      backgroundColor: '#97a1ff1c',
    },
  },
}));

export default function FilesystemTree({
  directory, directoryContent, isRootDirectory,
}) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const router = useRouter();

  if (!directoryContent) {
    directoryContent = [];
  }

  if (!isRootDirectory) {
    directoryContent = [
      {
        name: '..',
        isDirectory: true,
        path: '..',
      },
      ...directoryContent,
    ];
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, path, isDirectory, name) => {
    event.preventDefault();

    if (name === '..') {
      // Sorry, path module doesn't work as expected
      // and this is a custom way to go to the upper directory
      // - Umut
      const sep = directory.includes('/') ? '/' : '\\';
      let upperPath = directory.split(sep);
      if (upperPath[upperPath.length - 1] === '') {
        upperPath.pop();
      }
      upperPath.pop();
      upperPath = upperPath.join(sep);

      upperPath = upperPath.concat(sep);
      router.push(`/?path=${upperPath}`, undefined, {
        getServerSideProps: true,
      });
      return;
    }

    if (isDirectory) {
      router.push(`/?path=${path}`, undefined, {
        getServerSideProps: true,
      });
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              headCells={headCells}
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={directoryContent.length}
            />
            <TableBody>
              {stableSort(directoryContent, getComparator(order, orderBy))
                .map((row) => (
                  <TableRow
                    hover
                    role="button"
                    onClick={(event) => handleClick(
                      event,
                      row.path,
                      row.isDirectory,
                      row.name,
                    )}
                    onKeyPress={(event) => handleClick(
                      event,
                      row.path,
                      row.isDirectory,
                      row.name,
                    )}
                    tabIndex={0}
                    key={row.name}
                    className={classes.row}
                  >
                    <TableCell>
                      {row.isDirectory ? (
                        <FolderIcon />
                      ) : (
                        <FileCopyIcon />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">
                      {!row.isDirectory && prettyBytes(row.size, {
                        unix: true,
                        bits: false,
                        locale: 'en',
                      })}
                    </TableCell>
                    <TableCell align="right">{row.lastModified && new Date(row.lastModified).toLocaleString('en-US')}</TableCell>
                    <TableCell align="right">{row.isDirectory ? 'Directory' : 'File'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
