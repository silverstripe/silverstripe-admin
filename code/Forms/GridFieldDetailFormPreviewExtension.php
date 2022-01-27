<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\CMS\Controllers\SilverStripeNavigator;
use SilverStripe\Core\Extension;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\LiteralField;
use SilverStripe\ORM\CMSPreviewable;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\View\SSViewer;

class GridFieldDetailFormPreviewExtension extends Extension
{
    public function updateItemEditForm(Form $form): void
    {
        $record = $this->owner->getRecord();
        // See LeftAndMain::getEditForm()
        if ($record instanceof CMSPreviewable) {
            // Mark as previewable.
            $form->addExtraClass('cms-previewable');
            // Add preview controls.
            $navField = LiteralField::create('SilverStripeNavigator', $this->getSilverStripeNavigator());
            $navField->setAllowHTML(true);
            $form->Fields()->push($navField);
        }
    }

    private function getSilverStripeNavigator(): DBHTMLText
    {
        $navigator = SilverStripeNavigator::create($this->owner->getRecord());
        $templates = SSViewer::get_templates_by_class(LeftAndMain::class, '_SilverStripeNavigator', LeftAndMain::class);
        $renderWith = SSViewer::chooseTemplate($templates);
        return $navigator->renderWith($renderWith);
    }
}
