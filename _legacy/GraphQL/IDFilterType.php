<?php


namespace SilverStripe\Admin\GraphQL;

use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\TypeCreator;

if (!class_exists(TypeCreator::class)) {
    return;
}

/**
 * Class IDFilterType
 * @package SilverStripe\Admin\GraphQL
 * This class shims the schema with GraphQL 4 compatible filtering, e.g. readOne
 *
 * @internal Use GraphQL v4 instead
 */
class IDFilterType extends TypeCreator
{
    protected $inputObject = true;

    public function attributes()
    {
        return [
            'name' => 'IDFilterType',
        ];
    }

    public function fields()
    {
        return [
            'id' => ['type' => Type::nonNull($this->manager->getType('EqComparator'))],
        ];
    }
}
