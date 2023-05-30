import React from 'react';
import IframeDialog from 'components/IframeDialog/IframeDialog';

export default {
    title: 'Admin/IframeDialog',
};

export const Dialog = () => (
    <IframeDialog url="https://silverstripe.org" isOpen title="iFrame Dialog" />
);
