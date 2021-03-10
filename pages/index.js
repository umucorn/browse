import {
  Typography,
  Container,
  Chip,
} from '@material-ui/core';

import pathFromNode from 'path';

import {
  getCurrentDirectory,
  getDirectoryContent,
  getRootDirectory,
} from '../serverUtils';

import { FilesystemTree } from '../components';

export default function Home({ directory, directoryContent, isRootDirectory }) {
  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        {directory}
        {' '}
        {isRootDirectory && <Chip label="Root Directory" />}
      </Typography>
      <FilesystemTree
        directory={directory}
        directoryContent={directoryContent}
        isRootDirectory={isRootDirectory}
      />
    </Container>
  );
}

export async function getServerSideProps({ query }) {
  const path = query?.path;
  const directory = path || getCurrentDirectory();
  const isRootDirectory = pathFromNode.resolve(getRootDirectory())
    === pathFromNode.resolve(directory);

  const directoryContent = await getDirectoryContent(directory);

  return {
    props: {
      directory,
      directoryContent,
      isRootDirectory,
    },
  };
}
