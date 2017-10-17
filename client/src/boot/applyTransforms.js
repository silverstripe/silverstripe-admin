import Injector from 'lib/Injector';
import classnames from 'classnames';

const togglePristineState = (field, isPristine = false) => {
  // set pristine and dirty classes if they're defined
  const classes = (field.extraClass)
    ? field.extraClass.split(' ').reduce((prev, className) => ({
      ...prev,
      [className]: true,
    }), {})
    : {};
  if (typeof field.data.pristineClass === 'string') {
    classes[field.data.pristineClass] = isPristine;
  }
  if (typeof field.data.dirtyClass === 'string') {
    classes[field.data.dirtyClass] = !isPristine;
  }

  // custom titles and icons to replace the default
  const customTitle = isPristine ? field.data.pristineTitle : field.data.dirtyTitle;
  const customIcon = isPristine ? field.data.pristineIcon : field.data.dirtyIcon;

  return {
    ...field,
    title: customTitle || field.title,
    icon: customIcon || field.icon,
    extraClass: classnames(classes),
  };
};

const applyTransforms = () => {
  Injector.transform(
    'form-action-changed',
    (updater) => {
      updater.form.alterSchema('*', (form) => {
        form.mutateField('action_save', (field) => {
          const isPristine = form.isPristine();

          return togglePristineState(field, isPristine);
        });
        form.mutateField('action_publish', (field) => {
          const isPristine = field.data.isPublished && !field.data.isModified && form.isPristine();

          return togglePristineState(field, isPristine);
        });

        return form.getState();
      });
    },
  );
};

export default applyTransforms;
