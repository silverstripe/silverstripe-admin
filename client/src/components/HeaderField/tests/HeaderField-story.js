import HeaderField from 'components/HeaderField/HeaderField';
import { jsxDecorator } from 'storybook-addon-jsx';

export default {
    title: 'Admin/HeaderField',
    component: HeaderField,
    decorators: [
        jsxDecorator
    ],
    argTypes: {
        extraClass: {
            control: 'text'
        },
        data: {
            title: {
                control: 'text'
            },
            headingLevel: {
                control: 'select',
                options: [1, 2, 3, 4, 5]
            }
        }
    }
};

export const Heading = {
    args: {
        extraClass: 'my-extra-class',
        data: {
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            headingLevel: 1
        }
    }
};
