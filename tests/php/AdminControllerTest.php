<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\Dev\FunctionalTest;
use SilverStripe\Security\Member;
use SilverStripe\Control\HTTPResponse_Exception;
use ReflectionObject;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\DataProvider;
use SilverStripe\Admin\CMSProfileController;
use SilverStripe\Admin\SecurityAdmin;
use SilverStripe\Admin\Tests\LeftAndMainTest\DualPermissionAdminController;
use SilverStripe\Admin\Tests\LeftAndMainTest\TestAdminController;

class AdminControllerTest extends FunctionalTest
{
    protected static $fixture_file = 'AdminControllerTest.yml';

    public static function provideCanView(): array
    {
        return [
            'logged out' => [
                'fixtureName' => null,
                'allowed' => [],
            ],
            'no-access user' => [
                'fixtureName' => 'noaccessuser',
                'allowed' => [],
            ],
            'restricted CMS user' => [
                'fixtureName' => 'securityonlyuser',
                'allowed' => [
                    CMSProfileController::class,
                    SecurityAdmin::class,
                ],
            ],
            'all cms sections user' => [
                'fixtureName' => 'allcmssectionsuser',
                'allowed' => [
                    TestAdminController::class,
                    DualPermissionAdminController::class,
                    CMSProfileController::class,
                    SecurityAdmin::class,
                ],
            ],
            'admin user' => [
                'fixtureName' => 'admin',
                'allowed' => [
                    TestAdminController::class,
                    DualPermissionAdminController::class,
                    CMSProfileController::class,
                    SecurityAdmin::class,
                ],
            ],
            'permission1 user (missing permission2)' => [
                'fixtureName' => 'permission1user',
                'allowed' => [],
            ],
            'permission2 user (missing permission1)' => [
                'fixtureName' => 'permission2user',
                'allowed' => [],
            ],
            'permission1 and 2 user user' => [
                'fixtureName' => 'permission1and2user',
                'allowed' => [
                    DualPermissionAdminController::class,
                ],
            ],
        ];
    }

    #[DataProvider('provideCanView')]
    public function testCanView(?string $fixtureName, array $allowed): void
    {
        $allControllers = [
            CMSProfileController::class,
            SecurityAdmin::class,
            TestAdminController::class,
            DualPermissionAdminController::class,
        ];
        $this->logOut();
        $user = null;
        if ($fixtureName !== null) {
            $user = $this->objFromFixture(Member::class, $fixtureName);
            $this->logInAs($user);
        }

        foreach ($allowed as $allowedClass) {
            $this->assertTrue($allowedClass::singleton()->canView(), 'Tried to access ' . $allowedClass);
        }
        $disallowed = array_diff($allControllers, $allowed);
        foreach ($disallowed as $disallowedClass) {
            $this->assertFalse($disallowedClass::singleton()->canView(), 'Tried to access ' . $disallowedClass);
        }
    }

    public static function provideJsonSuccess(): array
    {
        return [
            [
                'statusCode' => 201,
                'data' => null,
                'expectedBody' => '',
                'expectedException' => '',
            ],
            [
                'statusCode' => 200,
                'data' => [],
                'expectedBody' => '[]',
                'expectedException' => '',
            ],
            [
                'statusCode' => 200,
                'data' => [1, "two", 3.3],
                'expectedBody' => '[1,"two",3.3]',
                'expectedException' => '',
            ],
            [
                'statusCode' => 200,
                'data' => ['foo' => 'bar', 'quotes' => '"something"', 'array' => [1, 2, 3]],
                'expectedBody' => '{"foo":"bar","quotes":"\"something\"","array":[1,2,3]}',
                'expectedException' => '',
            ],
            [
                'statusCode' => 200,
                'data' => ['unicode' => ['one' => 'ōōō', 'two' => '℅℅℅', 'three' => '👍👍👍']],
                'expectedBody' => '{"unicode":{"one":"ōōō","two":"℅℅℅","three":"👍👍👍"}}',
                'expectedException' => '',
            ],
            [
                'statusCode' => 199,
                'data' => [],
                'expectedBody' => '',
                'expectedException' => InvalidArgumentException::class,
            ],
            [
                'statusCode' => 302,
                'data' => [],
                'expectedBody' => '',
                'expectedException' => InvalidArgumentException::class,
            ],
        ];
    }

    #[DataProvider('provideJsonSuccess')]
    public function testJsonSuccess(
        int $statusCode,
        ?array $data,
        string $expectedBody,
        string $expectedException
    ): void {
        $controller = new TestAdminController();
        $refelectionObject = new ReflectionObject($controller);
        $method = $refelectionObject->getMethod('jsonSuccess');
        $method->setAccessible(true);
        if ($expectedException) {
            $this->expectException($expectedException);
        }
        $response = $method->invoke($controller, $statusCode, $data);
        $this->assertSame('application/json', $response->getHeader('Content-type'));
        $this->assertSame($statusCode, $response->getStatusCode());
        $this->assertSame($expectedBody, $response->getBody());
    }

    public static function provideJsonError(): array
    {
        return [
            [
                'statusCode' => 400,
                'errorMessage' => '',
                'expectedValue' => 'Sorry, it seems there was something wrong with the request.',
            ],
            [
                'statusCode' => 401,
                'errorMessage' => '',
                'expectedValue' => 'Sorry, it seems you are not authorised to access this section or object.',
            ],
            [
                'statusCode' => 403,
                'errorMessage' => '',
                'expectedValue' => 'Sorry, it seems the action you were trying to perform is forbidden.',
            ],
            [
                'statusCode' => 404,
                'errorMessage' => '',
                'expectedValue' => 'Sorry, it seems you were trying to access a section or object that doesn\'t exist.',
            ],
            [
                'statusCode' => 500,
                'errorMessage' => '',
                'expectedValue' => 'Sorry, it seems there was an internal server error.',
            ],
            [
                'statusCode' => 503,
                'errorMessage' => '',
                'expectedValue' => 'Sorry, it seems the service is temporarily unavailable.',
            ],
            [
                'statusCode' => 418,
                'errorMessage' => '',
                'expectedValue' => 'Sorry, it seems there was a 418 error.',
            ],
            [
                'statusCode' => 400,
                'errorMessage' => 'Test custom error message',
                'expectedValue' => 'Test custom error message',
            ],
        ];
    }

    #[DataProvider('provideJsonError')]
    public function testJsonError(
        int $statusCode,
        string $errorMessage,
        ?string $expectedValue,
    ): void {
        $controller = new TestAdminController();
        $refelectionObject = new ReflectionObject($controller);
        $method = $refelectionObject->getMethod('jsonError');
        $method->setAccessible(true);
        $this->expectException(HTTPResponse_Exception::class);
        $expectedMessage = json_encode((object) [
            'status' => 'error',
            'errors' => [
                (object) [
                    'type' => 'error',
                    'code' => $statusCode,
                    'value' => $expectedValue,
                ],
            ],
        ]);
        $this->expectExceptionMessage($expectedMessage);
        $method->invoke($controller, $statusCode, $errorMessage);
    }
}
