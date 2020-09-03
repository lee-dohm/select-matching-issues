import nock from 'nock'

import { formatNameWithOwner, getMatchingIssues, GraphQlQueryResponseData } from '../src/github'

let requestBody: nock.Body

function graphqlNock(returnValue: GraphQlQueryResponseData): void {
  nock('https://api.github.com')
    .post('/graphql')
    .reply(200, (_, body) => {
      requestBody = body

      return returnValue
    })
}

describe('getMatchingIssues', () => {
  const mockToken = '1234567890abcdef'
  const testQuery = 'label:weekly-issue'

  beforeEach(() => {
    Object.assign(process.env, {
      GITHUB_REPOSITORY: 'test-owner/test-repo',
      GITHUB_ACTION: 'select-matching-issues'
    })
  })

  it('returns the list of issues', async () => {
    graphqlNock({
      data: {
        search: {
          nodes: [
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
        }
      }
    })

    const issues = await getMatchingIssues(mockToken, testQuery)

    expect((requestBody as Record<string, any>).variables.searchQuery).toBe(
      `repo:test-owner/test-repo ${testQuery}`
    )
    expect(issues).toStrictEqual([
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
    ])
  })

  it('returns an empty array when no urls are returned', async () => {
    graphqlNock({
      data: {
        search: {
          nodes: []
        }
      }
    })

    const issues = await getMatchingIssues(mockToken, testQuery)

    expect((requestBody as Record<string, any>).variables.searchQuery).toBe(
      `repo:test-owner/test-repo ${testQuery}`
    )
    expect(issues).toStrictEqual([])
  })
})

describe('formatNameWithOwner', () => {
  it('formats the text correctly', () => {
    const text = formatNameWithOwner({ owner: 'owner-name', repo: 'repo-name' })

    expect(text).toBe('owner-name/repo-name')
  })
})
