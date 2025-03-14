# Contributing Guide:

We welcome any and all contributions to the bot! Here we provide some basic steps and guidelines for code/language contributions. Please ensure that you follow any notices to ensure smooth approval of your PR!

## Adding New Localizations:

Adding support for new languages is a valuable contribution that helps make our bot more accessible to a wider audience. Note that Discord refers to languages as localizations.

To add new localizations:

1. Clone the repository - `git clone https://github.com/RahulR100/mcstatusbot`

2. Find the Discord locale code for the language you want to add - `https://discord.com/developers/docs/reference#locales`

    - We are only able to support languages recognised by Discord. If Discord does not have a locale for your language, our bot cannot support it. Any pull requests using a language code outside the Discord supported list will be rejected.

3. Make a new branch for your changes using the following pattern (github username_locale code) - `git checkout -b <github username_locale code>`

4. Make changes to locale files - These files are located in the localizations folder. Open each file and add a new entry in each exported variable for your language using the pre-existing example.

    - Follow any comments in the files for lowercase naming.

5. Stage, commit, and push your changes.

    - ```
        git add .
        git commit -m "<a message for commit here>"
        git push
      ```
    - On your first push, depending on your git configuration, you might have to use `git push --set-upstream origin <your_branch_name>` where `your_branch_name` should be the same as `your_locale_code` from earlier.

6. Create a pull request on github from your branch to the main branch.

7. Upon review, the pull request will be merged into the production bot and the branch deleted.

### Notices:

- Only add / modify one language at a time.
- Do not edit any other files / code in a language PR. Open a separate PR for code modifications.
- Do not add or delete any files.
- Do not include profane language in a translation. We will check. First offense will lead to rejection of PR with warning. Any further offense will result in a ban.
- Multiple PRs for the same language will be treated in the order they were received. Should the merge of a prior PR for your language cause a conflict with your PR, we will notify you with a comment and allow you to correct your translations.
- Should there be minor errors in the PR, we will add a comment and allow you to correct the PR.
- Once merged, the bot will incorporate the changes into the subsequent monthly update. Depending on when your changes are accepted, they might take a few weeks to show up.

Thank you for your contribution! When your PR is merged, you will automatically be listed as a contributor! If you have any questions, please open a github issue.
