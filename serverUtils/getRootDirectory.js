import path from 'path';

export default function getRootDirectory() {
  return path.parse(process.cwd()).root;
}
