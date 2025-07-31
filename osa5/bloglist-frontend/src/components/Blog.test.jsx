// @vitest-environment jsdom
import '@testing-library/jest-dom'
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  test('renders blog title', () => {
    const blog = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 0,
      user: { name: 'Test User', username: 'testuser', id: '123' }
    }
    render(
      <Blog
        blog={blog}
        handleLike={() => {}}
        handleRemove={() => {}}
        user={{ username: 'testuser', id: '123' }}
      />
    )
    expect(screen.getByText(/Test Blog Title/)).toBeInTheDocument()
  })
})