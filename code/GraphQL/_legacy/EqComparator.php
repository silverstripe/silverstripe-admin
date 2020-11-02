<?php


namespace SilverStripe\Admin\GraphQL;

use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\TypeCreator;

if (!class_exists(TypeCreator::class)) {
    return;
}

/**
 * Class EqComparator
 * @package SilverStripe\Admin\GraphQL
 * This class shims the schema with GraphQL 4 compatable filtering
 */
class EqComparator extends TypeCreator
{
    protected $inputObject = true;

    public function attributes()
    {
        return [
            'name' => 'EqComparator',
        ];
    }

    public function fields()
    {
        return [
            'eq' => ['type' => Type::nonNull(Type::id())],
        ];
    }
}
