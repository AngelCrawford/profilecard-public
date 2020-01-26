#!/bin/bash
echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# Empty the public folder
rm -rf public

# Build the project.
hugo

# Add changes to git.
git add --all

# Commit changes.
msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -am "$msg"

# Push source and build repos.
git push origin master
git subtree push --prefix=public git@github.com:AngelCrawford/profilecard-public.git gh-pages
