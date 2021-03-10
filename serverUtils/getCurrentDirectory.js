import path from 'path';

export default function getCurrentDirectory() {
  return path.parse(process.cwd()).dir;
}
