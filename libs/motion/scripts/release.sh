#! /usr/bin/bash

# 选择要发布的 npm 包版本
VERSION=`npx select-version-cli`

# 二次确认提示
read -n 1 -p "Release js-motion v$VERSION ? (y/n)" sure
echo # new line
if [[ $sure =~ ^[Yy]$ ]]
then
  echo "Releasing v$VERSION ..."

  # build
  npm run build

  # npm version
  npm version $VERSION -m "[release] v$VERSION"

  # npm publish
  npm publish

  # git push
  git push origin master --tags
fi