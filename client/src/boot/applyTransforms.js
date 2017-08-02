import Injector from 'lib/Injector';
import classnames from 'classnames';

const applyTransforms = () => {
  Injector.transform(
    'form-action-changed',
    (updater) => {
      updater.form.alterSchema('*', form => {
        form.mutateField('action_save', (field) => {
          const isPristine = form.isPristine();
          const classes = classnames({
            [field.data.pristineClass]: isPristine,
            [field.data.dirtyClass]: !isPristine,
          });
          const customTitle = isPristine ? field.data.pristineTitle : field.data.dirtyTitle;
          const customIcon = isPristine ? field.data.pristineIcon : field.data.dirtyIcon;
          return {
            ...field,
            title: customTitle || field.title,
            icon: customIcon || field.icon,
            extraClass: classes,
          };
        });

        return form.getState();
      });
    }
  );
};

export default applyTransforms;
