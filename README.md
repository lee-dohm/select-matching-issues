# Select Matching Issues

A GitHub Action to select issues matching a query.

## Use

### Examples

Closing a list of matching issues:

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
        query: "label:bug"
        token: ${{ github.token }}
    - name: Close found issues
      run: cat ${{ steps.bugs.outputs.path }} | xargs gh issue close
```

## License

[MIT](LICENSE.md)
