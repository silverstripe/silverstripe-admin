<?php

namespace SilverStripe\Admin\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\GraphQL\OperationResolver;
use SilverStripe\GraphQL\Scaffolding\Scaffolders\CRUD\ReadOne;
use SilverStripe\GraphQL\Scaffolding\StaticSchema;
use SilverStripe\ORM\DataObject;
use Symfony\Component\VarDumper\Cloner\Data;

if (!class_exists(ReadOne::class)) {
    return;
}

/**
 * Shim to make readOne work like GraphQL 4
 *
 * @deprecated 4.8..5.0 Use silverstripe/graphql:^4 functionality.
 */
class ReadOneLegacyResolver implements OperationResolver
{
    /**
     * @var DataObject
     */
    protected $dataObject;

    public function __construct(DataObject $dataObject)
    {
        $this->dataObject = $dataObject;
    }

    public function resolve($object, array $args, $context, ResolveInfo $info)
    {
        if (!$this->dataObject->canView($context['currentUser'])) {
            throw new \Exception(sprintf('Cannot view %s', $this->dataObject->singular_name()));
        }

        $idKey = StaticSchema::inst()->formatField('ID');
        $id = $args['filter'][$idKey]['eq'];
        $readOne = Injector::inst()->createWithArgs(ReadOne::class, [$this->dataObject->baseClass()]);
        unset($args['filter']);
        $args[$idKey] = $id;

        return $readOne->resolve($object, $args, $context, $info);
    }
}
