#! /usr/bin/bash

git checkout master
git merge dev

# 选择要发布的 npm 包版本
VERSION=`npx select-version-cli`

# 二次确认提示
read -n 1 -p "Release version v$VERSION ? (y/n)" sure
echo # new line
if [[ $sure =~ ^[Yy]$ ]]
then
  echo "Releasing v$VERSION ..."

  # npm version
  npm --no-git-tag-version version $VERSION

  # build dist and types
  npm run build

  # build changelog
  npm run changelog

  # commit changelog, types and package.json, package-lock.json(version info)
  git add -A
  git commit -m "[release] v$VERSION"

  # git tag
  git tag "v$VERSION"
  
  # git push
  git push
  git push --tags
  git checkout dev
  git rebase master
  git push

  # npm publish
  npm publish
fi