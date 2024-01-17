<?php

namespace SilverStripe\Forms;

use SilverStripe\Core\Extension;

/**
 * Will convert a SilverStripe message type into a Bootstrap alert type
 *
 * @extends Extension<Form|FormField>
 */
class FormMessageBootstrapExtension extends Extension
{
    /**
     * @var string[]
     */
    protected $bootstrapAlertsMap = [
        'good' => 'alert-success',
        'bad' => 'alert-danger',
        'required' => 'alert-danger',
        'warning' => 'alert-warning',
    ];

    /**
     * Maps a SilverStripe message type to a Bootstrap alert type
     *
     * {@inheritdoc}
     */
    public function getAlertType()
    {
        $type = $this->owner->getMessageType();

        if (isset($this->bootstrapAlertsMap[$type])) {
            return $this->bootstrapAlertsMap[$type];
        }

        // Fallback to original
        return $type;
    }
}
