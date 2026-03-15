<?php

namespace SilverStripe\Admin\Forms;

use RuntimeException;

use SilverStripe\Forms\DatalessField;

/**
 * A visual indicator to show whether a form has unsaved changes.
 */
class UnsavedChangesIndicator extends DatalessField
{
    /**
     * An associative array of time periods to determine when the notice displays, and when it updates to a warning.
     * notice: The number of minutes it takes to display the notice after starting to edit a form
     * warning: The number of minutes it takes to update the display to a warning after displaying the notice.
     */
    private static array $minutes = [
        'notice' => 5,
        'warning' => 10,
    ];

    protected $schemaComponent = 'UnsavedChangesIndicator';

    public function __construct()
    {
        // This field must be named 'UnsavedChangesIndicator' in order for
        // applyTransforms.js to find and update it
        return parent::__construct('UnsavedChangesIndicator');
    }

    public function getSchemaDataDefaults()
    {
        // This is used for initialising the React component
        // Refer UnsavedChangesIndicator.js
        $data = parent::getSchemaDataDefaults();
        $data['minutes'] = $this->getMinutes();
        return $data;
    }

    public function getAttributes()
    {
        // This is used for entwine initialisation
        // Refer UnsavedChangesIndicatorEntwine.js
        $attributes = parent::getAttributes();
        $attributes['data-minutes'] = json_encode($this->getMinutes());
        return $attributes;
    }

    private function getMinutes(): array
    {
        $minutes = static::config()->get('minutes');
        $this->validateConfig($minutes);
        return $minutes;
    }

    private function validateConfig(array $minutes): void
    {
        if (!array_key_exists('notice', $minutes) || !array_key_exists('warning', $minutes)) {
            throw new RuntimeException('minutes config must contain both "notice" and "warning" keys');
        }
        // Allow decimals here for partial minutes, as this is required for behat
        // testing and development so that we don't have to wait long periods of time
        if (!is_numeric($minutes['notice']) || !is_numeric($minutes['warning'])) {
            throw new RuntimeException('minutes config values must be numeric');
        }
        if ($minutes['notice'] < 0 || $minutes['warning'] < 0) {
            throw new RuntimeException('minutes config values must be positive or zero');
        }
        if ($minutes['warning'] !== 0 && $minutes['warning'] < $minutes['notice']) {
            throw new RuntimeException('minutes config "warning" value must be greater than or equal to "notice" value');
        }
    }
}
