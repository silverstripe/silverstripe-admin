<?php


namespace SilverStripe\Admin\GraphQL;

use SilverStripe\ORM\DataExtension;

/**
 * Remove when graphql 4 is in core. This just a bridge to help with backward compatability.
 * It injects a data- attribute into the document to allow early loaded JS files to use
 * conditionals.
 *
 * Coupling, but better than making this the concern of multiple modules.
 *
 * @internal
 */
class GraphQLLegacyExtension extends DataExtension
{
    /**
     * @return bool
     */
    public function GraphQLLegacy(): bool
    {
        return (boolean) $this->owner->config()->get('graphql_legacy');
    }
}
