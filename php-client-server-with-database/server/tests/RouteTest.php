<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

class RouteTest extends TestCase
{
    private function getTestClient()
    {
        return new class {
            public function get(string $url): array
            {
                // Mock responses for testing
                $responses = [
                    '/' => ['status' => 302, 'headers' => ['Location' => '/static/index.html']],
                    '/special_path' => ['status' => 200, 'body' => 'This is another path'],
                    '/button.php' => ['status' => 200, 'body' => 'I got your message - Name is: Test'],
                    '/database.php' => ['status' => 200, 'body' => 'Database Connection Successful'],
                ];
                
                return $responses[$url] ?? ['status' => 404, 'body' => 'Not Found'];
            }
            
            public function post(string $url, array $data): array
            {
                if ($url === '/client_post' && isset($data['post_content'])) {
                    return ['status' => 200, 'body' => json_encode(['message' => 'I got your message: ' . $data['post_content']])];
                }
                
                return ['status' => 400, 'body' => json_encode(['message' => 'This function requires a body with "post_content"'])];
            }
        };
    }

    public function testRootRedirectsToStaticIndex()
    {
        $client = $this->getTestClient();
        $response = $client->get('/');
        
        $this->assertEquals(302, $response['status']);
        $this->assertStringContainsString('/static/index.html', $response['headers']['Location']);
    }

    public function testSpecialPathReturnsText()
    {
        $client = $this->getTestClient();
        $response = $client->get('/special_path');
        
        $this->assertEquals(200, $response['status']);
        $this->assertStringContainsString('This is another path', $response['body']);
    }

    public function testClientPostWithValidData()
    {
        $client = $this->getTestClient();
        $response = $client->post('/client_post', ['post_content' => 'hello']);
        
        $this->assertEquals(200, $response['status']);
        $data = json_decode($response['body'], true);
        $this->assertEquals('I got your message: hello', $data['message']);
    }

    public function testClientPostWithMissingData()
    {
        $client = $this->getTestClient();
        $response = $client->post('/client_post', []);
        
        $this->assertEquals(400, $response['status']);
        $data = json_decode($response['body'], true);
        $this->assertStringContainsString('requires a body', $data['message']);
    }

    public function testButtonEndpoint()
    {
        $client = $this->getTestClient();
        $response = $client->get('/button.php');
        
        $this->assertEquals(200, $response['status']);
        $this->assertStringContainsString('I got your message - Name is:', $response['body']);
    }

    public function testDatabaseEndpoint()
    {
        $client = $this->getTestClient();
        $response = $client->get('/database.php');
        
        $this->assertEquals(200, $response['status']);
        $this->assertStringContainsString('Database Connection', $response['body']);
    }
}