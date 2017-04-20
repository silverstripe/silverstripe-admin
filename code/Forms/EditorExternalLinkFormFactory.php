<?php

namespace SilverStripe\Admin\Forms;

use InvalidArgumentException;
use SilverStripe\Control\Controller;
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
     * @param Controller $controller
     * @param string $name
     * @param array $context
     * @return Form
     */
    public function getForm(Controller $controller, $name = FormFactory::DEFAULT_NAME, $context = [])
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
        
        return $form;
    }
    
    protected function getFormFields($controller, $name, $context)
    {
        $fields = FieldList::create([
            TextField::create('Link', _t('HTMLEditorField.URL', 'URL'), 'http://'),
            TextField::create('Description', _t('HTMLEditorField.LINKDESCR', 'Link description')),
            TextField::create('Anchor', _t('HTMLEditorField.ANCHORVALUE', 'Anchor')),
            CheckboxField::create(
                'TargetBlank',
                _t('HTMLEditorField.LINKOPENNEWWIN', 'Open link in a new window?')
            ),
        ]);
        
        return $fields;
    }
    
    protected function getFormActions($controller, $name, $context)
    {
        $actions = FieldList::create([
            FormAction::create('insert', _t('CMSMain.INSERT', 'Insert file'))
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
