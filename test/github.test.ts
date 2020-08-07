import nock from 'nock'

import { formatNameWithOwner, getIssueUrls, GraphQlQueryResponseData } from '../src/github'

let requestBody: nock.Body

function graphqlNock(returnValue: GraphQlQueryResponseData): void {
  nock('https://api.github.com')
    .post('/graphql')
    .reply(200, (_, body) => {
      requestBody = body

      return returnValue
    })
}

describe('getIssueUrls', () => {
  const mockToken = '1234567890abcdef'
  const testQuery = 'label:weekly-issue'

  beforeEach(() => {
    Object.assign(process.env, {
      GITHUB_REPOSITORY: 'test-owner/test-repo',
      GITHUB_ACTION: 'select-matching-issues',
    })
  })

  it('returns the list of urls', async () => {
    graphqlNock({
      data: {
        search: {
          nodes: [
            {
              url: 'https://github.com/test-owner/test-repo/issues/1219',
            },
            {
              url: 'https://github.com/test-owner/test-repo/issues/1213',
            },
            {
              url: 'https://github.com/test-owner/test-repo/issues/1207',
            },
            {
              url: 'https://github.com/test-owner/test-repo/issues/1198',
            },
          ],
        },
      },
    })

    const urls = await getIssueUrls(mockToken, testQuery)

    expect((requestBody as Record<string, any>).variables.searchQuery).toBe(
      `repo:test-owner/test-repo ${testQuery}`
    )
    expect(urls).toStrictEqual([
      'https://github.com/test-owner/test-repo/issues/1219',
      'https://github.com/test-owner/test-repo/issues/1213',
      'https://github.com/test-owner/test-repo/issues/1207',
      'https://github.com/test-owner/test-repo/issues/1198',
    ])
  })

  it('returns an empty array when no urls are returned', async () => {
    graphqlNock({
      data: {
        search: {
          nodes: [],
        },
      },
    })

    const numbers = await getIssueUrls(mockToken, testQuery)

    expect((requestBody as Record<string, any>).variables.searchQuery).toBe(
      `repo:test-owner/test-repo ${testQuery}`
    )
    expect(numbers).toStrictEqual([])
  })
})

describe('formatNameWithOwner', () => {
  it('formats the text correctly', () => {
    const text = formatNameWithOwner({ owner: 'owner-name', repo: 'repo-name' })

    expect(text).toBe('owner-name/repo-name')
  })
})
