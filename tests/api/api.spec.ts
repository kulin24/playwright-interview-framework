import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/pages/api/ApiClient';

test.describe('API Tests @regression', () => {
  
  test('GET - fetch posts @api', async ({ request }) => {
    // Create API client instance
    const api = new ApiClient(request, 'https://jsonplaceholder.typicode.com');
    
    // Make GET request
    const response = await api.get('/posts/1');
    
    // Verify response
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.id).toBe(1);
    expect(data.title).toBeDefined();
    
    console.log('✅ GET test passed:', data.title);
  });
  
  test('POST - create a new post @api', async ({ request }) => {
    const api = new ApiClient(request, 'https://jsonplaceholder.typicode.com');
    
    const newPost = {
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1
    };
    
    const response = await api.post('/posts', newPost);
    
    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.title).toBe(newPost.title);
    
    console.log('✅ POST test passed: Created post with ID', data.id);
  });
  
  test('GET - verify posts array @api', async ({ request }) => {
    const api = new ApiClient(request, 'https://jsonplaceholder.typicode.com');
    
    const response = await api.get('/posts');
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
    
    // Verify first post structure
    const firstPost = posts[0];
    expect(firstPost).toHaveProperty('id');
    expect(firstPost).toHaveProperty('title');
    expect(firstPost).toHaveProperty('body');
    expect(firstPost).toHaveProperty('userId');
    
    console.log('✅ GET array test passed:', posts.length, 'posts found');
  });
});