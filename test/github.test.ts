import nock from 'nock'

import { formatNameWithOwner, getMatchingIssues, GraphQlQueryResponseData } from '../src/github'

let requestBodies: nock.Body[] = []

function graphqlNock(...returnValues: GraphQlQueryResponseData[]): void {
  const n = nock('https://api.github.com')

  returnValues.forEach((returnValue) => {
    n.post('/graphql').reply(200, (_, body) => {
      requestBodies.push(body)

      return returnValue
    })
  })
}

describe('getMatchingIssues', () => {
  const fakeEndCursor = 'fakeEndCursor'
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
          pageInfo: {
            hasNextPage: false,
            endCursor: fakeEndCursor
          },
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
    const requestBody = requestBodies[0] as Record<string, any>

    expect(requestBody.variables.searchQuery).toBe(`repo:test-owner/test-repo ${testQuery}`)
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
          pageInfo: {
            hasNextPage: false,
            endCursor: fakeEndCursor
          },
          nodes: []
        }
      }
    })

    const issues = await getMatchingIssues(mockToken, testQuery)
    const requestBody = requestBodies[0] as Record<string, any>

    expect(requestBody.variables.searchQuery).toBe(`repo:test-owner/test-repo ${testQuery}`)
    expect(issues).toStrictEqual([])
  })

  it('paginates through results', async () => {
    graphqlNock(
      {
        data: {
          search: {
            pageInfo: {
              hasNextPage: true,
              endCursor: fakeEndCursor
            },
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
      },
      {
        data: {
          search: {
            pageInfo: {
              hasNextPage: false,
              endCursor: fakeEndCursor
            },
            nodes: [
              {
                title: 'Foo',
                url: 'https://github.com/test-owner/test-repo/issues/1197'
              },
              {
                title: 'Bar',
                url: 'https://github.com/test-owner/test-repo/issues/1196'
              },
              {
                title: 'Baz',
                url: 'https://github.com/test-owner/test-repo/issues/1195'
              },
              {
                title: 'Quux',
                url: 'https://github.com/test-owner/test-repo/issues/1194'
              }
            ]
          }
        }
      }
    )

    const issues = await getMatchingIssues(mockToken, testQuery)

    requestBodies.forEach((requestBody) => {
      expect((requestBody as Record<string, any>).variables.searchQuery).toBe(
        `repo:test-owner/test-repo ${testQuery}`
      )
    })

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
      },
      {
        title: 'Foo',
        url: 'https://github.com/test-owner/test-repo/issues/1197'
      },
      {
        title: 'Bar',
        url: 'https://github.com/test-owner/test-repo/issues/1196'
      },
      {
        title: 'Baz',
        url: 'https://github.com/test-owner/test-repo/issues/1195'
      },
      {
        title: 'Quux',
        url: 'https://github.com/test-owner/test-repo/issues/1194'
      }
    ])
  })
})

describe('formatNameWithOwner', () => {
  it('formats the text correctly', () => {
    const text = formatNameWithOwner({ owner: 'owner-name', repo: 'repo-name' })

    expect(text).toBe('owner-name/repo-name')
  })
})
