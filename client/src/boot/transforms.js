import Injector from 'lib/Injector';
import classnames from 'classnames';

export default () => {
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
          return {
            ...field,
            title: (isPristine ? field.data.pristineTitle : field.data.dirtyTitle) || field.title,
            icon: (isPristine ? field.data.pristineIcon : field.data.dirtyIcon) || field.icon,
            extraClass: classes,
          };
        });

        return form.getState();
      });
    }
  );
};
