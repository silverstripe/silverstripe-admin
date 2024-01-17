<?php

namespace SilverStripe\Admin\Forms;

use InvalidArgumentException;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\FormFactory;

/**
 * Abstract form builder for insert link form
 */
abstract class LinkFormFactory implements FormFactory
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
        $form = Form::create($controller, $name, $fields, $actions, $validator);
        $form->addExtraClass('form--no-dividers');

        $this->extend('updateForm', $form, $controller, $name, $context);

        return $form;
    }

    abstract protected function getFormFields($controller, $name, $context);

    protected function getFormActions($controller, $name, $context)
    {
        $actions = FieldList::create([
            FormAction::create('insert', _t(__CLASS__.'.INSERT_LINK', 'Insert link'))
                ->setSchemaData(['data' => ['buttonStyle' => 'primary']]),
        ]);

        $this->extend('updateFormActions', $actions, $controller, $name, $context);

        return $actions;
    }

    protected function getValidator($controller, $name, $context)
    {
        return null;
    }

    public function getRequiredContext()
    {
        return [ 'RequireLinkText' ];
    }
}
