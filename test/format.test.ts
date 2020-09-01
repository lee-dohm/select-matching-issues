import * as format from '../src/format'

const issues = [
  {
    title: 'Foo',
    url: 'https://github.com/test-owner/test-repo/issues/1219'
  },
  {
    title: 'Bar',
    url: 'https://github.com/test-owner/test-repo/issues/1213'
  },
  {
    title: 'Baz',
    url: 'https://github.com/test-owner/test-repo/issues/1207'
  },
  {
    title: 'Quux',
    url: 'https://github.com/test-owner/test-repo/issues/1198'
  }
]

describe('list', () => {
  it('returns a list of Issue links', () => {
    const text = format.list(issues)

    expect(text).toBe(`- [Foo](https://github.com/test-owner/test-repo/issues/1219)
- [Bar](https://github.com/test-owner/test-repo/issues/1213)
- [Baz](https://github.com/test-owner/test-repo/issues/1207)
- [Quux](https://github.com/test-owner/test-repo/issues/1198)`)
  })

  it('returns an empty string when given an empty list', () => {
    expect(format.list([])).toBe('')
  })
})

describe('raw', () => {
  it('returns a list of Issue URLs', () => {
    const text = format.raw(issues)

    expect(text).toBe(`https://github.com/test-owner/test-repo/issues/1219
https://github.com/test-owner/test-repo/issues/1213
https://github.com/test-owner/test-repo/issues/1207
https://github.com/test-owner/test-repo/issues/1198`)
  })

  it('returns an empty string when given an empty list', () => {
    expect(format.raw([])).toBe('')
  })
})
