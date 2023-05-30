import React from 'react';
import DatetimeField from 'components/DatetimeField/DatetimeField';
import ValueTracker from 'stories/ValueTracker';

const props = {
    name: 'MyField',
    title: 'Field title',
    lang: 'en_NZ',
};

export default {
    title: 'Admin/DatetimeField',
    decorators: [(Story) => <ValueTracker><Story/></ValueTracker>],
};

export const Basic = () => <DatetimeField {...props} />;

export const Html5 = () => (
    <DatetimeField
      {...props}
      data={{
        html5: true,
      }}
    />
);

Html5.story = {
    name: 'HTML5',
};
