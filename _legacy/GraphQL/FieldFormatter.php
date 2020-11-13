<?php


namespace SilverStripe\Admin\GraphQL;

use SilverStripe\Core\Convert;

/**
 * @internal Use GraphQL v4 instead
 */
class FieldFormatter
{
    /**
     * A couple of hacks to make sure ID gets formatted correctly, since it's so common.
     * @param string $field
     * @return string
     */
    public static function format(string $field): string
    {
        if (strtolower($field) === 'id') {
            return 'id';
        }
        if (strtolower($field) === 'ids') {
            return 'ids';
        }

        return Convert::upperCamelToLowerCamel($field);
    }
}
