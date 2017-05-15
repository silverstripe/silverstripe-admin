<?php

namespace SilverStripe\Admin\Forms;

use InvalidArgumentException;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\TextField;

class EditorExternalLinkFormFactory implements FormFactory
{
    use Extensible;
    use Injectable;
    use Configurable;

    /**
     * @param RequestHandler $controller
     * @param string $name
     * @param array $context
     * @return Form
     */
    public function getForm(RequestHandler $controller = null, $name = FormFactory::DEFAULT_NAME, $context = [])
    {
        // Validate context
        foreach ($this->getRequiredContext() as $required) {
            if (!isset($context[$required])) {
                throw new InvalidArgumentException("Missing required context $required");
            }
        }

        $fields = $this->getFormFields($controller, $name, $context);
        $actions = $this->getFormActions($controller, $name, $context);
        $validator = $this->getValidator($controller, $name, $context);
        /** @var Form $form */
        $form = Form::create($controller, $name, $fields, $actions, $validator);
        $form->addExtraClass('form--no-dividers');

        return $form;
    }

    protected function getFormFields($controller, $name, $context)
    {
        $fields = FieldList::create([
            TextField::create('Link', _t(__CLASS__.'.URL', 'URL'), 'http://'),
            TextField::create(
                'Description',
                _t(__CLASS__.'.LINKDESCR', 'Link description')
            ),
            TextField::create('Anchor', _t(__CLASS__.'.ANCHORVALUE', 'Anchor')),
            CheckboxField::create(
                'TargetBlank',
                _t(__CLASS__.'.LINKOPENNEWWIN', 'Open in new window/tab')
            ),
        ]);

        return $fields;
    }

    protected function getFormActions($controller, $name, $context)
    {
        $actions = FieldList::create([
            FormAction::create('insert', _t(__CLASS__.'.INSERT_LINK', 'Insert link'))
                ->setSchemaData(['data' => ['buttonStyle' => 'primary']]),
        ]);

        return $actions;
    }

    protected function getValidator($controller, $name, $context)
    {
        return null;
    }

    public function getRequiredContext()
    {
        return [];
    }
}
