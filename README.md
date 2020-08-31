# Select Matching Issues

A GitHub Action to select issues matching a query.

## Use

By specifying the `query` and `token` to use, you can output the list of matching issues. The list of matching issues is stored in a file because the output could potentially be quite large. The location of the file is written to the `path` output.

### Setting the file location yourself

By specifying the `path` input, you can set the path where the output is stored. Whatever is specified as the `path` input is also returned as the `path` output.

### Configuring the output format

There are two output formats: `raw` and `list`. The default format is `raw`. The `raw` format writes the full URL of each matching Issue, one Issue per line. The `list` format writes the matching Issues in a Markdown unordered list, with each item being a link using the title of the Issue as the link text and the URL being the link target.

### Examples

#### Closing a list of matching issues

```yaml
jobs:
  closeBugs:
    name: Close all issues labeled "bug"
    runs-on: ubuntu-latest
    steps:
      - name: Find all bugs
        id: bugs
        uses: lee-dohm/select-matching-issues@v1
        with:
          query: 'label:bug'
          token: ${{ github.token }}
      - name: Close found issues
        run: cat ${{ steps.bugs.outputs.path }} | xargs gh issue close
```

Example output:

```markdown
https://github.com/octocat/spoon-knife/issues/1
https://github.com/octocat/spoon-knife/issues/3
https://github.com/octocat/spoon-knife/issues/9
```

#### Create a Markdown list of issues labeled `out-of-office`

```yaml
jobs:
  markdownList:
    name: List issues labeled "out-of-office"
    runs-on: ubuntu-latest
    steps:
      - name: List out-of-office issues
        id: ooo_list
        uses: lee-dohm/select-matching-issues@v1
        with:
          format: list
          query: 'label:out-of-office'
          token: ${{ github.token }}
```

Example output:

```markdown
- [@octocat OoO Jan 1 through Jan 31](https://github.com/octocat/spoon-knife/issues/1)
- [@lee-dohm OoO Feb 1 through Feb 28](https://github.com/octocat/spoon-knife/issues/3)
```

## License

[MIT](LICENSE.md)
